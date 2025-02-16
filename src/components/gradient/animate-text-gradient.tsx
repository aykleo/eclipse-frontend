export const AnimateTextGradient = () => {
  return (
    <>
      <style>
        {`
    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 100% 50%;
      }
    }
    .animate-gradient {
      animation: gradient 5s linear infinite;
    }          
 `}
      </style>
    </>
  );
};
