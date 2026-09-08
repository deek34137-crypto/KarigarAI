/**
 * Client-side HTML5 Canvas Image Compression Utility
 * Resizes large smartphone camera photos (often 8MB - 20MB) down to <= 2MB
 * to ensure rapid transmission over 3G/4G networks and fast Gemini processing.
 */

export interface CompressionResult {
  base64: string;
  blob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  sizeFormatted: string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file."));

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject(new Error("Failed to load image data."));

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio-preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Canvas 2D context not supported."));
        }

        // High quality bicubic scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed JPEG
        const base64 = canvas.toDataURL("image/jpeg", quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas blob conversion failed."));
            }

            resolve({
              base64,
              blob,
              width,
              height,
              sizeBytes: blob.size,
              sizeFormatted: formatBytes(blob.size),
            });
          },
          "image/jpeg",
          quality
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
