import { z } from "zod";
import { TagCategory } from "../../utils/types/exercise-types";

export const exerciseSchema = z.object({
  name: z.string().min(5, "Name needs at least 5 characters"),
  description: z.string().optional(),
  tagName: z.string().min(3, "Type needs at least 3 characters"),
  category: z.nativeEnum(TagCategory).refine(
    (value) =>
      (value !== TagCategory.ENDURANCE &&
        value !== TagCategory.MOVEMENT &&
        value !== TagCategory.PLYOMETRICS &&
        value !== TagCategory.STRENGTH) || {
        message: "You must select a category",
      }
  ),
  primaryMuscleGroupId: z
    .string()
    .nonempty("Select the primary mover")
    .refine((value) => value !== "Primary mover", {
      message: "You must select a primary mover",
    }),
  muscleGroupIds: z.array(z.string()),
});
