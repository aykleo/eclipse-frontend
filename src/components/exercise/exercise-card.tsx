import { memo } from "react";
import { Exercise } from "../../utils/types/exercise-types";
import { RenderPng } from "../pixel-art/render-png";
import { RenderSvg } from "../pixel-art/render-svg";

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = memo(({ exercise }: ExerciseCardProps) => {
  return (
    <>
      <RenderPng
        className={`flex-col w-[192px] h-[256px] flex items-center group justify-center transition-all duration-300 relative`}
        src="exercise-cards/generic-exercise-card.png"
        alt="exercise-card"
        imgClassName="w-full h-full"
      >
        <div className="flex overflow-hidden items-center absolute top-6 rounded-full size-max justify-center">
          {exercise.exerciseMuscleGroups
            .filter((muscleGroup) => muscleGroup.isPrimary)
            .map((muscleGroup) => (
              <img
                key={muscleGroup.muscleGroup.id}
                src={`src/assets/pixel-art/muscles/${muscleGroup.muscleGroup.name}.svg`}
                alt={`${muscleGroup.muscleGroup.name} icon`}
                className="size-18"
              />
            ))}
        </div>

        <span className="w-[170px] h-[32px] justify-center px-2.5 absolute top-31.5">
          <div className="size-full pt-1.5 truncate text-center">
            {exercise.name ? <>{exercise.name}</> : "No name"}
          </div>
        </span>

        {exercise.tag.category && (
          <RenderSvg
            src={`url(src/assets/pixel-art/exercise-cards/category-indicator-${exercise.tag.category}.svg)`}
            position="center"
            size="auto"
            repeat="no-repeat"
            className="size-7 rounded-lg p-1 absolute top-28"
          />
        )}

        <div className="h-[72px] text-xs p-1 absolute w-[156px] break-words bottom-4 overflow-y-auto no-scrollbar">
          {exercise.description
            ? exercise.description
            : "There is no description"}
        </div>
      </RenderPng>
    </>
  );
});
