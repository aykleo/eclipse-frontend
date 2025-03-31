import React from "react";

type size = "auto" | "cover" | "contain" | string;
type position = "center" | "top" | "bottom" | "left" | "right" | string;
type repeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y";

interface RenderSvgProps {
  src: string;
  className: string;
  size: size;
  repeat: repeat;
  position: position;
  role?: string;
  children?: React.ReactNode;
  transform?: string;
  key?: string | number;
  onClick?: () => void;
}

export const RenderSvg = React.forwardRef<HTMLDivElement, RenderSvgProps>(
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
      key,
    },
    ref
  ) => {
    return (
      <div
        {...(key && { key })}
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
