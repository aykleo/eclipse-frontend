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
            className="group px-4 py-2 h-10 flex flex-row items-center cursor-pointer hover:bg-gradient-to-r from-transparent via-dark-neutral/25 to-dark-neutral/50"
            onClick={() =>
              handleSelect(
                optionProps.value,
                optionProps.children?.toString() || ""
              )
            }
          >
            <RenderSvg
              src="arrows/arrow-r.svg"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-3 group-hover:block hidden animate-pulse pr-6"
            />
            <p className="text-md text-dark-bronze group-hover:text-dark-gold">
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
            src="icons/pointer-8.svg"
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
        className={`gap-y-1 flex flex-col text ${
          className || ""
        } text-dark-gold`}
        ref={dropdownRef}
      >
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
          <button
            type="button"
            className={`clean w-full h-full flex flex-row items-center pr-2 pl-2 gap-x-2 justify-between ${
              required && !selectedValue ? "text-error" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            {...props}
          >
            {selectedValue || placeholder}
            <RenderSvg
              src={isOpen ? "arrows/arrow-t.svg" : "arrows/arrow-b.svg"}
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-3 cursor-pointer"
            />
          </button>

          {isOpen && (
            <div className="absolute h-49 top-full left-0 w-full mt-1 z-2">
              <div className="size-full form-component bg-neutral-950 ">
                <div className="overflow-auto no-scrollbar py-2 size-full">
                  {renderOptions()}
                </div>
                {/* Top left corner */}
                <RenderSvg
                  src="corners/corner-1.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="size-[10px] absolute top-[-1px] left-[-1px] z-3"
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
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
