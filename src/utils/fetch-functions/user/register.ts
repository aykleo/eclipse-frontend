export const registerUser = async (
  emailRef: string | null,
  usernameRef: string | null,
  setIsLoading: (isLoading: boolean) => void,
  setStatusText: (statusText: string | null) => void
) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    setIsLoading(true);
    const response = await fetch(
      `${
        import.meta.env.VITE_ECLIPSE_DEV_API_URL
      }/register?email=${emailRef}&username=${usernameRef}`,
      {
        method: "POST",
        signal,
      }
    );

    if (!response.ok) {
      const errorResponse = await response.text();

      const errorJson = JSON.parse(errorResponse);

      if (!errorJson) {
        return "Error parsing";
      }

      setStatusText(errorJson.message);

      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }

    setStatusText("Please check your email to validate your account.");

    const timeout = setTimeout(() => {
      setStatusText(null);
      const modal = document.getElementById(
        "register_modal"
      ) as HTMLDialogElement;
      modal?.close();
    }, 3000);

    emailRef = null;
    usernameRef = null;

    return () => clearTimeout(timeout);
  } catch (error: unknown) {
    if (error instanceof Error) {
      setStatusText("Server error. Please try again later.");
    } else {
      setStatusText("An unexpected error occurred. Please try again later.");
    }
    const timeout = setTimeout(() => {
      setStatusText(null);
    }, 1000);

    return () => clearTimeout(timeout);
  } finally {
    controller.abort();
    setIsLoading(false);
  }
};
