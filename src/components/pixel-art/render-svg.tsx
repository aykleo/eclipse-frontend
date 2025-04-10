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
  onClick?: () => void;
  maskLeft?: boolean;
  maskRight?: boolean;
  maskBothSides?: boolean;
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
      maskLeft = false,
      maskRight = false,
      maskBothSides = false,
    },
    ref
  ) => {
    const getMaskImage = () => {
      if (maskBothSides) {
        return "linear-gradient(to right, transparent, black 20%, black 80%, transparent 100%)";
      }
      if (maskLeft) {
        return "linear-gradient(to right, transparent, black 20%)";
      }
      if (maskRight) {
        return "linear-gradient(to right, black, black 80%, transparent 100%)";
      }
      return undefined;
    };

    const maskImage = getMaskImage();

    return (
      <div
        onClick={onClick}
        role={role}
        ref={ref}
        className={className}
        style={{
          backgroundImage: `url(/src/assets/pixel-art/${src})`,
          backgroundSize: size,
          backgroundPosition: position,
          backgroundRepeat: repeat,
          imageRendering: "pixelated",
          transform: transform,
          ...(maskImage && {
            maskImage,
            WebkitMaskImage: maskImage,
          }),
        }}
      >
        {children}
      </div>
    );
  }
);
