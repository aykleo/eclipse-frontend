interface GradientBorderBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const GradientBorderBtn = ({ children, onClick }: GradientBorderBtnProps) => {
  return (
    <>
      <button
        onClick={onClick}
        className="relative bg-gradient-to-r transition-colors duration-500 from-red-500 to-red-300 hover:from-red-300 hover:to-red-500 p-[1px] rounded-full"
      >
        <div className="flex items-center justify-center bg-black px-2 py-1 text-xs lg:text-sm text-gray-200 cursor-pointer hover:text-red-200 rounded-full">
          {children}
        </div>
      </button>
    </>
  );
};

export default GradientBorderBtn;
