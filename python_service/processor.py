import io
import base64
from typing import Tuple, Dict, Any
from PIL import Image, ImageEnhance, ImageOps

# Attempt to import rembg; if unavailable or missing model, fallback smoothly
try:
    from rembg import remove as rembg_remove
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False


def process_product_image(
    input_bytes: bytes,
    target_size: Tuple[int, int] = (1000, 1000),
    bg_color: Tuple[int, int, int] = (255, 255, 255),
    remove_bg: bool = True,
    apply_enhancement: bool = True,
    quality: int = 85,
) -> Dict[str, Any]:
    """
    Standardizes and processes a craft product photo:
    1. Removes background using rembg (with automatic Pillow fallback).
    2. Crops to bounding box with padding and centers onto a 1:1 square canvas.
    3. Normalizes lighting and contrast.
    4. Compresses output JPEG.
    """
    input_image = Image.open(io.BytesIO(input_bytes))
    original_size = input_image.size
    bg_removed_success = False

    # Step 1: Background Removal with graceful fallback
    if remove_bg and REMBG_AVAILABLE:
        try:
            # Ensure input image has appropriate color mode
            if input_image.mode not in ("RGB", "RGBA"):
                input_image = input_image.convert("RGB")
            
            # Execute rembg
            output_rgba = rembg_remove(input_image)
            input_image = output_rgba
            bg_removed_success = True
        except Exception as e:
            print(f"[AI Image Studio Warning]: rembg background removal failed ({e}). Using intelligent crop fallback.")
            bg_removed_success = False

    # Step 2: Intelligent 1:1 Standardization & Centering
    if input_image.mode == "RGBA":
        # Extract alpha channel bounding box to tightly frame the craft item
        alpha = input_image.split()[-1]
        bbox = alpha.getbbox()

        if bbox:
            cropped = input_image.crop(bbox)
        else:
            cropped = input_image

        # Calculate proportional scaling to fit comfortably within target size (80% of canvas)
        crop_w, crop_h = cropped.size
        max_dim = int(target_size[0] * 0.85)

        scale = min(max_dim / crop_w, max_dim / crop_h)
        new_w = max(1, int(crop_w * scale))
        new_h = max(1, int(crop_h * scale))
        resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

        # Create pure studio square canvas
        studio_canvas = Image.new("RGB", target_size, bg_color)

        # Paste centered using alpha mask
        paste_x = (target_size[0] - new_w) // 2
        paste_y = (target_size[1] - new_h) // 2
        studio_canvas.paste(resized, (paste_x, paste_y), mask=resized.split()[-1])
        final_image = studio_canvas
    else:
        # Fallback: Square crop and center
        if input_image.mode != "RGB":
            input_image = input_image.convert("RGB")

        # Smart square crop (center crop)
        w, h = input_image.size
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        cropped = input_image.crop((left, top, left + min_dim, top + min_dim))
        final_image = cropped.resize(target_size, Image.Resampling.LANCZOS)

    # Step 3: Subtle Studio Lighting & Contrast Enhancement
    if apply_enhancement:
        # Increase contrast slightly for crisp craft textures
        contrast_enhancer = ImageEnhance.Contrast(final_image)
        final_image = contrast_enhancer.enhance(1.06)

        # Subtle sharpness boost
        sharpness_enhancer = ImageEnhance.Sharpness(final_image)
        final_image = sharpness_enhancer.enhance(1.1)

    # Step 4: Compress to optimized JPEG
    out_buffer = io.BytesIO()
    final_image.save(out_buffer, format="JPEG", quality=quality, optimize=True)
    out_bytes = out_buffer.getvalue()

    base64_encoded = f"data:image/jpeg;base64,{base64.b64encode(out_bytes).decode('utf-8')}"

    return {
        "success": True,
        "processed_base64": base64_encoded,
        "bg_removed": bg_removed_success,
        "width": target_size[0],
        "height": target_size[1],
        "size_bytes": len(out_bytes),
        "original_size": list(original_size),
    }
