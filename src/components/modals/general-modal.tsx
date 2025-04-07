import React from "react";
import { BodyGeneral } from "../body-general";
import { SpinSlowStyle } from "../styles/spin-slow-style";

export const GeneralModal = ({
  children,
  id,
  formRef,
  handleSubmit,
}: {
  children: React.ReactNode;
  id: string;
  formRef: React.RefObject<HTMLFormElement>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <>
      <dialog id={id} className="modal">
        <div className="relative p-[2px] rounded-lg overflow-hidden">
          <div
            id="spinning-background"
            className=" absolute top-1/2 left-1/2 w-[300%] h-[300%] animate-spin-slow"
            style={{
              background:
                "conic-gradient(rgba(90, 10, 10, 0.8) 0deg, rgba(165, 49, 49, 0.8) 60deg, transparent 150deg)",
            }}
          />

          <BodyGeneral className="p-8 bg-neutral-950 max-w-96 rounded-lg relative opacity-animation">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-3 justify-center w-full"
            >
              {children}
            </form>
          </BodyGeneral>
        </div>

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
};
