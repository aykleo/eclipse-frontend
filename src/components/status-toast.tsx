import { ToastProgress } from "./styles/toast-progress";

interface StatusToastProps {
  statusText: string;
  children?: React.ReactNode;
}

export const StatusToast: React.FC<StatusToastProps> = ({ statusText }) => {
  return (
    <div className="toast toast-top mt-16 transition-opacity duration-500 bg-transparent w-max z-999">
      <div className="alert flex flex-col p-2 rounded-xs  font-medium h-max border-transparent bg-neutral-100 w-72">
        {statusText.split(",").map((textPart, index) => (
          <span
            key={index}
            className="size-full break-words whitespace-normal block text-neutral-700"
          >
            {textPart.trim()}
          </span>
        ))}
        <div className="progress-bar bg-gray-300 h-1 mt-2 animate-progress-animation progress-bar rounded-full">
          <div className="progress bg-error h-full"></div>
        </div>
        <ToastProgress />
      </div>
    </div>
  );
};
