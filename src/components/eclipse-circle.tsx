export const EclipseCircle = () => {
  return (
    <div className="relative h-full flex">
      <div className="flex items-center justify-center w-64 h-64 rounded-full bg-black shadow-[1px_0px_10px_7px_rgba(255,255,255,1),-6px_-5px_5px_7px_rgba(255,255,255,0.1),0px_0px_50px_10px_rgba(255,0,0,0.8),0px_0px_15px_15px_rgba(255,0,0,1),inset_0px_0px_35px_2px_rgba(255,0,0,0.5),0px_0px_100px_75px_rgba(255,0,0,0.2)]"></div>

      <div
        className="absolute top-4 left-3 w-9 h-12 blur-xs rounded-full bg-white shadow-[-15px_0px_20px_1px_rgba(255,0,0,0.5),5px_0px_20px_2px_rgba(255,0,0,0.5)]"
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(42deg)",
        }}
      />
      <div
        className="absolute top-2.5 left-10 w-4 h-7.5 blur-xs rounded-full bg-white "
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(40deg)",
        }}
      />
      <div
        className="absolute top-11 left-2 w-4 h-7.5 blur-xs rounded-full bg-white "
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(35deg)",
        }}
      />
      <div className="absolute z-3 top-64.5 left-30 w-5 h-full blur-xs bg-white" />
      <div className="shadow-[20px_0px_15px_3px_rgba(255,0,0,1)] absolute top-69 left-29 w-2.5 h-full blur-xs" />
      <div
        className="shadow-[10px_0px_15px_3px_rgba(255,0,0,1)] absolute top-69 left-31 w-2.5 h-full blur-xs"
        style={{
          transform: "rotate(180deg)",
        }}
      />
      <div
        className="shadow-[-12px_0px_20px_1px_rgba(255,0,0,1)] absolute top-64 left-26 w-6.25 h-10 blur-xs bg-white"
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(-30deg)",
        }}
      />
      <div
        className="shadow-[-20px_0px_20px_1px_rgba(255,0,0,1)] absolute top-62 left-23 w-4 h-7.5 blur-xs bg-white"
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(-60deg)",
        }}
      />
      <div
        className="shadow-[10px_0px_20px_1px_rgba(255,0,0,1)] absolute top-64 left-33 w-6.25 h-10 blur-xs bg-white"
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(30deg)",
        }}
      />
      <div
        className="shadow-[20px_0px_20px_1px_rgba(255,0,0,1)] absolute top-62 left-37 w-4 h-7.5 blur-xs bg-white"
        style={{
          borderRadius: "100% / 100%",
          transform: "rotate(60deg)",
        }}
      />
    </div>
  );
};
