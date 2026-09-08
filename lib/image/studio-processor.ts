/**
 * Client-side Studio Image Processor for KarigarAI
 * Performs 1:1 standardization, studio background softening/dissolve,
 * studio lighting normalization, and warm artisanal lightbox backdrops.
 * Ensures zero-dependency, reliable performance on Vercel serverless.
 */

export interface StudioProcessResult {
  base64: string;
  width: number;
  height: number;
  sizeBytes: number;
  sizeFormatted: string;
}

export async function processCraftStudioImage(
  imageBase64: string,
  targetSize = 1000
): Promise<StudioProcessResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Studio processing is only available in browser environments"));
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      reject(new Error("Failed to load source image for studio enhancement"));
    };

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas 2D context not available"));
        }

        // 1. High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // 2. Artisanal Studio Lightbox Backdrop (Warm neutral gradient)
        const studioGradient = ctx.createRadialGradient(
          targetSize * 0.5,
          targetSize * 0.42,
          targetSize * 0.08,
          targetSize * 0.5,
          targetSize * 0.5,
          targetSize * 0.72
        );
        studioGradient.addColorStop(0, "#FFFFFF");
        studioGradient.addColorStop(0.55, "#FBF9F6"); // Warm handmade studio tint
        studioGradient.addColorStop(0.85, "#F5EFEB");
        studioGradient.addColorStop(1, "#EAE1D7");

        ctx.fillStyle = studioGradient;
        ctx.fillRect(0, 0, targetSize, targetSize);

        // 3. Realistic Soft Commercial Contact Shadow under craft
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          targetSize * 0.5,
          targetSize * 0.85,
          targetSize * 0.38,
          targetSize * 0.055,
          0,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "rgba(45, 25, 15, 0.16)";
        ctx.filter = "blur(14px)";
        ctx.fill();
        ctx.restore();

        // 4. Proportional Dimensions (occupies ~84% of canvas)
        const maxDim = targetSize * 0.82;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const drawW = Math.round(img.width * scale);
        const drawH = Math.round(img.height * scale);
        const drawX = Math.round((targetSize - drawW) / 2);
        const drawY = Math.round((targetSize - drawH) / 2 - targetSize * 0.02);

        // 5. Create feathered craft canvas to dissolve background clutter into studio lightbox
        const craftCanvas = document.createElement("canvas");
        craftCanvas.width = drawW;
        craftCanvas.height = drawH;
        const craftCtx = craftCanvas.getContext("2d");

        if (craftCtx) {
          craftCtx.imageSmoothingEnabled = true;
          craftCtx.imageSmoothingQuality = "high";

          // Boost contrast (+20%), brightness (+8%), and saturation (+18%) for commercial vibrancy
          craftCtx.filter = "contrast(120%) brightness(108%) saturate(118%)";
          craftCtx.drawImage(img, 0, 0, drawW, drawH);

          // Feather edges smoothly so background noise dissolves into the clean studio lightbox
          craftCtx.filter = "none";
          craftCtx.globalCompositeOperation = "destination-in";
          const mask = craftCtx.createRadialGradient(
            drawW * 0.5,
            drawH * 0.52,
            Math.min(drawW, drawH) * 0.28,
            drawW * 0.5,
            drawH * 0.5,
            Math.min(drawW, drawH) * 0.49
          );
          mask.addColorStop(0, "rgba(0, 0, 0, 1)");
          mask.addColorStop(0.72, "rgba(0, 0, 0, 0.98)");
          mask.addColorStop(0.92, "rgba(0, 0, 0, 0.45)");
          mask.addColorStop(1, "rgba(0, 0, 0, 0)");

          craftCtx.fillStyle = mask;
          craftCtx.fillRect(0, 0, drawW, drawH);

          // Draw the isolated & enhanced craft onto the studio canvas
          ctx.drawImage(craftCanvas, drawX, drawY);
        } else {
          // Fallback direct draw
          ctx.save();
          ctx.filter = "contrast(120%) brightness(108%) saturate(118%)";
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();
        }

        // 6. Overhead Softbox Light Sheen
        ctx.save();
        const highlightGradient = ctx.createLinearGradient(0, 0, 0, targetSize * 0.45);
        highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.14)");
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = highlightGradient;
        ctx.fillRect(0, 0, targetSize, targetSize * 0.45);
        ctx.restore();

        // 7. Subtle commercial corner vignette for focus
        ctx.save();
        const vignette = ctx.createRadialGradient(
          targetSize * 0.5,
          targetSize * 0.5,
          targetSize * 0.44,
          targetSize * 0.5,
          targetSize * 0.5,
          targetSize * 0.72
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(50, 30, 15, 0.05)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, targetSize, targetSize);
        ctx.restore();

        // 8. Export as compressed studio JPEG
        const base64 = canvas.toDataURL("image/jpeg", 0.88);

        canvas.toBlob(
          (blob) => {
            const sizeBytes = blob?.size || 0;
            resolve({
              base64,
              width: targetSize,
              height: targetSize,
              sizeBytes,
              sizeFormatted: `${(sizeBytes / 1024).toFixed(1)} KB`,
            });
          },
          "image/jpeg",
          0.88
        );
      } catch (err: any) {
        reject(new Error(`Studio processing failed: ${err?.message || err}`));
      }
    };

    img.src = imageBase64;
  });
}
