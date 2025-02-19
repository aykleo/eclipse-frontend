import { z } from "zod";
import { exerciseSchema } from "../../../lib/validation/exercise-schema";
import {
  createOrUpdateExercise,
  ExerciseFormData,
} from "./fetch-create-update-exercise";
import { QueryClient } from "@tanstack/react-query";

export const handleExerciseCreation = async (
  formData: ExerciseFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPrimaryMuscleGroupId: React.Dispatch<React.SetStateAction<string | null>>,
  setMuscleGroupIds: React.Dispatch<React.SetStateAction<string[]>>,
  queryClient: QueryClient,
  setStatusText: (statusText: string | null) => void,
  setIsCreatingExercise?: (isCreatingExercise: boolean) => void
) => {
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
        setTimeout(() => setStatusText(null), 3000);
        throw new Error("Please select a valid category from the list.");
      } else {
        const errorMessage = e.errors.map((error) => error.message).join(", ");
        setTimeout(() => setStatusText(null), 3000);
        throw new Error(errorMessage);
      }
    }
  }

  const createdExercise = await createOrUpdateExercise(
    formData,
    setIsLoading,
    setPrimaryMuscleGroupId,
    setMuscleGroupIds,
    setStatusText
  );

  if (createdExercise) {
    queryClient.invalidateQueries({
      queryKey: ["exercises"],
    });
    if (setIsCreatingExercise) {
      setIsCreatingExercise(false);
    }
    setStatusText("Exercise created successfully.");
    setTimeout(() => setStatusText(null), 3000);
  }

  return createdExercise;
};
