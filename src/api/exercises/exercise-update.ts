import { z } from "zod";
import { exerciseSchema } from "../../lib/validation/exercise-schema";
import {
  createOrUpdateExercise,
  ExerciseFormData,
} from "./fetch-create-update-exercise";
import { Exercise } from "../../utils/types/exercise-types";

export type ExerciseUpdateResult = {
  success: boolean;
  data?: ReturnType<typeof createOrUpdateExercise> extends Promise<infer T>
    ? T
    : never;
  error?: string;
};

export const handleExerciseUpdate = async (
  formData: ExerciseFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  exerciseForUpdate: Exercise
): Promise<ExerciseUpdateResult> => {
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
    const updatedExercise = await createOrUpdateExercise(
      formData,
      exerciseForUpdate.id
    );
    setIsLoading(false);
    return {
      success: true,
      data: updatedExercise,
    };
  } catch (error) {
    setIsLoading(false);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update exercise",
    };
  }
};
