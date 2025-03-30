import { useEffect, useRef } from "react";
import { Exercise } from "../../utils/types/exercise-types";
import { ExerciseCard } from "./exercise-card";
import { RenderSvg } from "../pixel-art/render-svg";

interface ExerciseInfoProps {
  exercise: Exercise;
  setShowExerciseInfo: (showExerciseInfo: Exercise | undefined) => void;
  isCreatingExercise: boolean | undefined;
  isCreatingTemplate: boolean | undefined;
  exerciseForUpdate: Exercise | null | undefined;
  showExerciseInfo: Exercise | null | undefined;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
  setSearchParams?: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace: boolean }
  ) => void;
}

export const ExerciseInfo = ({
  exercise,
  setShowExerciseInfo,
  isCreatingExercise,
  exerciseForUpdate,
  showExerciseInfo,
  setExerciseForUpdate,
  setSearchParams,
  isCreatingTemplate,
}: ExerciseInfoProps) => {
  const exerciseCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (exerciseCardRef.current) {
      exerciseCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [exerciseCardRef]);

  return (
    <div className="absolute inset-0 z-99 flex items-start pt-16 md:pt-20 h-full overflow-hidden justify-center bg-black/90">
      <div
        className="flex flex-col items-center justify-center gap-4 md:flex-row cursor-default w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-4 left-4 size-max cursor-pointer"
          onClick={() => setShowExerciseInfo(undefined)}
        >
          close
        </div>
        <div
          ref={exerciseCardRef}
          className="w-full md:w-max flex md:flex-col items-center justify-center gap-x-2 gap-y-4"
        >
          <ExerciseCard
            exercise={exercise}
            isCreatingExercise={isCreatingExercise}
            exerciseForUpdate={exerciseForUpdate}
            setShowExerciseInfo={setShowExerciseInfo}
            showExerciseInfo={showExerciseInfo}
          />
          <div className="flex flex-col md:flex-row gap-4">
            {setSearchParams && !isCreatingTemplate && (
              <button
                className="cursor-pointer size-max border"
                disabled={
                  exercise.id === exerciseForUpdate?.id || isCreatingTemplate
                }
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
                delete
              </button>
            )}
            {setExerciseForUpdate && !isCreatingTemplate && (
              <button
                className="cursor-pointer size-max border"
                disabled={
                  exercise.id === exerciseForUpdate?.id || isCreatingTemplate
                }
                onClick={() => {
                  setExerciseForUpdate(exercise);
                  setShowExerciseInfo(undefined);

                  if (exercise.id === exerciseForUpdate?.id) {
                    setExerciseForUpdate(null);
                  }
                }}
              >
                update
              </button>
            )}
          </div>
        </div>
        <div className="px-10 py-4 size-full md:w-max md:pt-8 text-white tracking-wide">
          <h2 className="text-4xl md:text-6xl font-bold mb-2">
            {exercise.name}
          </h2>
          <p className="text-lg md:text-xl mb-4 text-neutral-400">
            {exercise.description || "No description available."}
          </p>
          <div className="flex flex-col md:flex-row gap-x-8 md:text-xl text-lg">
            <div className="flex flex-col">
              <div className="mb-2 ">
                <strong>Primary Muscle Group</strong>
                <ul className="list-disc list-inside ml-2">
                  {exercise.exerciseMuscleGroups
                    .filter((mg) => mg.isPrimary)
                    .map((mg) => (
                      <div className="flex flex-row gap-2 items-center">
                        <li key={mg.muscleGroup.id}>
                          {mg.muscleGroup.name.replace(/_/g, " ")}
                        </li>
                        <RenderSvg
                          src={`url(src/assets/pixel-art/muscles/${mg.muscleGroup.name}.svg)`}
                          size="24px"
                          repeat="no-repeat"
                          className="size-6"
                          position="center"
                        />
                      </div>
                    ))}
                </ul>
              </div>
              {exercise.exerciseMuscleGroups.some((mg) => !mg.isPrimary) && (
                <div className="mb-2 ">
                  <strong>Secondary Muscle Groups</strong>
                  <ul className="list-disc list-inside ml-2">
                    {exercise.exerciseMuscleGroups
                      .filter((mg) => !mg.isPrimary)
                      .map((mg) => (
                        <div className="flex flex-row gap-2 items-center">
                          <li key={mg.muscleGroup.id}>
                            {mg.muscleGroup.name.replace(/_/g, " ")}
                          </li>
                          <RenderSvg
                            src={`url(src/assets/pixel-art/muscles/${mg.muscleGroup.name}.svg)`}
                            size="24px"
                            repeat="no-repeat"
                            className="size-6"
                            position="center"
                          />
                        </div>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div>
                <strong>Category</strong>
                <div className="flex flex-row gap-2 items-center">
                  <li>{exercise.tag.category}</li>{" "}
                  <RenderSvg
                    src={`url(src/assets/pixel-art/exercise-cards/category-indicator-${exercise.tag.category}.svg)`}
                    position="center"
                    size="auto"
                    repeat="no-repeat"
                    className="size-7"
                  />
                </div>
              </div>
              <div>
                <strong>Subcategory</strong>
                <li>{exercise.tag.name}</li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
