export const fetchUser = async () => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/me`,
      {
        method: "GET",
        credentials: "include",
        signal,
      }
    );

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const userFromServer = await response.json();
      return userFromServer;
    }
  } catch (error) {
    console.error("Failed to verify user:", error);
    return null;
  } finally {
    controller.abort();
  }
};
