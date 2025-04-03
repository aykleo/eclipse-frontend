export const logIn = async (
  emailRef: string | null,

  setStatusText: (statusText: string | null) => void
) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    await fetch(
      `${
        import.meta.env.VITE_ECLIPSE_DEV_API_URL
      }/authenticate?email=${emailRef}`,
      {
        method: "POST",
        signal,
      }
    );

    setStatusText("Sign in link sent to your email");

    const timeout = setTimeout(() => {
      setStatusText(null);
      const modal = document.getElementById("login_modal") as HTMLDialogElement;
      modal?.close();
    }, 2000);

    emailRef = null;

    return () => clearTimeout(timeout);
  } finally {
    controller.abort();
  }
};
