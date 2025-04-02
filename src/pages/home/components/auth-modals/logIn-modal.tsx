import { z } from "zod";
import React, { useRef, useState } from "react";

import { SpiningModal } from "../../../../components/modals/spining-modal";
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

      logIn(emailRef.current, setIsLoading, setStatusText);
    }
  };

  return (
    <SpiningModal
      id="login_modal"
      formRef={formRef as React.RefObject<HTMLFormElement>}
      handleSubmit={handleSubmit}
    >
      <p className="text-gray-300 text-3xl font-bold">Welcome back</p>

      <div className="h-[1px] w-full bg-gray-800 rounded-full" />
      <div className="form-control flex flex-col gap-y-2">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="Email"
            required
            onInput={(e) => {
              emailRef.current = e.currentTarget.value;
            }}
          />
        </label>
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
    </SpiningModal>
  );
};
