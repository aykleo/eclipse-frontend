import { RenderSvg } from "../pixel-art/render-svg";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasLabel?: boolean;
}

export const Input = ({ label, hasLabel, className, ...props }: InputProps) => {
  return (
    <div className="gap-y-1 flex w-full flex-col filter duration-200 transition-all hover:brightness-125">
      {hasLabel && (
        <div className="w-full">
          {" "}
          <label className="label">
            <span className="label-text text-sm">{label}</span>
          </label>
        </div>
      )}
      <div className="h-8 w-full flex relative">
        <RenderSvg
          src="body/input-side-32.svg"
          size="auto"
          repeat="no-repeat"
          position="start"
          className="size-8 absolute -left-1"
        />
        <RenderSvg
          src="body/body-32-input.svg"
          size="auto"
          repeat="repeat"
          position="center"
          className="h-full w-full pl-1"
        >
          <input
            className={`clean w-full h-full py-2 ${className || ""}`}
            {...props}
          />
        </RenderSvg>
        <RenderSvg
          src="body/input-side-32.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="h-full w-4 absolute -right-2"
          transform="rotate(180deg)"
        />
      </div>
    </div>
  );
};
