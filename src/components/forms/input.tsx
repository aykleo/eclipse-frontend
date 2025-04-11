import { RenderSvg } from "../pixel-art/render-svg";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasLabel?: boolean;
}

export const Input = ({ label, hasLabel, className, ...props }: InputProps) => {
  return (
    <div className="gap-y-1 flex w-full flex-col text-dark-gold filter duration-200 transition-opacity hover:brightness-125">
      {hasLabel && (
        <div className="w-full">
          <label className="label">
            <span className="label-text text-sm">{label}</span>
          </label>
        </div>
      )}
      <div className="h-8 w-full flex form-component">
        {/* Top left corner */}
        <RenderSvg
          src="corners/corner-1.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-[10px] absolute top-[-1px] left-[-1px]"
        />
        {/* Top right corner */}
        <RenderSvg
          src="corners/corner-1.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-[10px] absolute top-[-1px] right-[-1px]"
          transform="rotate(90deg)"
        />
        {/* Bottom left corner */}
        <RenderSvg
          src="corners/corner-1.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-[10px] absolute bottom-[-1px] left-[-1px]"
          transform="rotate(270deg)"
        />
        {/* Bottom right corner */}
        <RenderSvg
          src="corners/corner-1.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-[10px] absolute bottom-[-1px] right-[-1px]"
          transform="rotate(180deg)"
        />
        <input
          className={`clean w-full border h-full p-2 ${className || ""}`}
          {...props}
        />
      </div>
    </div>
  );
};
