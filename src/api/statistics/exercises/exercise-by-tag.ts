export async function handleExerciseByTag() {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/exercise/by-tag`,
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
      numberOfExercises: data.numberOfExercises,
      exerciseCountsByCategory: data.exerciseCountsByCategory,
    };
  } catch (error) {
    console.error("Error fetching exercises by tag:", error);
    return { error: (error as Error).message || "An error occurred" };
  } finally {
    controller.abort();
  }
}
