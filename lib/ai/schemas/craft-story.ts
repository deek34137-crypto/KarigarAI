import { z } from "zod";

export const CraftStorySchema = z.object({
  storyEnglish: z.string().min(10).max(1200),
  storyHindi: z.string().min(10).max(1200),
  traditionalProcess: z.string().min(5).max(600),
  generationalLineage: z.string().min(3).max(400),
});

export type CraftStoryResult = z.infer<typeof CraftStorySchema>;
