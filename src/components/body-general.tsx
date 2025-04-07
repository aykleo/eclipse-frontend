import { ReactNode } from "react";
import { RenderSvg } from "./pixel-art/render-svg";

interface BodyGeneralProps {
  className: string;
  children?: ReactNode;
}

export const BodyGeneral = ({ children, className }: BodyGeneralProps) => {
  return (
    <div className={`relative rounded-md ${className}`}>
      {/* Bottom border */}
      <RenderSvg
        src="body/body-bot-4.svg"
        size="auto"
        repeat="repeat-x"
        position="center"
        className="absolute left-[6px] bottom-0 h-1 w-[calc(100%-12px)]"
      />
      {/* Top border */}
      <RenderSvg
        src="body/body-bot-4.svg"
        size="auto"
        repeat="repeat-x"
        position="center"
        className="absolute left-[5px] top-0 h-1 w-[calc(100%-10px)]"
        transform="rotate(180deg)"
      />
      {/* Right border */}
      <RenderSvg
        src="body/body-side-4.svg"
        size="auto"
        repeat="repeat"
        position="center"
        className="absolute right-0 top-[6px] h-[calc(100%-12px)] w-[4px]"
        transform="rotate(180deg)"
      />
      {/* Left border */}
      <RenderSvg
        src="body/body-side-4.svg"
        size="auto"
        repeat="repeat"
        position="center"
        className="absolute left-0 top-[6px] h-[calc(100%-12px)] w-[4px]"
      />
      {/* Top right corner */}
      <RenderSvg
        src="body/body-corner-4.svg"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="absolute right-0 top-0 h-[6px] w-[6px]"
        transform="rotate(90deg)"
      />
      {/* Bottom right corner */}
      <RenderSvg
        src="body/body-corner-4.svg"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="absolute right-0 bottom-0 h-[6px] w-[6px]"
        transform="rotate(180deg)"
      />
      {/* Top left corner */}
      <RenderSvg
        src="body/body-corner-4.svg"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="absolute left-0 top-0 h-[6px] w-[6px]"
      />
      {/* Bottom left corner */}
      <RenderSvg
        src="body/body-corner-4.svg"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="absolute left-0 bottom-0 h-[6px] w-[6px]"
        transform="rotate(270deg)"
      />

      {children}
    </div>
  );
};
