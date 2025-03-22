import React from "react";
import {
  Exercise,
  TagCategory,
} from "../../../../../utils/types/exercise-types";
import { getColorBackgroundForTagCategory } from "../../../../../utils/tag-colors";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { ChartColumnIcon } from "lucide-react";
import { RenderPixelArt } from "../../../../../components/pixel-art/render-pixel-art";

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
      <div className="relative h-16">
        {/* <div
          className="absolute h-full z-99 w-1.5 left-[2px]"
          style={{
            backgroundImage: "url(src/assets/body-side.svg)",
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        />
        <div
          className="absolute h-full z-99 w-1.5 right-[2px]"
          style={{
            backgroundImage: "url(src/assets/body-side.svg)",
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
            transform: "rotate(180deg)",
          }}
        /> */}

        {/* <div
          className="h-6 w-full absolute -bottom-4 z-99 "
          style={{
            backgroundImage: "url(src/assets/teste-bg-bot2.svg)",
            backgroundSize: "auto",
            backgroundPosition: "50% 50%",
            backgroundRepeat: "repeat",
            imageRendering: "pixelated",
            filter: "drop-shadow(2px 4px 6px rgba(20, 0, 0, 1))",
          }}
        /> */}
        <RenderPixelArt
          src="url(src/assets/body.svg)"
          size="64px"
          repeat="repeat"
          position="center"
          role="tablist"
          className={`${
            isCreatingExercise || exerciseForUpdate
              ? "hidden"
              : "tabs tabs-box w-full gap-y-2 py-2 flex flex-col h-full md:flex-row items-center justify-between rounded-none"
          } relative`}
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
          <label className="flex h-10 text-xs flex-row gap-0 bg-transparent w-full md:w-1/2 lg:w-1/3">
            <div
              className="w-4 h-full"
              style={{
                backgroundImage: "url(src/assets/lat-left.svg)",
                backgroundSize: "auto",
                backgroundPosition: " 100% 60%",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
              }}
            />
            <div
              className="w-full h-full flex flex-row items-center py-2"
              style={{
                backgroundImage: "url(src/assets/corpo.svg)",
                backgroundSize: "auto",
                backgroundPosition: "50% 60%",
                backgroundRepeat: "repeat",
                imageRendering: "pixelated",
              }}
            >
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
                className="focus:outline-0 focus:ring-0 focus:border-none w-full h-full py-2"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div
              className="w-4 h-full"
              style={{
                backgroundImage: "url(src/assets/lat-left.svg)",
                backgroundSize: "auto",
                backgroundPosition: " 100% 60%",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
                transform: "rotate(180deg)",
              }}
            />
          </label>
        </RenderPixelArt>
      </div>
    );
  }
);
