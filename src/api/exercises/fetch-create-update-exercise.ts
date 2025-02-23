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
        setIsLoading(false);
        throw new Error("Unexpected error");
      }

      setIsLoading(false);
      throw new Error(errorJson.message);
    }
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
