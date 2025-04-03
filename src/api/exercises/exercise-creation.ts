import { z } from "zod";
import { exerciseSchema } from "../../lib/validation/exercise-schema";
import {
  createOrUpdateExercise,
  ExerciseFormData,
} from "./fetch-create-update-exercise";

export type ExerciseCreationResult = {
  success: boolean;
  data?: ReturnType<typeof createOrUpdateExercise> extends Promise<infer T>
    ? T
    : never;
  error?: string;
};

export const handleExerciseCreation = async (
  formData: ExerciseFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<ExerciseCreationResult> => {
  setIsLoading(true);

  try {
    exerciseSchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const specificError = e.errors.find((error) =>
        error.message.includes(
          "Invalid enum value. Expected 'ENDURANCE' | 'MOVEMENT' | 'PLYOMETRICS' | 'STRENGTH'"
        )
      );

      if (specificError) {
        setIsLoading(false);
        return {
          success: false,
          error: "Please select a valid category from the list.",
        };
      } else {
        const errorMessage = e.errors.map((error) => error.message).join(", ");
        setIsLoading(false);
        return {
          success: false,
          error: errorMessage,
        };
      }
    }

    setIsLoading(false);
    return {
      success: false,
      error: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }

  try {
    const exercise = await createOrUpdateExercise(formData);
    setIsLoading(false);
    return {
      success: true,
      data: exercise,
    };
  } catch (error) {
    setIsLoading(false);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create exercise",
    };
  }
};
