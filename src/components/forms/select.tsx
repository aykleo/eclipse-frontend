import { RenderSvg } from "../pixel-art/render-svg";
import { useState, useRef, useEffect } from "react";
import React, { ButtonHTMLAttributes } from "react";

interface SelectProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "onChange"
  > {
  label?: string;
  options: React.ReactNode | React.ReactNode[] | string[];
  hasLabel?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const Select = ({
  label,
  options,
  defaultValue,
  onChange,
  name,
  hasLabel,
  required,
  placeholder,
  disabled,
  className,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string, label: string) => {
    setSelectedValue(label);
    const syntheticEvent = {
      target: { value, name },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const renderOptions = () => {
    if (!Array.isArray(options)) return null;

    return options.map((option, index) => {
      if (React.isValidElement(option)) {
        const optionProps = option.props as {
          value: string;
          children: React.ReactNode;
        };
        return (
          <div
            key={optionProps.value || index}
            className="group px-4 py-2 h-10 flex flex-row items-center cursor-pointer hover:bg-neutral-900"
            onClick={() =>
              handleSelect(
                optionProps.value,
                optionProps.children?.toString() || ""
              )
            }
          >
            <RenderSvg
              src="url(src/assets/pixel-art/icons/pointer-8.svg)"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-8 group-hover:block hidden animate-pulse"
              transform="rotate(180deg)"
            />
            <p className="text-md group-hover:text-neutral-100 text-neutral-400">
              {optionProps.children}
            </p>
          </div>
        );
      }

      return (
        <div
          key={index}
          className="group px-4 py-2 h-10 flex flex-row items-center gap-x-1 cursor-pointer"
          onClick={() =>
            handleSelect(option?.toString() || "", option?.toString() || "")
          }
        >
          <RenderSvg
            src="url(src/assets/pixel-art/icons/pointer-8.svg)"
            size="auto"
            repeat="no-repeat"
            position="center"
            className="size-8 group-hover:block hidden animate-pulse"
            transform="rotate(180deg)"
          />
          <p className="text-md group-hover:text-neutral-100 text-neutral-400">
            {option}
          </p>
        </div>
      );
    });
  };

  return (
    <>
      <div
        className={`gap-y-1 flex flex-col text ${className || ""}`}
        ref={dropdownRef}
      >
        {hasLabel && (
          <div className="w-full">
            <label className="label">
              <span className="label-text text-sm">{label}</span>
            </label>
          </div>
        )}
        <div className="h-8 w-full flex relative">
          <RenderSvg
            src="url(src/assets/pixel-art/input-side-32.svg)"
            size="auto"
            repeat="no-repeat"
            position="start"
            className="size-8 absolute -left-1"
          />
          <RenderSvg
            src="url(src/assets/pixel-art/body-32-input.svg)"
            size="auto"
            repeat="repeat"
            position="center"
            className="h-full w-full"
          >
            <button
              type="button"
              className={`clean w-full h-full flex flex-row items-center pr-5 pl-1 gap-x-2 justify-between text-neutral-300 ${
                required && !selectedValue ? "text-error" : ""
              }`}
              onClick={() => setIsOpen(!isOpen)}
              disabled={disabled}
              {...props}
            >
              {selectedValue || placeholder}
              <RenderSvg
                src="url(src/assets/pixel-art/icons/dropdown-indicator-8.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className="size-2 cursor-pointer"
              />
            </button>

            {isOpen && (
              <div className="absolute h-49 top-full left-0 w-full mt-1 z-50">
                <div className="size-full relative">
                  <RenderSvg
                    src="url(src/assets/pixel-art/body/body-196.svg)"
                    size="auto"
                    repeat="repeat"
                    position="center"
                    className="h-full overflow-auto no-scrollbar mx-[7px] py-2"
                  >
                    {renderOptions()}
                  </RenderSvg>
                  <RenderSvg
                    src="url(src/assets/pixel-art/body/body-side-196.svg)"
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="h-full w-[8px] absolute top-1/2 -translate-y-1/2 left-0"
                  />
                  <RenderSvg
                    src="url(src/assets/pixel-art/body/body-side-196.svg)"
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="h-full w-[8px] absolute top-1/2 -translate-y-1/2 right-1"
                    transform="rotate(180deg)"
                  />
                </div>
              </div>
            )}
          </RenderSvg>
          <RenderSvg
            src="url(src/assets/pixel-art/input-side-32.svg)"
            size="auto"
            repeat="no-repeat"
            position="center"
            className="h-full w-4 absolute -right-2"
            transform="rotate(180deg)"
          />
        </div>
      </div>
    </>
  );
};
