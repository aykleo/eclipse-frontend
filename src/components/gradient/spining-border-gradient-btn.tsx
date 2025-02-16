const SpinningBorderButton = () => {
  return (
    <>
      <button className="relative p-[2px]  overflow-hidden ">
        <div
          className="absolute top-1/2 left-1/2 w-[300%] h-[300%] animate-spin-slow"
          style={{
            background:
              "conic-gradient(rgba(244, 114, 182, 0.8) 0deg, rgba(192, 132, 252, 0.8) 60deg, transparent 150deg)",
          }}
        ></div>

        <div className="relative flex items-center justify-center bg-black px-6 py-2 text-sm text-white font-medium ">
          Button
        </div>
      </button>

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
    </>
  );
};

export default SpinningBorderButton;
