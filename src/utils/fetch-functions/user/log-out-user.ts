export const logOutUser = async () => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/log-out`,
      {
        method: "POST",
        credentials: "include",
        signal,
      }
    );

    if (response.ok) {
      return "Logged out";
    } else {
      console.error("Failed to log out");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    controller.abort();
  }
};
