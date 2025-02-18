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

      if (!errorJson) {
        return;
      }

      setStatusText(errorJson.message);

      setTimeout(() => {
        setStatusText(null);
      }, 2000);

      return;
    }

    setStatusText("Sign in link sent to your email");

    setTimeout(() => {
      setStatusText(null);
      const modal = document.getElementById("login_modal") as HTMLDialogElement;
      modal?.close();
    }, 2000);

    emailRef = null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      setStatusText("Server error. Please try again later.");
    } else {
      setStatusText("An unexpected error occurred. Please try again later.");
    }
    setTimeout(() => {
      setStatusText(null);
    }, 1000);
  } finally {
    controller.abort();
    setIsLoading(false);
  }
};
