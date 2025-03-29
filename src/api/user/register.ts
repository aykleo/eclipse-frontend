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
    await fetch(
      `${
        import.meta.env.VITE_ECLIPSE_DEV_API_URL
      }/register?email=${emailRef}&username=${usernameRef}`,
      {
        method: "POST",
        signal,
      }
    );

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
