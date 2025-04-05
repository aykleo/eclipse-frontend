import { RenderSvg } from "./pixel-art/render-svg";

interface SearchInputProps {
  setSearchTerm: (searchTerm: string) => void;
}

export const SearchInput = ({ setSearchTerm }: SearchInputProps) => {
  return (
    <div className="h-8 w-1/2 lg:w-1/3 px-4 flex filter duration-200 transition-all hover:brightness-125 brightness-75 relative">
      <RenderSvg
        src="body/input-side-32.svg"
        size="auto"
        repeat="no-repeat"
        position="start"
        className="h-full w-4 absolute left-3"
      />

      <RenderSvg
        src="body/body-32-input.svg"
        size="auto"
        repeat="repeat"
        position="center"
        className="h-full w-full pl-1 flex items-center justify-center flex-row gap-x-2"
      >
        <RenderSvg
          src="icons/search-icon-16.svg"
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
      </RenderSvg>
      <RenderSvg
        src="body/input-side-32.svg"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-full w-4 absolute right-2"
        transform="rotate(180deg)"
      />
    </div>
  );
};
