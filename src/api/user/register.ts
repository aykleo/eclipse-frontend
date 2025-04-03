export const registerUser = async (
  emailRef: string | null,
  usernameRef: string | null,

  setStatusText: (statusText: string | null) => void
) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
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
  } finally {
    controller.abort();
  }
};
