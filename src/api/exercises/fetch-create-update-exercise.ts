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
  exerciseForUpdateId?: string
) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    await fetch(
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
  } finally {
    controller.abort();
  }
};
