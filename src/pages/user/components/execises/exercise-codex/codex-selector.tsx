import React from "react";
import {
  Exercise,
  TagCategory,
} from "../../../../../utils/types/exercise-types";
import { getColorBackgroundForTagCategory } from "../../../../../utils/tag-colors";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { ChartColumnIcon } from "lucide-react";

export type ExerciseCategory =
  | ""
  | "ENDURANCE"
  | "MOVEMENT"
  | "PLYOMETRICS"
  | "STRENGTH";

interface CategorySelectorProps {
  selectedCategory: ExerciseCategory;
  handleTabClick: (category: ExerciseCategory) => void;
  setSearchParams: (
    params: (prev: URLSearchParams) => URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
  isStatistics: boolean;
  setIsStatistics: (isStatistics: boolean) => void;
  isCreatingExercise: boolean;
  exerciseForUpdate: Exercise | null;
}

export const CodexSelector: React.FC<CategorySelectorProps> = React.memo(
  ({
    selectedCategory,
    handleTabClick,
    setSearchParams,
    isStatistics,
    setIsStatistics,
    isCreatingExercise,
    exerciseForUpdate,
  }) => {
    const [searchTerm, setSearchTerm] = useState(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get("exerciseName") || "";
    });
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    useEffect(() => {
      setSearchParams(
        (prev) => {
          if (debouncedSearchTerm) {
            prev.set("exerciseName", debouncedSearchTerm);
          } else {
            prev.delete("exerciseName");
          }
          return prev;
        },
        { replace: true }
      );
    }, [debouncedSearchTerm, setSearchParams]);

    const categoryIcons = [
      {
        category: "ENDURANCE",
        icon: (
          <img
            src={`src/assets/icons/category/ENDURANCE.png`}
            className="size-4 md:size-6"
            alt="ENDURANCE"
          />
        ),
      },
      {
        category: "MOVEMENT",
        icon: (
          <img
            src={`src/assets/icons/category/MOVEMENT.png`}
            className="size-4 md:size-6"
            alt="MOVEMENT"
          />
        ),
      },
      {
        category: "PLYOMETRICS",
        icon: (
          <img
            src={`src/assets/icons/category/PLYOMETRICS.png`}
            className="size-4 md:size-6"
            alt="PLYOMETRICS"
          />
        ),
      },
      {
        category: "STRENGTH",
        icon: (
          <img
            src={`src/assets/icons/category/STRENGTH.png`}
            className="size-4 md:size-6"
            alt="STRENGTH"
          />
        ),
      },
    ];

    return (
      <div
        role="tablist"
        className={`${
          isCreatingExercise || exerciseForUpdate
            ? "hidden"
            : "tabs relative tabs-box w-full gap-y-2 py-2 flex flex-col md:flex-row items-center justify-between bg-transparent rounded-none"
        } `}
      >
        <div className="flex w-full flex-row gap-x-2 lg:gap-x-4 md:w-1/2 lg:w-2/3 px-1">
          <a
            role="tab"
            className={`flex items-center px-4 py-1 md:px-2 lg:w-40 bg-neutral-950 lg:bg-transparent justify-center lg:text-xl rounded-full ${
              selectedCategory === "" && !isStatistics
                ? "text-white opacity-100 cursor-default"
                : "text-gray-400 hover:text-error cursor-pointer"
            }`}
            onClick={() => handleTabClick("")}
          >
            <span className="text-xs lg:text-sm">
              <span className="hidden lg:block">All exercises</span>
              <span className="lg:hidden px-1">All</span>
            </span>
          </a>
          <div className="gap-x-2 lg:gap-x-4 flex w-full justify-evenly">
            {categoryIcons.map((category, index) => (
              <a
                key={index}
                role="tab"
                onClick={() =>
                  handleTabClick(category.category as ExerciseCategory)
                }
                className={`${getColorBackgroundForTagCategory(
                  category.category as TagCategory
                )} lg:bg-transparent flex items-center justify-center px-2 w-10 lg:w-max rounded-full ${
                  selectedCategory === category.category && !isStatistics
                    ? "opacity-100 cursor-default"
                    : "opacity-50 hover:text-error cursor-pointer"
                }`}
              >
                <div className="flex flex-row items-center gap-x-1">
                  <div className="lg:hidden">{category.icon}</div>
                  <div className="text-xs lg:text-sm hidden lg:block">
                    {category.category.charAt(0).toUpperCase() +
                      category.category.slice(1).toLowerCase()}
                  </div>
                </div>
              </a>
            ))}
          </div>
          <a
            role="tab"
            className={`flex items-center px-4 md:px-2 lg:w-36 bg-neutral-950 lg:bg-transparent justify-center lg:text-xl rounded-full ${
              isStatistics
                ? "text-white cursor-default"
                : "text-gray-400 hover:text-error cursor-pointer"
            }`}
            onClick={() => setIsStatistics(!isStatistics)}
          >
            <span className="text-xs lg:text-sm">
              <span className="hidden lg:block">Statistics</span>
              <ChartColumnIcon className="size-4 md:size-6 lg:hidden" />
            </span>
          </a>
        </div>
        <label className="input bg-transparent input-sm w-full md:w-1/2 lg:w-1/3">
          <svg
            className="h-[1rem] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>
    );
  }
);
