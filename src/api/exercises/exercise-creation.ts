import { z } from "zod";
import { exerciseSchema } from "../../lib/validation/exercise-schema";
import {
  createOrUpdateExercise,
  ExerciseFormData,
} from "./fetch-create-update-exercise";
export const handleExerciseCreation = async (
  formData: ExerciseFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPrimaryMuscleGroupId: React.Dispatch<React.SetStateAction<string | null>>,
  setMuscleGroupIds: React.Dispatch<React.SetStateAction<string[]>>,
  setIsCreatingExercise?: (isCreatingExercise: boolean) => void
) => {
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
        throw new Error("Please select a valid category from the list.");
      } else {
        const errorMessage = e.errors.map((error) => error.message).join(", ");
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    }
  }

  const createdExercise = await createOrUpdateExercise(
    formData,
    setIsLoading,
    setPrimaryMuscleGroupId,
    setMuscleGroupIds
  );

  if (createdExercise) {
    if (setIsCreatingExercise) {
      setIsCreatingExercise(false);
    }
  }
  setIsLoading(false);
  return createdExercise;
};
