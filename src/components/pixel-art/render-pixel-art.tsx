import React from "react";

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
  children?: React.ReactNode;
  transform?: string;
  onClick?: () => void;
}

export const RenderPixelArt = React.forwardRef<
  HTMLDivElement,
  RenderPixelArtProps
>(
  (
    {
      src,
      className,
      size,
      repeat,
      position,
      role,
      children,
      transform,
      onClick,
    },
    ref
  ) => {
    return (
      <div
        onClick={onClick}
        role={role}
        ref={ref}
        className={className}
        style={{
          backgroundImage: src,
          backgroundSize: size,
          backgroundPosition: position,
          backgroundRepeat: repeat,
          imageRendering: "pixelated",
          transform: transform,
        }}
      >
        {children}
      </div>
    );
  }
);
