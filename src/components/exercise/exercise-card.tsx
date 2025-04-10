import { memo } from "react";
import { Exercise } from "../../utils/types/exercise-types";
import { RenderPng } from "../pixel-art/render-png";
import { RenderSvg } from "../pixel-art/render-svg";
import { getColorClassForTagCategory } from "../../utils/tag-colors";

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = memo(({ exercise }: ExerciseCardProps) => {
  const categoryColorClass = getColorClassForTagCategory(exercise.tag.category);
  const svgColorClass = categoryColorClass.replace("text-", "svg-");

  return (
    <>
      <RenderPng
        className={`flex-col w-[192px] h-[256px] flex items-center group justify-center transition-all duration-300 relative`}
        src="cards/exercise-card.png"
        alt="exercise-card"
        imgClassName="w-full h-full"
      >
        <div className="flex overflow-hidden items-center absolute top-6 rounded-full size-max justify-center">
          {exercise.exerciseMuscleGroups
            .filter((muscleGroup) => muscleGroup.isPrimary)
            .map((muscleGroup) => (
              <img
                key={muscleGroup.muscleGroup.id}
                src={`/src/assets/pixel-art/muscles/${muscleGroup.muscleGroup.name}.svg`}
                alt={`${muscleGroup.muscleGroup.name} icon`}
                className={`size-16 ${svgColorClass}`}
              />
            ))}
        </div>

        <span className="w-[154px] h-[29px] justify-center px-2 absolute top-31">
          <div className="size-full truncate text-center">
            {exercise.name ? <>{exercise.name}</> : "No name"}
          </div>
        </span>

        {exercise.tag.category && (
          <RenderSvg
            src={`cards/category-indicator-${exercise.tag.category}.svg`}
            position="center"
            size="auto"
            repeat="no-repeat"
            className="size-7 rounded-lg p-1 absolute top-36"
          />
        )}

        <div className="h-[84px] text-xxs p-1.5 absolute w-[144px] break-words bottom-2.5 overflow-y-auto no-scrollbar">
          {exercise.description
            ? exercise.description
            : "There is no description"}
        </div>
      </RenderPng>
    </>
  );
});
