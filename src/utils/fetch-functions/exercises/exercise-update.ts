import { z } from "zod";
import { exerciseSchema } from "../../../lib/validation/exercise-schema";
import {
  createOrUpdateExercise,
  ExerciseFormData,
} from "./fetch-create-update-exercise";
import { Exercise } from "../../types/exercise-types";

export const handleExerciseUpdate = async (
  formData: ExerciseFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPrimaryMuscleGroupId: React.Dispatch<React.SetStateAction<string | null>>,
  setMuscleGroupIds: React.Dispatch<React.SetStateAction<string[]>>,
  setStatusText: (statusText: string | null) => void,
  exerciseForUpdate: Exercise
) => {
  try {
    exerciseSchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const enumError = e.errors.find((error) =>
        error.message.includes(
          "Invalid enum value. Expected 'ENDURANCE' | 'MOVEMENT' | 'PLYOMETRICS' | 'STRENGTH'"
        )
      );
      if (enumError) {
        setTimeout(() => setStatusText(null), 3000);
        throw new Error("Please select a valid category from the list.");
      }
      setTimeout(() => setStatusText(null), 3000);
      throw new Error("Please fill in all fields.");
    }
  }

  const updateExercise = await createOrUpdateExercise(
    formData,
    setIsLoading,
    setPrimaryMuscleGroupId,
    setMuscleGroupIds,
    setStatusText,
    exerciseForUpdate.id
  );

  return updateExercise;
};
