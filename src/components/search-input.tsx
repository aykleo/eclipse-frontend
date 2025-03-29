import { RenderSvg } from "./pixel-art/render-svg";

interface SearchInputProps {
  setSearchTerm: (searchTerm: string) => void;
}

export const SearchInput = ({ setSearchTerm }: SearchInputProps) => {
  return (
    <div className="h-8 w-1/2 lg:w-1/3 flex opacity-80">
      <RenderSvg
        src="url(src/assets/pixel-art/search-input-side-32.svg)"
        size="auto"
        repeat="no-repeat"
        position="start"
        className="size-8"
      />

      <RenderSvg
        src="url(src/assets/pixel-art/body-32-input.svg)"
        size="auto"
        repeat="repeat"
        position="center"
        className="h-full w-7/10 sm:w-8/10 pl-1"
      >
        <input
          type="search"
          required
          placeholder="Search"
          className="clean w-full h-full py-2"
          onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};
