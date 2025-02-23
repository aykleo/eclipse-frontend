interface StatusToastProps {
  statusText: string;
  children?: React.ReactNode;
}

export const StatusToast: React.FC<StatusToastProps> = ({
  statusText,
  children,
}) => {
  return (
    <div className="toast toast-bottom transition-opacity duration-500 bg-transparent w-max z-99">
      <div className="alert flex flex-col p-2 font-medium text-stone-900 h-max border-transparent bg-gray-950 w-72">
        {statusText.split(",").map((textPart, index) => (
          <span
            key={index}
            className="size-full break-words whitespace-normal block text-gray-100"
          >
            {textPart.trim()}
          </span>
        ))}
        {children}
      </div>
    </div>
  );
};
