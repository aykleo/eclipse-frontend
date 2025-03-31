export async function handleExerciseByMuscleGroup(weight: number) {
  const controller = new AbortController();
  const signal = controller.signal;

  const queryParams = new URLSearchParams({
    weight: weight.toString() || "0",
  });

  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_ECLIPSE_DEV_API_URL
      }/exercise/by-muscle-group?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        credentials: "include",
      }
    );

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
