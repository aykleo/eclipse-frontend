import React from "react";
import { SpinSlowStyle } from "../styles/spin-slow-style";
import { StatusToast } from "../status-toast";

export const SpiningModal = React.memo(
  ({
    children,
    id,
    formRef,
    handleSubmit,
    statusText,
  }: {
    children: React.ReactNode;
    id: string;
    formRef: React.RefObject<HTMLFormElement>;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    statusText: string;
  }) => {
    return (
      <>
        <dialog id={id} className="modal">
          <div className="relative p-[1px] rounded-lg overflow-hidden">
            <div
              id="spinning-background"
              className=" absolute top-1/2 left-1/2 w-[300%] h-[300%] animate-spin-slow"
              style={{
                background:
                  "conic-gradient(rgba(255, 0, 0, 0.8) 0deg, rgba(255, 102, 102, 0.8) 60deg, transparent 150deg)",
              }}
            />
            <div className="modal-box bg-neutral-950 w-full rounded-lg relative opacity-animation">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="card-body flex flex-col gap-y-3 justify-center w-full"
              >
                {children}
              </form>
            </div>
          </div>
          {statusText && <StatusToast statusText={statusText} />}
          <form
            method="dialog"
            className="modal-backdrop inset-0 absolute backdrop-blur-xs opacity-80"
          >
            <button>close</button>
          </form>
        </dialog>
        <SpinSlowStyle />
        <style>
          {`
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      .opacity-animation {
        animation: fadeIn 0.01s ease-in forwards;
      }
   `}
        </style>
      </>
    );
  }
);
