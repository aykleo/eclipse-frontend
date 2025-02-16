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
          <div className="toast  transition-opacity duration-500 mr-10 bg-transparent">
            <div className="alert bg-neutral-800/25 font-medium border-gray-600/50">
              <span>{statusText}</span>
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
      <style>
        {`
      @keyframes spinSlow {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spinSlow 5s linear infinite;
      }
      
   `}
      </style>
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
