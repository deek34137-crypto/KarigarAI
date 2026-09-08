"use server";

import { spawn } from "child_process";
import path from "path";

export interface ImageStudioProcessResult {
  success: boolean;
  processedBase64: string;
  bgRemoved: boolean;
  width: number;
  height: number;
  sizeBytes: number;
  originalSize?: [number, number];
  error?: string;
}

/**
 * Executes Python image-processing service via CLI subprocess with JSON stdin/stdout.
 * Includes graceful fallback if Python or rembg encounters any error.
 */
export async function processImageStudioAction(params: {
  imageBase64: string;
  removeBg?: boolean;
  quality?: number;
}): Promise<ImageStudioProcessResult> {
  const { imageBase64, removeBg = true, quality = 85 } = params;

  return new Promise((resolve) => {
    try {
      const scriptPath = path.join(process.cwd(), "python_service", "cli.py");
      const pythonProcess = spawn("python", [scriptPath]);

      let stdoutData = "";
      let stderrData = "";

      pythonProcess.stdout.on("data", (chunk) => {
        stdoutData += chunk.toString();
      });

      pythonProcess.stderr.on("data", (chunk) => {
        stderrData += chunk.toString();
      });

      pythonProcess.on("error", (err) => {
        console.warn("[Image Studio Warning]: Python process spawn failed:", err.message);
        // Fallback: return original image with fallback flag
        resolve({
          success: true,
          processedBase64: imageBase64,
          bgRemoved: false,
          width: 1000,
          height: 1000,
          sizeBytes: 0,
          error: "Python service unavailable, used original image fallback.",
        });
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.warn("[Image Studio Warning]: Python process exited with code", code, stderrData);
          resolve({
            success: true,
            processedBase64: imageBase64,
            bgRemoved: false,
            width: 1000,
            height: 1000,
            sizeBytes: 0,
            error: stderrData || "Processing fallback applied.",
          });
          return;
        }

        try {
          const result = JSON.parse(stdoutData.trim()) as ImageStudioProcessResult;
          resolve(result);
        } catch (parseErr) {
          console.warn("[Image Studio Warning]: Failed to parse Python stdout:", stdoutData);
          resolve({
            success: true,
            processedBase64: imageBase64,
            bgRemoved: false,
            width: 1000,
            height: 1000,
            sizeBytes: 0,
            error: "Output parse fallback.",
          });
        }
      });

      // Write input JSON to python process stdin
      const payload = JSON.stringify({
        imageBase64,
        removeBg,
        quality,
      });

      pythonProcess.stdin.write(payload);
      pythonProcess.stdin.end();
    } catch (outerErr: any) {
      console.warn("[Image Studio Warning]: Unexpected error in processImageStudioAction:", outerErr);
      resolve({
        success: true,
        processedBase64: imageBase64,
        bgRemoved: false,
        width: 1000,
        height: 1000,
        sizeBytes: 0,
        error: outerErr?.message,
      });
    }
  });
}
