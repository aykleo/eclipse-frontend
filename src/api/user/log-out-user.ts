export const logOutUser = async () => {
  try {
    await fetch(`${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/log-out`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
