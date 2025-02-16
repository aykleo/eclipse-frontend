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
        console.log("Error parsing");
        return;
      }

      setStatusText(errorJson.message);

      setTimeout(() => {
        setStatusText(null);
      }, 2000);

      return;
    }

    setStatusText("Please check your email to validate your account.");

    setTimeout(() => {
      setStatusText(null);
      const modal = document.getElementById(
        "register_modal"
      ) as HTMLDialogElement;
      modal?.close();
    }, 3000);

    emailRef = null;
    usernameRef = null;
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
