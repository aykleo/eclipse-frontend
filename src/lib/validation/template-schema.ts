import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().min(5, "Name needs at least 5 characters"),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      notes: z.string().optional(),
    })
  ),
});
