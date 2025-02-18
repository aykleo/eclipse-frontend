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
  if (
    formData.primaryMuscleGroupId === "Primary mover" ||
    formData.primaryMuscleGroupId === null ||
    formData.primaryMuscleGroupId === ""
  ) {
    throw new Error("Please select a primary mover");
  }

  try {
    exerciseSchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const enumError = e.errors.find((error) =>
        error.message.includes("Invalid enum value")
      );
      if (enumError) {
        throw new Error("Please select a valid category from the list.");
      }
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
