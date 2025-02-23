export async function handleExerciseByMuscleGroup() {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/exercise/by-muscle-group`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Unknown error occurred");
    }

    const data = await response.json();

    return {
      exerciseCountsByMuscleGroup: data.exerciseCountsByMuscleGroup,
    };
  } catch (error) {
    console.error("Error fetching exercises by tag:", error);
    return { error: (error as Error).message || "An error occurred" };
  } finally {
    controller.abort();
  }
}
