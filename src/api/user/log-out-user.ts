export const logOutUser = async () => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    await fetch(`${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/log-out`, {
      method: "POST",
      credentials: "include",
      signal,
    });

    return "Logged out";
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    controller.abort();
  }
};
