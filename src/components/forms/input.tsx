import { RenderSvg } from "../pixel-art/render-svg";

interface InputProps {
  label: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  defaultValue?: string;
  name?: string;
  hasLabel?: boolean;
  required?: boolean;
}

export const Input = ({
  label,
  type,
  defaultValue,
  onChange,
  placeholder,
  name,
  hasLabel,
  required,
}: InputProps) => {
  return (
    <div className="gap-y-1 flex flex-col">
      {hasLabel && (
        <div className="w-full pl-5">
          {" "}
          <label className="label">
            <span className="label-text text-sm">{label}</span>
          </label>
        </div>
      )}
      <div className="h-8 w-full flex">
        <RenderSvg
          src="url(src/assets/pixel-art/input-side-32.svg)"
          size="auto"
          repeat="no-repeat"
          position="start"
          className="size-8"
          transform="rotate(180deg)"
        />
        <RenderSvg
          src="url(src/assets/pixel-art/body-32-input.svg)"
          size="auto"
          repeat="repeat"
          position="center"
          className="h-full w-7/10 sm:w-8/10 pl-1"
        >
          <input
            type={type}
            placeholder={placeholder}
            className="clean w-full h-full py-2"
            name={name}
            defaultValue={defaultValue}
            {...(required && { required: true })}
            onChange={onChange}
          />
        </RenderSvg>
        <RenderSvg
          src="url(src/assets/pixel-art/input-side-32.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="h-full w-4"
        />
      </div>
    </div>
  );
};
