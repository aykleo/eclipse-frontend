type size = "auto" | "cover" | "contain" | string;
type position = "center" | "top" | "bottom" | "left" | "right" | string;
type repeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y";

interface RenderPixelArtProps {
  src: string;
  className: string;
  size: size;
  repeat: repeat;
  position: position;
  role?: string;
  ref?: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

export const RenderPixelArt = ({
  src,
  className,
  size,
  repeat,
  position,
  role,
  ref,
  children,
}: RenderPixelArtProps) => {
  return (
    <div
      role={role}
      ref={ref}
      className={className}
      style={{
        backgroundImage: src,
        backgroundSize: size,
        backgroundPosition: position,
        backgroundRepeat: repeat,
        imageRendering: "pixelated",
      }}
    >
      {children}
    </div>
  );
};
