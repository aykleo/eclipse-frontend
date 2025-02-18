export const fetchMuscleGroups = async () => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/muscle-groups`,
      {
        method: "GET",
        credentials: "include",
        signal,
      }
    );

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const muscleGroups = await response.json();

        return muscleGroups;
      }
    }
  } catch (error) {
    console.error("Failed to verify user:", error);
  } finally {
    controller.abort();
  }
};
