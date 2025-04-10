import { z } from "zod";
import {
  CreateHistoryFormData,
  historySchema,
} from "../../lib/validation/history-schema";
import { WorkoutHistory } from "../../utils/types/history-types";
import { createWorkoutHistory } from "./fetch-create-history";

export type HistoryCreationResult = {
  success: boolean;
  data?: {
    workoutHistory: WorkoutHistory;
  };
  error?: string;
};

export const handleHistoryCreation = async (
  formData: CreateHistoryFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<HistoryCreationResult> => {
  setIsLoading(true);

  try {
    historySchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessage = e.errors.map((error) => error.message).join(", ");
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }

    setIsLoading(false);
    return {
      success: false,
      error: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }

  try {
    const workoutHistory = await createWorkoutHistory(formData);
    setIsLoading(false);
    return {
      success: true,
      data: workoutHistory,
    };
  } catch (error) {
    setIsLoading(false);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create workout history",
    };
  }
};
