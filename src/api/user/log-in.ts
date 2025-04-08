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
    const modal = document.getElementById("login_modal") as HTMLDialogElement;
    modal?.close();

    emailRef = null;
  } finally {
    controller.abort();
  }
};
