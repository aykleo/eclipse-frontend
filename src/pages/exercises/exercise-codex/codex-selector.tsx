import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import {
  categoryIcons,
  ExerciseCategory,
} from "../../../utils/codex-selector-categories";
import { SearchInput } from "../../../components/search-input";

interface CategorySelectorProps {
  handleTabClick: (category: ExerciseCategory) => void;
  setSearchParams: (
    params: (prev: URLSearchParams) => URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
  selectedCategory: ExerciseCategory;
}

export const CodexSelector: React.FC<CategorySelectorProps> = React.memo(
  ({ handleTabClick, setSearchParams, selectedCategory }) => {
    const [searchTerm, setSearchTerm] = useState(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get("exerciseName") || "";
    });
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    useEffect(() => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (debouncedSearchTerm) {
            newParams.set("exerciseName", debouncedSearchTerm);
          } else {
            newParams.delete("exerciseName");
          }
          return newParams;
        },
        { replace: true }
      );
    }, [debouncedSearchTerm, setSearchParams]);

    return (
      <div className="relative h-12">
        <RenderSvg
          src="body/body-side-64.svg"
          size="15px"
          repeat="no-repeat"
          position="center"
          role="tablist"
          className="absolute h-full z-3 w-12 -left-5"
        />
        <RenderSvg
          src="body/body-side-64.svg"
          size="15px"
          repeat="no-repeat"
          position="center"
          role="tablist"
          className="absolute h-full z-3 w-12 -right-5"
          transform="rotate(180deg)"
        />

        <RenderSvg
          src="body/body-64.svg"
          size="48px"
          repeat="repeat"
          position="center"
          role="tablist"
          className="relative flex items-center tabs tabs-box w-full flex-row h-full rounded-none"
        >
          <div className="flex items-center h-full flex-row gap-x-2 lg:gap-x-4 w-1/2 lg:w-2/3 px-1">
            <div className="gap-x-2 pl-2 flex w-full justify-evenly">
              {categoryIcons.map((category, index) => (
                <a
                  key={index}
                  role="tab"
                  onClick={() =>
                    handleTabClick(category.category as ExerciseCategory)
                  }
                  className={`${
                    selectedCategory === category.category
                      ? "brightness-100"
                      : "brightness-50"
                  } filter duration-200 transition-all hover:brightness-110`}
                >
                  <div className="lg:hidden cursor-pointer">
                    {category.icon}
                  </div>
                  <div className="hidden lg:block cursor-pointer">
                    {category.openIcon}
                  </div>
                </a>
              ))}
            </div>
          </div>
          <SearchInput setSearchTerm={setSearchTerm} />
        </RenderSvg>
      </div>
    );
  }
);
