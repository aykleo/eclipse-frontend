const AnimatedGradientBorderBtn = ({
  text,
  children,
  className,
  textClassName,
  borderSize,
  onClick,
}: {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  borderSize?: string;
  onClick?: () => void;
}) => {
  return (
    <button onClick={onClick} className="group cursor-pointer rounded-full">
      <div className={`relative p-[1px] ${borderSize}`}>
        <div
          className={`absolute inset-0 rounded-full transition-colors duration-1000 bg-gradient-to-r from-gray-600 to-gray-800 group-hover:from-gray-200 group-hover:to-gray-500 ${className}`}
          style={{
            backgroundSize: "200% 200%",
            animation: "gradientRotate 3s linear infinite",
          }}
        ></div>

        <div
          className={`relative gap-x-2 flex items-center justify-center flex-row rounded-full text-sm text-gray-400 group-hover:text-white transition-all duration-300 font-rounded bg-black ${textClassName}`}
        >
          {text}
          {children}
        </div>
      </div>

      <style>
        {`
            @keyframes gradientRotate {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
      </style>
    </button>
  );
};

export default AnimatedGradientBorderBtn;
