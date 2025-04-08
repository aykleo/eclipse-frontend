import { z } from "zod";
import React, { useRef, useState } from "react";
import { Input } from "../../../../components/forms/input";
import { GeneralModal } from "../../../../components/modals/general-modal";
import { loginSchema } from "../../../../lib/validation/auth-schemas";
import { logIn } from "../../../../api/user/log-in";
import { useStatus } from "../../../../hooks/status/status-context";

export const LogInModal = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<string | null>(null);
  const { setStatusText } = useStatus();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (formRef.current) {
      const formData = {
        email: emailRef.current,
      };

      try {
        loginSchema.parse(formData);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setStatusText(e.errors.map((error) => error.message).join(", "));
          const timeout = setTimeout(() => {
            setStatusText(null);
          }, 1000);
          return () => clearTimeout(timeout);
        }
      }

      logIn(emailRef.current, setStatusText)
        .then(() => {
          setStatusText("Sign in link sent to your email");
          const timeout = setTimeout(() => {
            setStatusText(null);
          }, 1000);
          return () => clearTimeout(timeout);
        })
        .catch(() => {
          setStatusText("Server error. Please try again later.");
          const timeout = setTimeout(() => {
            setStatusText(null);
          }, 1000);
          return () => clearTimeout(timeout);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <GeneralModal
      id="login_modal"
      formRef={formRef as React.RefObject<HTMLFormElement>}
      handleSubmit={handleSubmit}
    >
      <p className="text-gray-300 text-3xl font-bold">Welcome back</p>

      <div className="h-[1px] w-full bg-gray-800 rounded-full" />
      <div className="form-control flex flex-col gap-y-2">
        <Input
          hasLabel={true}
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          required
          onInput={(e) => {
            emailRef.current = e.currentTarget.value;
          }}
        />
      </div>

      <div className="form-control mt-3">
        <button
          disabled={isLoading}
          className={`text-gray-400 btn bg-zinc-900 border  border-gray-600/25 shadow-none w-full rounded-lg`}
        >
          {isLoading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </GeneralModal>
  );
};
