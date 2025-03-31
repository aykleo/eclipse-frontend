import { z } from "zod";
import { exerciseSchema } from "../../lib/validation/exercise-schema";
import {
  createOrUpdateExercise,
  ExerciseFormData,
} from "./fetch-create-update-exercise";
import { Exercise } from "../../utils/types/exercise-types";

export const handleExerciseUpdate = async (
  formData: ExerciseFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPrimaryMuscleGroupId: React.Dispatch<React.SetStateAction<string | null>>,
  setMuscleGroupIds: React.Dispatch<React.SetStateAction<string[]>>,
  exerciseForUpdate: Exercise
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

  await createOrUpdateExercise(formData, exerciseForUpdate.id)
    .then((updatedExercise) => {
      setPrimaryMuscleGroupId("");
      setMuscleGroupIds([]);
      return updatedExercise;
    })
    .catch((error) => {
      throw new Error(error);
    })
    .finally(() => {
      setIsLoading(false);
    });
};
