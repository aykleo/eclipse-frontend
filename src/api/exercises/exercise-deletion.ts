export const handleExerciseDeletion = async (exerciseId: string) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    await fetch(
      `${
        import.meta.env.VITE_ECLIPSE_DEV_API_URL
      }/exercise/delete/${exerciseId}`,
      {
        method: "POST",
        credentials: "include",
        signal,
      }
    );
  } catch (error) {
    console.error("Failed to delete exercise:", error);
  } finally {
    controller.abort();
  }
};
