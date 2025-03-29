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
    <div key={category} className="flex flex-col gap-y-2 pl-8">
      <h3 className="text-lg font-bold text-neutral-300">{category}</h3>
      <div className="flex flex-wrap gap-3">
        {muscleGroupData
          .filter((muscleGroup) =>
            muscles.includes(muscleGroup.name.toLowerCase())
          )
          .map((muscleGroup, index) => {
            const isSelected = initialMuscleGroupIds.includes(muscleGroup.id);
            return (
              <button
                disabled={!primaryMuscleGroupId}
                onClick={(e) => {
                  e.preventDefault();
                  handleMuscleGroupIds(muscleGroup.id);
                }}
              >
                <RenderSvg
                  src="url(src/assets/pixel-art/body/body-void-32.svg)"
                  size="auto"
                  repeat="repeat"
                  position="center"
                  key={index}
                  className={`${
                    muscleGroup.id === primaryMuscleGroupId ? "hidden" : ""
                  } ${
                    !primaryMuscleGroupId ? "cursor-default" : "cursor-pointer"
                  } flex relative items-center justify-center py-1 px-2 hover:opacity-75 h-8 rounded-xs transition-all duration-300 ${
                    isSelected ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <span className="text-xs text-center text-white">
                    {muscleGroup.name
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>

                  <RenderSvg
                    src="url(src/assets/pixel-art/body/body-void-side-32-.svg)"
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="absolute w-[4px] h-full -left-[3px]"
                  />
                  <RenderSvg
                    src="url(src/assets/pixel-art/body/body-void-side-32-.svg)"
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="absolute w-[4px] h-full -right-[3px]"
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
    <div className="gap-y-1 flex flex-col h-full">
      <label className="label w-full justify-between">
        <span className="label-text pl-5 text-sm">Secondary movers</span>
      </label>
      {Object.entries(categories).map(([category, muscles]) =>
        renderMuscleGroups(category, muscles)
      )}
    </div>
  );
};

export default MuscleGroupTree;
