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
    <div className="gap-y-1 flex flex-col filter duration-200 transition-all hover:brightness-125 ">
      {hasLabel && (
        <div className="w-full">
          <label className="label">
            <span className="label-text text-sm">{label}</span>
          </label>
        </div>
      )}
      <div className="h-32 w-full flex relative">
        <RenderSvg
          src="body/body-t-side-128.svg"
          size="auto"
          repeat="no-repeat"
          position="start"
          className="w-[5px] h-full absolute -left-1"
        />
        <RenderSvg
          src="body/body-t-128.svg"
          size="auto"
          repeat="repeat"
          position="center"
          className="h-full w-full pl-1 py-2 mr-0.5 overflow-hidden"
        >
          <textarea
            className={`clean w-full h-28 px-2 resize-none overflow-y-auto no-scrollbar ${
              className || ""
            }`}
            {...props}
            defaultValue={defaultValue}
          />
        </RenderSvg>
        <RenderSvg
          src="body/body-t-side-128.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="h-full w-[5px]  absolute -right-0"
          transform="rotate(180deg)"
        />
      </div>
    </div>
  );
};
