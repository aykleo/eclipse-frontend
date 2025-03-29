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
    <div className="gap-y-1 flex flex-col">
      {hasLabel && (
        <div className="w-full pl-6">
          <label className="label">
            <span className="label-text text-sm">{label}</span>
          </label>
        </div>
      )}
      <div className="h-32 w-full flex relative pl-5.5">
        <RenderSvg
          src="url(src/assets/pixel-art/body/body-void-side-128.svg)"
          size="auto"
          repeat="no-repeat"
          position="start"
          className="w-4 h-full absolute left-3.5"
        />
        <RenderSvg
          src="url(src/assets/pixel-art/body/body-void-128-.svg)"
          size="auto"
          repeat="repeat"
          position="center"
          className="h-full w-full pl-1 py-2 mr-2 overflow-hidden"
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
          src="url(src/assets/pixel-art/body/body-void-side-128.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="h-full w-4 absolute -right-1"
          transform="rotate(180deg)"
        />
      </div>
    </div>
  );
};
