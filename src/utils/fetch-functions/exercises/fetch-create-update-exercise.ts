export type ExerciseFormData = {
  exerciseId?: string;
  tagId?: string;
  name: string;
  description: string;
  tagName: string;
  category: string;
  primaryMuscleGroupId: string;
  muscleGroupIds: string[];
};

export const createOrUpdateExercise = async (
  formData: ExerciseFormData,
  setIsLoading: (isLoading: boolean) => void,
  setPrimaryMuscleGroupId: (primaryMuscleGroupId: string | "") => void,
  setMuscleGroupIds: (muscleGroupIds: string[]) => void,
  setStatusText: (statusText: string | null) => void,
  exerciseForUpdateId?: string
): Promise<string> => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/exercise/${
        !exerciseForUpdateId ? "create" : `update/${formData.exerciseId}`
      }`,
      {
        method: !exerciseForUpdateId ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal,
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.text();
      const errorJson = JSON.parse(errorResponse);

      if (!errorJson) {
        setTimeout(() => setStatusText(null), 3000);
        throw new Error("Unexpected error");
      }
      setTimeout(() => setStatusText(null), 3000);
      throw new Error(errorJson.message);
    }
    setStatusText(
      exerciseForUpdateId ? "Exercise updated" : "Exercise created"
    );
    setTimeout(() => setStatusText(null), 3000);
    setPrimaryMuscleGroupId("");
    setMuscleGroupIds([]);

    return exerciseForUpdateId ? "Exercise updated" : "Exercise created";
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Server error. Please try again later.");
  } finally {
    controller.abort();
    setIsLoading(false);
  }
};
