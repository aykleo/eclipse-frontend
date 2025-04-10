import { z } from "zod";

export const historySetSchema = z.object({
  weight: z.number().positive("Weight must be a positive number"),
  reps: z.number().int().positive("Reps must be a positive integer"),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

export const historySchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
  sets: z
    .array(
      z.array(historySetSchema, {
        required_error: "Each exercise must have at least one set",
      })
    )
    .min(1, "At least one exercise with sets is required"),
});

export type CreateHistoryFormData = z.infer<typeof historySchema>;
