import React from "react";

import { CircleFadingPlusIcon } from "lucide-react";
import { Exercise } from "../../../../../utils/types/exercise-types";

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
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  handleTabClick,
  exerciseForUpdate,
  setIsCreatingExercise,
  isCreatingExercise,
  setExerciseForUpdate,
}) => {
  return (
    <div
      role="tablist"
      className="tabs relative tabs-box w-full bg-stone-950 rounded-none border-b border-gray-700"
    >
      <a
        role="tab"
        className={`flex items-end px-2 justify-end text-sm hover:text-gray-100 cursor-pointer ${
          selectedCategory === "" ? "text-white underline" : "text-gray-400"
        }`}
        onClick={() => handleTabClick("")}
      >
        All
      </a>
      <a
        role="tab"
        className={`flex items-end px-2 justify-end text-sm hover:text-blue-400 text-blue-500 cursor-pointer ${
          selectedCategory === "ENDURANCE" ? "underline" : ""
        }`}
        onClick={() => handleTabClick("ENDURANCE")}
      >
        Endurance
      </a>
      <a
        role="tab"
        className={`flex items-end px-2 justify-end text-sm hover:text-green-400 text-green-500 cursor-pointer ${
          selectedCategory === "MOVEMENT" ? "underline" : ""
        }`}
        onClick={() => handleTabClick("MOVEMENT")}
      >
        Movement
      </a>
      <a
        role="tab"
        className={`flex items-end px-2 justify-end text-sm hover:text-yellow-400 text-yellow-500 cursor-pointer ${
          selectedCategory === "PLYOMETRICS" ? "underline" : ""
        }`}
        onClick={() => handleTabClick("PLYOMETRICS")}
      >
        Plyometrics
      </a>
      <a
        role="tab"
        className={`flex items-end px-2 justify-end text-sm hover:text-red-400 text-red-500 cursor-pointer ${
          selectedCategory === "STRENGTH" ? "underline" : ""
        }`}
        onClick={() => handleTabClick("STRENGTH")}
      >
        Strength
      </a>
      <a
        role="tab"
        className={`flex items-center -top-1 px-2 justify-center text-sm hover:text-gray-100 absolute right-0 text-gray-400 cursor-pointer 
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
