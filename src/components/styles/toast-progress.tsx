export const ToastProgress = () => {
  return (
    <style>{`
        .progress-bar {
          position: relative;
          width: 100%;
        }
        .progress {
          width: 100%;
          animation: progress-animation 3s linear forwards;
        }
        @keyframes progress-animation {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
  );
};
