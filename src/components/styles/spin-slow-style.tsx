export const SpinSlowStyle = () => {
  return (
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
  );
};
