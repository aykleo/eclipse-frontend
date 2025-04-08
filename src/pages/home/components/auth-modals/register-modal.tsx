import { z } from "zod";
import React, { useRef, useState } from "react";

import { GeneralModal } from "../../../../components/modals/general-modal";
import { registerSchema } from "../../../../lib/validation/auth-schemas";
import { registerUser } from "../../../../api/user/register";
import { useStatus } from "../../../../hooks/status/status-context";
import { Input } from "../../../../components/forms/input";

export const RegisterModal = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const usernameRef = useRef<string | null>(null);
  const emailRef = useRef<string | null>(null);
  const { setStatusText } = useStatus();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (formRef.current) {
      const formData = {
        username: usernameRef.current,
        email: emailRef.current,
      };

      try {
        registerSchema.parse(formData);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setIsLoading(false);
          return setStatusText(
            e.errors.map((error) => error.message).join(", ")
          );
        }
      }

      registerUser(emailRef.current, usernameRef.current, setStatusText)
        .then(() => {
          setStatusText("Please check your email to validate your account.");
          const modal = document.getElementById(
            "register_modal"
          ) as HTMLDialogElement;
          modal?.close();
        })
        .catch(() => {
          setStatusText("Server error. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <GeneralModal
      id="register_modal"
      formRef={formRef as React.RefObject<HTMLFormElement>}
      handleSubmit={handleSubmit}
    >
      <h1 className="text-5xl font-marker text-red-400">ECLIPSE</h1>
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-bold text-gray-200">Welcome!</h2>
        <p className="text-gray-300">Create your account to continue</p>
      </div>
      <div className="h-[1px] w-full bg-gray-800 rounded-full" />
      <div className="form-control flex flex-col gap-y-2">
        <Input
          hasLabel={true}
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          onInput={(e) => {
            emailRef.current = e.currentTarget.value;
          }}
        />
        <Input
          hasLabel={true}
          label="Username"
          type="text"
          name="username"
          placeholder="Username"
          onInput={(e) => {
            usernameRef.current = e.currentTarget.value;
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
            "Sign Up"
          )}
        </button>
      </div>
    </GeneralModal>
  );
};
