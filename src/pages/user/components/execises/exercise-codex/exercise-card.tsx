import { CircleFadingArrowUp, Trash2Icon } from "lucide-react";
import {
  getColorBackgroundForTagCategory,
  getColorClassForTagCategory,
} from "../../../../../utils/tag-colors";
import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseForUpdate?: Exercise | null;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
  setSearchParams?: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace: boolean }
  ) => void;
  isCreatingTemplate?: boolean;
  templateExercises?: TemplateExercise[];
  setTemplateExercises?: (exercises: TemplateExercise[]) => void;
}

export const ExerciseCard = ({
  exercise,
  exerciseForUpdate,
  setExerciseForUpdate,
  setSearchParams,
  isCreatingTemplate,
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
      <div
        key={exercise.id}
        onClick={handleAddExerciseToTemplate}
        className={` ${
          exerciseForUpdate
            ? exerciseForUpdate.id === exercise.id
              ? // ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-125 z-50"
                ""
              : " opacity-10 relative"
            : "relative"
        } ${getColorBackgroundForTagCategory(exercise.tag.category)} ${
          !isCreatingTemplate
            ? "cursor-default"
            : "cursor-pointer hover:scale-105 transition-all duration-300"
        } flex-col w-32 md:w-40 lg:w-48 md:h-64 h-56 lg:h-72 p-[1px] rounded-md flex-grow-0 flex-shrink-0 transition-all duration-300`}
      >
        <div
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
                  className={`size-5 bg-neutral-900 rounded-md rounded-b-none`}
                />
              </div>
            ))}
        </div>
        <div className="flex flex-col w-full gap-y-2 bg-gradient-to-b from-neutral-900 to-black rounded-md h-full relative p-1.5">
          <span className="w-full px-1 h-14 flex">
            {exercise.name ? (
              <p className="truncate">{exercise.name}</p>
            ) : (
              "No name"
            )}
          </span>
          <div className="flex w-full items-center justify-center py-2">
            <div className="size-14 lg:size-24 flex overflow-hidden items-center justify-center opacity-50 rounded-full bg-black shadow-[1px_0px_10px_7px_rgba(255,255,255,1),-6px_-5px_5px_7px_rgba(255,255,255,0.1),0px_0px_50px_10px_rgba(255,0,0,0.8),0px_0px_15px_15px_rgba(255,0,0,1),inset_0px_0px_35px_2px_rgba(255,0,0,0.5)]">
              {exercise.exerciseMuscleGroups
                .filter((muscleGroup) => muscleGroup.isPrimary)
                .map((muscleGroup) => (
                  <div
                    key={muscleGroup.muscleGroup.name}
                    className="tooltip tooltip-bottom"
                    data-tip={muscleGroup.muscleGroup.name}
                  >
                    <img
                      src={`src/assets/icons/muscle-group/${muscleGroup.muscleGroup.name}.png`}
                      alt={`${muscleGroup.muscleGroup.name} icon`}
                      className="size-max "
                    />
                  </div>
                ))}
            </div>
          </div>
          {exercise.tag.category ? (
            <img
              src={`src/assets/icons/category/${exercise.tag.category}.png`}
              alt={`${exercise.tag.category} icon`}
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
              className={`${
                exercise.tag.category
                  ? getColorBackgroundForTagCategory(exercise.tag.category)
                  : "bg-neutral-700"
              } icon-class size-7 rounded-lg p-1 absolute -top-3.5 -right-3`}
            />
          ) : (
            <div
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
              className="size-7 rounded-lg p-1 absolute -top-3.5 -right-3 bg-neutral-700"
            />
          )}
          <div className="w-full flex flex-col gap-y-1 h-full relative">
            <span className={`w-full px-1`}>
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
            </span>
            <div className="text-xs w-full overflow-y-auto h-full no-scrollbar pb-1">
              {exercise.description
                ? exercise.description
                : "There is no description"}
            </div>
            {setSearchParams &&
              exercise.id !== exerciseForUpdate?.id &&
              !isCreatingTemplate && (
                <button
                  className="cursor-pointer absolute left-0 -bottom-0"
                  disabled={exercise.id === exerciseForUpdate?.id}
                  onClick={async () => {
                    setSearchParams(
                      (prev) => {
                        prev.set("exerciseToDeleteId", exercise.id);
                        prev.set("exerciseToDeleteName", exercise.name);
                        return prev;
                      },
                      { replace: true }
                    );
                    const modal = document.getElementById(
                      "delete_exercise_modal"
                    ) as HTMLDialogElement;
                    modal?.showModal();
                  }}
                >
                  <Trash2Icon className="size-3.5 text-gray-400 hover:text-white" />
                </button>
              )}
            {setExerciseForUpdate && !isCreatingTemplate && (
              <button
                className={`cursor-pointer absolute right-0 -bottom-0 ${
                  exercise.id === exerciseForUpdate?.id
                    ? `${getColorClassForTagCategory(
                        exercise.tag.category
                      )} animate-pulse `
                    : "text-gray-400"
                }`}
                onClick={() => {
                  setExerciseForUpdate(exercise);

                  if (exercise.id === exerciseForUpdate?.id) {
                    setExerciseForUpdate(null);
                  }
                }}
              >
                <CircleFadingArrowUp className="size-3.5 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
