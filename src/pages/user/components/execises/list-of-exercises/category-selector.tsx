import { CircleFadingPlusIcon } from "lucide-react";
import {
  Exercise,
  TagCategory,
} from "../../../../../utils/types/exercise-types";
import { getColorBackgroundForTagCategory } from "../../../../../utils/tag-colors";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export type ExerciseCategory =
  | ""
  | "ENDURANCE"
  | "MOVEMENT"
  | "PLYOMETRICS"
  | "STRENGTH";

interface CategorySelectorProps {
  selectedCategory: ExerciseCategory;
  handleTabClick: (category: ExerciseCategory) => void;
  exerciseForUpdate: Exercise | null;
  setIsCreatingExercise: (isCreating: boolean) => void;
  isCreatingExercise: boolean;
  setExerciseForUpdate: (exercise: Exercise | null) => void;
  setSearchParams: (params: URLSearchParams) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  handleTabClick,
  exerciseForUpdate,
  setIsCreatingExercise,
  isCreatingExercise,
  setExerciseForUpdate,
  setSearchParams,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      newParams.set("exerciseName", debouncedSearchTerm);
    } else {
      newParams.delete("exerciseName");
    }
    setSearchParams(newParams);
  }, [debouncedSearchTerm, setSearchParams]);

  useEffect(() => {
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete("exerciseName");
      setSearchParams(newParams);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setSearchParams]);

  const categoryIcons = [
    {
      category: "ENDURANCE",
      icon: (
        <img
          src={`src/assets/icons/category/ENDURANCE.png`}
          className="size-5 md:size-6"
          alt="ENDURANCE"
        />
      ),
    },
    {
      category: "MOVEMENT",
      icon: (
        <img
          src={`src/assets/icons/category/MOVEMENT.png`}
          className="size-5 md:size-6"
          alt="MOVEMENT"
        />
      ),
    },
    {
      category: "PLYOMETRICS",
      icon: (
        <img
          src={`src/assets/icons/category/PLYOMETRICS.png`}
          className="size-5 md:size-6"
          alt="PLYOMETRICS"
        />
      ),
    },
    {
      category: "STRENGTH",
      icon: (
        <img
          src={`src/assets/icons/category/STRENGTH.png`}
          className="size-5 md:size-6"
          alt="STRENGTH"
        />
      ),
    },
  ];

  return (
    <div
      role="tablist"
      className="tabs relative tabs-box w-full py-2 flex items-center justify-between bg-transparent rounded-none"
    >
      <div className="flex flex-row gap-x-2 md:gap-x-4">
        <a
          role="tab"
          className={`flex items-center px-2 justify-center md:text-xl bg-stone-950 rounded-full hover:text-gray-100 cursor-pointer ${
            selectedCategory === ""
              ? "text-white opacity-100"
              : "text-gray-400 opacity-30"
          }`}
          onClick={() => handleTabClick("")}
        >
          All
        </a>
        <div className="gap-x-2 md:gap-x-4 flex">
          {categoryIcons.map((category, index) => (
            <a
              key={index}
              role="tab"
              onClick={() =>
                handleTabClick(category.category as ExerciseCategory)
              }
              className={`${getColorBackgroundForTagCategory(
                category.category as TagCategory
              )} flex items-center justify-center w-10 md:w-12 rounded-full p-1 cursor-pointer ${
                selectedCategory === category.category
                  ? "opacity-100"
                  : "opacity-30"
              }`}
            >
              {category.icon}
            </a>
          ))}
        </div>
      </div>
      <label className="input bg-transparent input-sm w-1/4 md:w-1/3 xl:w-1/2">
        <svg
          className="h-[1em] opacity-50"
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

      <a
        role="tab"
        className={`flex items-center justify-center text-sm hover:text-gray-100 text-gray-400 cursor-pointer 
     `}
        onClick={() => {
          if (exerciseForUpdate) {
            setIsCreatingExercise(true);
          } else {
            setIsCreatingExercise(!isCreatingExercise);
          }
          setExerciseForUpdate(null);
        }}
      >
        <CircleFadingPlusIcon className="size-7" />
      </a>
    </div>
  );
};
