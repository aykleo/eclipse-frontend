import { useEffect, useRef, memo } from "react";
import { Exercise } from "../../utils/types/exercise-types";
import { ExerciseCard } from "./exercise-card";
import { RenderSvg } from "../pixel-art/render-svg";

interface ExerciseInfoProps {
  exercise: Exercise;
  setShowExerciseInfo: (showExerciseInfo: Exercise | undefined) => void;
  isCreatingTemplate: boolean | undefined;
  exerciseForUpdate: Exercise | null | undefined;
  showExerciseInfo: Exercise | undefined;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
  setSearchParams?: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace: boolean }
  ) => void;
}

export const ExerciseInfo = ({
  exercise,
  setShowExerciseInfo,
  exerciseForUpdate,
  showExerciseInfo,
  setExerciseForUpdate,
  setSearchParams,
  isCreatingTemplate,
}: ExerciseInfoProps) => {
  const exerciseCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (exerciseCardRef.current) {
      exerciseCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [exerciseCardRef]);

  return (
    <div className="absolute inset-0 z-99 flex items-center top-16 pt-4 md:pt-20 h-full overflow-hidden justify-center bg-black/90">
      <div
        className="flex flex-col items-start justify-center gap-4 md:flex-row cursor-default h-full w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-0 right-6 md:right-10 size-max"
          onClick={() => setShowExerciseInfo(undefined)}
        >
          <RenderSvg
            src={`url(src/assets/pixel-art/icons/cancel-icon-16.svg)`}
            size="32px"
            repeat="no-repeat"
            className="size-8 cursor-pointer transition-all duration-200 filter brightness-50 hover:brightness-150"
            position="center"
          />
        </div>
        <div
          ref={exerciseCardRef}
          className="w-full md:w-max flex md:flex-col items-center justify-center pt-8 gap-x-2 gap-y-4"
        >
          <ExerciseCard exercise={showExerciseInfo!} />
          <div className="flex flex-col md:flex-row gap-4">
            {setSearchParams && !isCreatingTemplate && (
              <button
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
                <RenderSvg
                  src={`url(src/assets/pixel-art/buttons/btn-delete-open.svg)`}
                  size="auto"
                  repeat="no-repeat"
                  className="h-8 w-16 cursor-pointer transition-all duration-200 filter brightness-100 hover:brightness-150"
                  position="center"
                />
              </button>
            )}
            {setExerciseForUpdate && !isCreatingTemplate && (
              <button
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
                <RenderSvg
                  src={`url(src/assets/pixel-art/buttons/btn-update-open.svg)`}
                  size="auto"
                  repeat="no-repeat"
                  className="h-8 w-16 cursor-pointer transition-all duration-200 filter brightness-100 hover:brightness-150"
                  position="center"
                />
              </button>
            )}
          </div>
        </div>
        <div className="px-10 py-4 size-full md:w-max md:max-w-1/2 md:pt-8 text-white tracking-wide">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            {exercise.name}
          </h2>
          <p className="text-lg md:text-xl mb-4 text-neutral-400 max-w-full">
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
                      <div
                        key={mg.muscleGroup.id}
                        className="flex flex-row gap-2 items-center"
                      >
                        <li>
                          {mg.muscleGroup.name
                            .replace(/_/g, " ")
                            .charAt(0)
                            .toUpperCase() +
                            mg.muscleGroup.name
                              .replace(/_/g, " ")
                              .slice(1)
                              .toLowerCase()}
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
              {exercise.exerciseMuscleGroups.some((mg) => !mg.isPrimary) ? (
                <div className="mb-2 ">
                  <strong>Secondary Muscle Groups</strong>
                  <ul className="list-disc list-inside ml-2">
                    {exercise.exerciseMuscleGroups
                      .filter((mg) => !mg.isPrimary)
                      .map((mg) => (
                        <div
                          key={mg.muscleGroup.id}
                          className="flex flex-row gap-2 items-center"
                        >
                          <li>
                            {mg.muscleGroup.name
                              .replace(/_/g, " ")
                              .charAt(0)
                              .toUpperCase() +
                              mg.muscleGroup.name
                                .replace(/_/g, " ")
                                .slice(1)
                                .toLowerCase()}
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
              ) : (
                <div className="mb-2 ">
                  <strong>Secondary Muscle Groups</strong>
                  <ul className="list-disc list-inside ml-2">
                    <li>None</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <div>
                <strong>Category</strong>
                <ul className="list-disc list-inside ml-2">
                  <li>
                    {exercise.tag.category.charAt(0).toUpperCase() +
                      exercise.tag.category.slice(1).toLowerCase()}
                  </li>
                </ul>
              </div>
              <div>
                <strong>Type</strong>
                <ul className="list-disc list-inside ml-2">
                  <li>{exercise.tag.name}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemoizedExerciseInfo = memo(ExerciseInfo);
