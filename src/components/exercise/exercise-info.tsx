import { useEffect, useRef, memo } from "react";
import { ExerciseCard } from "./exercise-card";
import { RenderSvg } from "../pixel-art/render-svg";
import { useExerciseState } from "../../hooks/exercises/exercise-context";
import { useSearchParams } from "react-router-dom";
import { useTemplate } from "../../hooks/templates/template-context";

export const ExerciseInfo = () => {
  const exerciseCardRef = useRef<HTMLDivElement>(null);
  const [, setSearchParams] = useSearchParams();
  const {
    exerciseForUpdate,
    setExerciseForUpdate,
    showExerciseInfo,
    setShowExerciseInfo,
    isCreatingTemplate,
  } = useExerciseState();
  const { selectedTemplate } = useTemplate();

  useEffect(() => {
    if (exerciseCardRef.current) {
      exerciseCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [exerciseCardRef]);

  return (
    <>
      {showExerciseInfo && (
        <div className="absolute inset-0 z-99 flex items-center top-16 pt-4 md:pt-20 h-max md:h-full justify-center bg-black">
          <div
            className="flex flex-col items-start justify-center gap-4 md:flex-row cursor-default h-full w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute top-0 right-6 md:right-10 size-max"
              onClick={() => setShowExerciseInfo(undefined)}
            >
              <RenderSvg
                src="icons/cancel-icon-16.svg"
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
                {setSearchParams &&
                  !isCreatingTemplate &&
                  !selectedTemplate && (
                    <button
                      disabled={
                        showExerciseInfo.id === exerciseForUpdate?.id ||
                        isCreatingTemplate
                      }
                      onClick={async () => {
                        setSearchParams(
                          (prev) => {
                            prev.set("exerciseToDeleteId", showExerciseInfo.id);
                            prev.set(
                              "exerciseToDeleteName",
                              showExerciseInfo.name
                            );
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
                        src="buttons/btn-delete-open.svg"
                        size="auto"
                        repeat="no-repeat"
                        className="h-8 w-16 cursor-pointer transition-all duration-200 filter brightness-100 hover:brightness-150"
                        position="center"
                      />
                    </button>
                  )}
                {setExerciseForUpdate &&
                  !isCreatingTemplate &&
                  !selectedTemplate && (
                    <button
                      disabled={
                        showExerciseInfo.id === exerciseForUpdate?.id ||
                        isCreatingTemplate
                      }
                      onClick={() => {
                        setExerciseForUpdate(showExerciseInfo);
                        setShowExerciseInfo(undefined);

                        if (showExerciseInfo.id === exerciseForUpdate?.id) {
                          setExerciseForUpdate(null);
                        }
                      }}
                    >
                      <RenderSvg
                        src="buttons/btn-update-open.svg"
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
                {showExerciseInfo.name}
              </h2>
              <p className="text-lg md:text-xl mb-4 text-neutral-400 max-w-full">
                {showExerciseInfo.description || "No description available."}
              </p>
              <div className="flex flex-col md:flex-row gap-x-8 md:text-xl text-lg">
                <div className="flex flex-col">
                  <div className="mb-2 ">
                    <strong>Primary Muscle Group</strong>
                    <ul className="list-disc list-inside ml-2">
                      {showExerciseInfo.exerciseMuscleGroups
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
                              src={`muscles/${mg.muscleGroup.name}.svg`}
                              size="24px"
                              repeat="no-repeat"
                              className="size-6"
                              position="center"
                            />
                          </div>
                        ))}
                    </ul>
                  </div>
                  {showExerciseInfo.exerciseMuscleGroups.some(
                    (mg) => !mg.isPrimary
                  ) ? (
                    <div className="mb-2 ">
                      <strong>Secondary Muscle Groups</strong>
                      <ul className="list-disc list-inside ml-2">
                        {showExerciseInfo.exerciseMuscleGroups
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
                                src={`muscles/${mg.muscleGroup.name}.svg`}
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
                        {showExerciseInfo.tag.category.charAt(0).toUpperCase() +
                          showExerciseInfo.tag.category.slice(1).toLowerCase()}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <strong>Type</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li>{showExerciseInfo.tag.name}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MemoizedExerciseInfo = memo(ExerciseInfo);
