import { SpinSlowStyle } from "../styles/spin-slow-style";
import { ToastProgress } from "../styles/toast-progress";

export const SpiningModal = ({
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
        {statusText && (
          <div className="toast toast-top mt-20 transition-opacity duration-500 bg-transparent w-max">
            <div className="alert flex flex-col p-2 font-medium text-stone-900 h-max border-error/50 border-2 bg-stone-950 w-72">
              {statusText.split(",").map((textPart, index) => (
                <span
                  key={index}
                  className="size-full break-words whitespace-normal block text-gray-100"
                >
                  {textPart.trim()}
                </span>
              ))}
              <div className="progress-bar bg-gray-300 h-1 mt-2 animate-progress-animation progress-bar rounded-full">
                <div className="progress bg-error h-full"></div>
              </div>
            </div>
          </div>
        )}
        <form
          method="dialog"
          className="modal-backdrop inset-0 absolute backdrop-blur-xs opacity-80"
        >
          <button>close</button>
        </form>
      </dialog>
      <ToastProgress />
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
