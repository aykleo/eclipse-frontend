import { TemplateExercise } from "../../utils/types/exercise-types";
import { Exercise } from "../../utils/types/exercise-types";
import { RenderPng } from "../pixel-art/render-png";
import { RenderSvg } from "../pixel-art/render-svg";

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseForUpdate?: Exercise | null;
  showExerciseInfo?: Exercise | null;
  setShowExerciseInfo?: (exercise: Exercise | undefined) => void;
  isCreatingTemplate?: boolean;
  isCreatingExercise?: boolean;
  templateExercises?: TemplateExercise[];
  setTemplateExercises?: (exercises: TemplateExercise[]) => void;
}

export const ExerciseCard = ({
  exercise,
  exerciseForUpdate,
  showExerciseInfo,
  setShowExerciseInfo,
  isCreatingTemplate,
  isCreatingExercise,
  templateExercises,
  setTemplateExercises,
}: ExerciseCardProps) => {
  const handleAddExerciseToTemplate = () => {
    if (isCreatingTemplate && setTemplateExercises && templateExercises) {
      const isExerciseAlreadyAdded = templateExercises.some(
        (templateExercise) => templateExercise.exerciseId === exercise.id
      );

      if (!isExerciseAlreadyAdded) {
        setTemplateExercises([
          ...templateExercises,
          { exerciseId: exercise.id, notes: "", name: exercise.name },
        ]);
      }
    }
  };

  return (
    <>
      <RenderPng
        key={exercise.id}
        onClick={handleAddExerciseToTemplate}
        className={`${
          !isCreatingTemplate ? "cursor-default" : "cursor-pointer"
        } flex-col w-[192px] h-[256px] flex items-center group justify-center rounded-md flex-grow-0 flex-shrink-0 transition-all duration-300 relative`}
        src="src/assets/pixel-art/exercise-cards/generic-exercise-card.png"
        alt="exercise-card"
        imgClassName="absolute top-0 left-0 w-full h-full"
      >
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (setShowExerciseInfo) {
              setShowExerciseInfo(exercise);
            }
          }}
        >
          <RenderPng
            src="src/assets/pixel-art/buttons/btn-info-48.png"
            alt="info-button"
            className={`absolute top-0 right-[-0.5rem] size-[48px] hidden ${
              !exerciseForUpdate && !isCreatingExercise && !showExerciseInfo
                ? "group-hover:block"
                : ""
            } cursor-pointer`}
            imgClassName="transition-all filter brightness-75 duration-200 hover:brightness-110"
          />
        </button>
        {/* <div
          className={`${
            exercise.exerciseMuscleGroups.length < 2
              ? "hidden"
              : "absolute left-1 -top-5 flex flex-row gap-x-0.5"
          }`}
        >
          {exercise.exerciseMuscleGroups
            .filter((muscleGroup) => !muscleGroup.isPrimary)
            .map((muscleGroup) => (
              <div
                key={muscleGroup.muscleGroup.name}
                className={`${getColorBackgroundForTagCategory(
                  exercise.tag.category
                )} rounded-md rounded-b-none p-[1.5px] tooltip tooltip-bottom cursor-help`}
                data-tip={muscleGroup.muscleGroup.name.replace(/_/g, " ")}
              >
                <img
                  src={`src/assets/icons/muscle-group/${muscleGroup.muscleGroup.name}.png`}
                  alt={`${muscleGroup.muscleGroup.name} icon`}
                  className={`size-5  rounded-md rounded-b-none`}
                />
              </div>
            ))}
        </div> */}

        <div className="flex overflow-hidden items-center absolute top-6 rounded-full size-max justify-center">
          {exercise.exerciseMuscleGroups
            .filter((muscleGroup) => muscleGroup.isPrimary)
            .map((muscleGroup) => (
              <img
                key={muscleGroup.muscleGroup.name}
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

        {/* <span className={`w-full px-1`}>
              <div
                className={`${
                  exercise.tag.category
                    ? getColorBackgroundForTagCategory(exercise.tag.category)
                    : "bg-neutral-700"
                } w-full truncate text-center px-3 text-xs lg:text-sm`}
                style={{
                  clipPath:
                    "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
                }}
              >
                {exercise.tag.name ? exercise.tag.name : "No tag"}
              </div>
            </span> */}
        <div className="h-[72px] text-xs p-1 absolute w-[156px] break-words bottom-4 overflow-y-auto no-scrollbar">
          {exercise.description
            ? exercise.description
            : "There is no description"}
        </div>
      </RenderPng>
    </>
  );
};
