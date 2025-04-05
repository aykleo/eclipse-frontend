export const PaperBody = () => {
  return (
    <>
      <div
        className="h-full w-4 absolute left-0 bg-black"
        style={{
          backgroundImage: "body/body-side-paper-64.svg",
          backgroundRepeat: "repeat-y",
        }}
      />
      <div
        className="h-[11px] w-1/2 absolute left-1 bottom-0 bg-black"
        style={{
          backgroundImage: "body/body-bottom-paper-48.svg",
          backgroundRepeat: "repeat-x",
        }}
      />

      <div
        className="h-full w-4 absolute right-0 bg-black"
        style={{
          backgroundImage: "body/body-side-paper-64.svg",
          backgroundRepeat: "repeat-y",
          transform: "rotateY(180deg",
        }}
      />
      <div
        className="h-[11px] w-1/2 absolute right-1 bottom-0 bg-black"
        style={{
          backgroundImage: "body/body-bottom-paper-48.svg",
          backgroundRepeat: "repeat-x",
        }}
      />
    </>
  );
};
