import { RenderSvg } from "../pixel-art/render-svg";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  hasLabel?: boolean;
  defaultValue?: string;
}

export const TextArea = ({
  label,
  hasLabel,
  className,
  defaultValue,
  ...props
}: TextAreaProps) => {
  return (
    <div className="gap-y-1 flex text-dark-gold flex-col">
      {hasLabel && (
        <div className="w-full">
          <label className="label">
            <span className="label-text text-sm">{label}</span>
          </label>
        </div>
      )}
      <div className="h-32 w-full flex form-component">
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
        <textarea
          className={`clean w-full h-28 px-2 resize-none overflow-y-auto no-scrollbar ${
            className || ""
          }`}
          {...props}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
};
