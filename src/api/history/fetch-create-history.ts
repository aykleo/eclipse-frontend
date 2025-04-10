import { CreateHistoryFormData } from "../../lib/validation/history-schema";
import { WorkoutHistory } from "../../utils/types/history-types";

export const createWorkoutHistory = async (
  formData: CreateHistoryFormData
): Promise<{ workoutHistory: WorkoutHistory }> => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/workout/create-history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal,
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create workout history");
    }

    return response.json();
  } finally {
    controller.abort();
  }
};
