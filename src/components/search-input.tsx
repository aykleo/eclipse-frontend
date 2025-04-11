import { RenderSvg } from "./pixel-art/render-svg";

interface SearchInputProps {
  setSearchTerm: (searchTerm: string) => void;
  width: string;
  maskLeft?: boolean;
  maskRight?: boolean;
}

export const SearchInput = ({
  setSearchTerm,
  width,
  maskLeft = false,
  maskRight = false,
}: SearchInputProps) => {
  const getMaskImage = () => {
    if (maskLeft) {
      return "linear-gradient(to right, transparent, black 10%)";
    }
    if (maskRight) {
      return "linear-gradient(to right, black, black 50%, transparent 100%)";
    }
    return undefined;
  };

  const maskImage = getMaskImage();

  return (
    <div
      className={`h-8 ${width} px-4 text-dark-gold flex filter duration-200 transition-all hover:brightness-125 brightness-75 `}
    >
      <div
        className="form-component px-4 w-full"
        style={{
          ...(maskImage && {
            maskImage,
            WebkitMaskImage: maskImage,
          }),
        }}
      >
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
        <div className="flex flex-row items-center justify-center w-full h-full gap-x-2">
          <RenderSvg
            src="icons/icon-magnifier.svg"
            size="auto"
            repeat="no-repeat"
            position="center"
            className="size-[16px]"
          />
          <input
            type="search"
            required
            placeholder="Search"
            className="clean w-full h-full py-2 pr-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
