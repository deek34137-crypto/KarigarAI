import { GoogleGenerativeAI, Part } from "@google/generative-ai";

/**
 * Server-only Google Gemini Client wrapper.
 * Ensures API key is never exposed to the client and wraps calls in robust error handling.
 */

let geminiClientInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables. Please check .env.local."
    );
  }

  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenerativeAI(apiKey);
  }

  return geminiClientInstance;
}

/**
 * Strips data URL prefix (e.g. data:image/jpeg;base64,) if present
 */
export function stripBase64Prefix(input: string): string {
  if (input.includes(",")) {
    return input.split(",")[1];
  }
  return input;
}

/**
 * Cleans potential markdown fences (e.g. ```json ... ```) from model output.
 */
export function sanitizeJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Standardized execution wrapper for Gemini calls with error mapping.
 */
export async function runGeminiJsonCall<T>(params: {
  model?: string;
  systemInstruction?: string;
  prompt: string;
  imagePart?: {
    inlineData: {
      data: string;
      mimeType: string;
    };
  };
  validator: (rawJson: unknown) => T;
}): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Server cannot execute AI analysis.");
  }

  const client = getGeminiClient();
  const modelsToTry = params.model
    ? [params.model, "gemini-3.5-flash-lite", "gemini-3.6-flash"]
    : ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
        systemInstruction: params.systemInstruction,
      });

      const parts: (string | Part)[] = [];
      if (params.imagePart) {
        parts.push({
          inlineData: {
            data: stripBase64Prefix(params.imagePart.inlineData.data),
            mimeType: params.imagePart.inlineData.mimeType,
          },
        });
      }
      parts.push(params.prompt);

      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const sanitized = sanitizeJsonResponse(text);
      const parsed = JSON.parse(sanitized);
      return params.validator(parsed);
    } catch (error: any) {
      console.warn(`[Gemini Model ${modelName} Warning]:`, error?.message || error);
      lastError = error;
    }
  }

  console.error("[KarigarAI Gemini Service Error]: All models failed.", lastError?.message || lastError);
  throw new Error(
    lastError?.message || "Failed to process AI request across all available Gemini models."
  );
}
