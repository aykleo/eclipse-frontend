import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  categoryIcons,
  ExerciseCategory,
} from "../../../utils/codex-selector-categories";
import { SearchInput } from "../../../components/search-input";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { SmallLoadingGif } from "../../../components/small-loading-gif";
import { Selector } from "../../../components/ui/selector";

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
    const { isCreatingExercise, exerciseForUpdate } = useExerciseState();

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
        <Selector
          role="tablist"
          className="backdrop-blur-3xl z-99 bg-gradient-to-r from-transparent via-[#252223] to-transparent relative flex items-center w-full flex-row h-full"
        >
          {!isCreatingExercise && !exerciseForUpdate ? (
            <>
              <div className="flex items-center h-full flex-row gap-x-2 lg:gap-x-4 w-1/2 lg:w-2/3 px-1">
                <div className="gap-x-2 flex w-full justify-evenly">
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
              <SearchInput
                width="w-1/2 lg:w-1/3"
                setSearchTerm={setSearchTerm}
              />
            </>
          ) : (
            //TODO: Add a gif here
            <div className="w-full items-center flex justify-center h-full">
              <SmallLoadingGif />
            </div>
          )}
        </Selector>
      </div>
    );
  }
);
