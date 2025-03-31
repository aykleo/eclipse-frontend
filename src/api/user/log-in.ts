export const logIn = async (
  emailRef: string | null,
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
      }/authenticate?email=${emailRef}`,
      {
        method: "POST",
        signal,
      }
    );

    if (!response.ok) {
      const errorResponse = await response.text();
      const errorJson = JSON.parse(errorResponse);

      setStatusText(errorJson.message);

      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }

    setStatusText("Sign in link sent to your email");

    const timeout = setTimeout(() => {
      setStatusText(null);
      const modal = document.getElementById("login_modal") as HTMLDialogElement;
      modal?.close();
    }, 2000);

    emailRef = null;

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
