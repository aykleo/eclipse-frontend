import React from "react";
import { MuscleGroupData } from "../../../../../utils/types/exercise-types";
import { RenderSvg } from "../../../../../components/pixel-art/render-svg";

interface MuscleGroupTreeProps {
  muscleGroupData: MuscleGroupData[];
  initialMuscleGroupIds: string[];
  primaryMuscleGroupId: string | null;
  handleMuscleGroupIds: (muscleId: string) => void;
}

const MuscleGroupTree: React.FC<MuscleGroupTreeProps> = ({
  muscleGroupData,
  initialMuscleGroupIds,
  primaryMuscleGroupId,
  handleMuscleGroupIds,
}) => {
  const categories = {
    Arms: ["biceps", "triceps", "forearms", "deltoid"],
    Torso: [
      "chest",
      "latissimus",
      "trapezius",
      "spinal_erectors",
      "core",
      "neck",
    ].sort(),
    Hips: ["hip_adductors", "hip_abductors", "gluteus_maximus"].sort(),
    Legs: ["quadriceps", "hamstrings", "gastrocnemius"].sort(),
  };

  const renderMuscleGroups = (category: string, muscles: string[]) => (
    <div key={category} className="flex flex-col gap-y-2 pl-1">
      <h3 className="text-lg font-bold text-neutral-300">{category}</h3>
      <div className="flex flex-wrap gap-x-2">
        {muscleGroupData
          .filter((muscleGroup) =>
            muscles.includes(muscleGroup.name.toLowerCase())
          )
          .map((muscleGroup) => {
            const isSelected = initialMuscleGroupIds.includes(muscleGroup.id);
            return (
              <button
                key={muscleGroup.id}
                disabled={!primaryMuscleGroupId}
                onClick={(e) => {
                  e.preventDefault();
                  handleMuscleGroupIds(muscleGroup.id);
                }}
              >
                <RenderSvg
                  src={`${
                    !isSelected
                      ? "body/body-32-input.svg"
                      : "body/body-32-input-red.svg"
                  }`}
                  size="auto"
                  repeat="repeat"
                  position="center"
                  className={`${
                    muscleGroup.id === primaryMuscleGroupId ? "hidden" : ""
                  } ${
                    !primaryMuscleGroupId ? "cursor-default" : "cursor-pointer"
                  } flex relative items-center justify-center py-1 px-2 hover:opacity-75 h-8 rounded-xs transition-all duration-300 ${
                    isSelected ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <span className="text-xs text-center">
                    {muscleGroup.name
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>

                  <RenderSvg
                    src={`${
                      !isSelected
                        ? "body/input-side-32.svg"
                        : "body/input-side-32-red.svg"
                    }`}
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="size-8 absolute -left-4 transition-all duration-300"
                  />
                  <RenderSvg
                    src={`${
                      !isSelected
                        ? "body/input-side-32.svg"
                        : "body/input-side-32-red.svg"
                    }`}
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="h-full w-4 absolute -right-2 transition-all duration-300"
                    transform="rotate(180deg)"
                  />
                </RenderSvg>
              </button>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="gap-y-1 flex flex-col h-full w-full">
      <label className="label w-full justify-between">
        <span className="label-text text-sm">Secondary movers</span>
      </label>
      {Object.entries(categories).map(([category, muscles]) =>
        renderMuscleGroups(category, muscles)
      )}
    </div>
  );
};

export default MuscleGroupTree;
