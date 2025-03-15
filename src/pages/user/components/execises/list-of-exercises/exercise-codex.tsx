import { useCallback, useEffect, useState } from "react";
import {
  CircleFadingArrowUp,
  CircleFadingPlusIcon,
  MessageCircleQuestionIcon,
  Trash2Icon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "../../../../../utils/types/exercise-types";
import { useUser } from "../../../../../hooks/user/use-context";
import { fetchExercises } from "../../../../../api/exercises/fetch-exercises";
import {
  getColorBackgroundForTagCategory,
  getColorClassForTagCategory,
} from "../../../../../utils/tag-colors";
import { useSearchParams } from "react-router-dom";
import { useStatus } from "../../../../../hooks/status/status-context";
import { DeleteExerciseModal } from "../delete-modal";
import { ToastProgress } from "../../../../../components/styles/toast-progress";
import { StatusToast } from "../../../../../components/status-toast";
import { ExercisePagination } from "./exercise-pagination";
import { CategorySelector, ExerciseCategory } from "./category-selector";

export const ExerciseCodex = ({
  setIsCreatingExercise,
  isCreatingExercise,
  exerciseForUpdate,
  setExerciseForUpdate,
}: {
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
  isCreatingExercise: boolean;
  exerciseForUpdate: Exercise | null;
  setExerciseForUpdate: (exercise: Exercise | null) => void;
}) => {
  const { user } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 30;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory =
    (searchParams.get("category") as ExerciseCategory) || "";
  const { statusText } = useStatus();
  const exerciseName = searchParams.get("exerciseName") || "";

  const { data: exerciseData, isLoading } = useQuery({
    queryKey: [
      "exercises",
      { currentPage, pageSize, selectedCategory, user, exerciseName },
    ],
    queryFn: () => {
      if (user) {
        return fetchExercises(
          currentPage,
          pageSize,
          selectedCategory,
          user,
          exerciseName
        );
      }
      return Promise.resolve({ exercises: [], totalPages: 0 });
    },
  });

  useEffect(() => {
    if (exerciseData) {
      setExercises(exerciseData.exercises);
      setTotalPages(exerciseData.totalPages);
    }
  }, [exerciseData]);

  const handleTabClick = useCallback(
    (category: ExerciseCategory) => {
      if (category) {
        setSearchParams(
          (prev) => {
            prev.set("category", category);
            return prev;
          },
          { replace: true }
        );
      } else {
        setSearchParams(
          (prev) => {
            prev.delete("category");
            return prev;
          },
          { replace: true }
        );
      }

      setCurrentPage(1);
    },
    [setSearchParams, setCurrentPage]
  );

  return (
    <div className="relative w-full h-full flex-col flex items-center gap-y-0.5 justify-start p-3">
      {statusText && (
        <StatusToast statusText={statusText}>
          <div className="progress-bar bg-gray-300 h-1 mt-2 animate-progress-animation progress-bar rounded-full">
            <div className="progress bg-error h-full"></div>
          </div>
          <ToastProgress />
        </StatusToast>
      )}
      {/* <CategorySelector
        selectedCategory={selectedCategory}
        handleTabClick={handleTabClick}
        exerciseForUpdate={exerciseForUpdate}
        setIsCreatingExercise={setIsCreatingExercise}
        isCreatingExercise={isCreatingExercise}
        setExerciseForUpdate={setExerciseForUpdate}
        setSearchParams={setSearchParams}
      /> */}
      <ul className="rounded-box shadow-md gap-1 w-full h-full pb-10">
        {exerciseData && exerciseData.exercises.length > 0 ? (
          <>
            {!isLoading ? (
              <div className="h-full overflow-y-auto no-scrollbar justify-evenly gap-y-8 gap-x-8 pt-7 pb-3 px-1 flex flex-wrap w-full">
                <div
                  onClick={() => {
                    if (exerciseForUpdate) {
                      setIsCreatingExercise(true);
                    } else {
                      setIsCreatingExercise(!isCreatingExercise);
                    }
                    setExerciseForUpdate(null);
                  }}
                  className="w-48 relative h-72 opacity-50 hover:opacity-100 gap-y-3 px-1 cursor-pointer flex-grow-0 flex-shrink-0 rounded-md bg-gradient-to-b from-neutral-900 to-black border-neutral-600 border"
                >
                  <div
                    style={{
                      clipPath:
                        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    }}
                    className={`bg-neutral-700 icon-class size-7 rounded-lg p-1 absolute -top-3.5 -right-3`}
                  />
                  <span className="truncate w-full h-8 flex items-center">
                    New exercise
                  </span>
                  <a
                    className={`flex items-center opacity-60 justify-center text-gray-400 py-5`}
                  >
                    <CircleFadingPlusIcon className="size-24" />
                  </a>
                  <div className="w-full flex flex-col gap-y-1">
                    <span className={`w-full px-1 text-white`}>
                      <div
                        className="w-full truncate bg-neutral-500/50 text-center px-3"
                        style={{
                          clipPath:
                            "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
                        }}
                      >
                        Create
                      </div>
                    </span>
                    <div className="w-full h-max text-xs">
                      Activate to create a new exercise
                    </div>
                  </div>
                </div>
                {exercises &&
                  exercises.map((exercise: Exercise) => (
                    <div
                      key={exercise.id}
                      className={`${
                        exerciseForUpdate
                          ? exerciseForUpdate.id === exercise.id
                            ? "bg-gradient-to-r from-zinc-950 border to-neutral-950 border-error/25"
                            : "bg-transparent opacity-20"
                          : "border-b border-gray-700/30"
                      } ${getColorBackgroundForTagCategory(
                        exercise.tag.category
                      )} flex-col w-48 h-72 p-[1px] rounded-md flex-grow-0 flex-shrink-0 relative`}
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
                              className={`${getColorBackgroundForTagCategory(
                                exercise.tag.category
                              )} rounded-md rounded-b-none p-[1.5px] tooltip tooltip-left cursor-help`}
                              data-tip={muscleGroup.muscleGroup.name}
                            >
                              <img
                                src={`src/assets/icons/muscle-group/${muscleGroup.muscleGroup.name}.png`}
                                alt={`${muscleGroup.muscleGroup.name} icon`}
                                className={`size-5 bg-neutral-900 rounded-md rounded-b-none`}
                              />
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-col w-full gap-y-3 bg-gradient-to-b from-neutral-900 to-black rounded-md h-full relative p-1.5">
                        <span className="truncate w-full h-14 flex items-center">
                          {exercise.name}
                        </span>
                        <div className="flex w-full items-center justify-center py-2">
                          <div className="size-24 flex overflow-hidden items-center justify-center opacity-50 rounded-full bg-black shadow-[1px_0px_10px_7px_rgba(255,255,255,1),-6px_-5px_5px_7px_rgba(255,255,255,0.1),0px_0px_50px_10px_rgba(255,0,0,0.8),0px_0px_15px_15px_rgba(255,0,0,1),inset_0px_0px_35px_2px_rgba(255,0,0,0.5)]">
                            {exercise.exerciseMuscleGroups
                              .filter((muscleGroup) => muscleGroup.isPrimary)
                              .map((muscleGroup) => (
                                <div
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
                        <img
                          src={`src/assets/icons/category/${exercise.tag.category}.png`}
                          alt={`${exercise.tag.category} icon`}
                          style={{
                            clipPath:
                              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                          }}
                          className={`${getColorBackgroundForTagCategory(
                            exercise.tag.category
                          )} icon-class size-7 rounded-lg p-1 absolute -top-3.5 -right-3`}
                        />
                        <div className="w-full flex flex-col gap-y-1 h-full">
                          <span className={`w-full px-1 text-white `}>
                            <div
                              className="w-full truncate bg-red-500/50 text-center px-3"
                              style={{
                                clipPath:
                                  "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
                              }}
                            >
                              {exercise.tag.name}
                            </div>
                          </span>
                          <div className="text-xs w-full overflow-y-auto h-full no-scrollbar">
                            {exercise.description
                              ? exercise.description
                              : "There is no description"}
                          </div>
                        </div>

                        {/* <div className="flex flex-col items-end gap-y-0.5">
                          <button
                            className={`cursor-pointer ${
                              exercise.id === exerciseForUpdate?.id
                                ? getColorClassForTagCategory(
                                    exercise.tag.category
                                  )
                                : "text-gray-400"
                            }`}
                            onClick={() => {
                              setExerciseForUpdate(exercise);
                              if (exercise.id === exerciseForUpdate?.id) {
                                setExerciseForUpdate(null);
                              }
                            }}
                          >
                            <CircleFadingArrowUp className="size-5 hover:text-white" />
                          </button>
                        </div>
                        <div className="flex flex-row item-center justify-between">
                          <div className="flex flex-row gap-x-6 items-end justify-end w-max">
                            {exercise.id === exerciseForUpdate?.id ? (
                              <span
                                className={`text-lg ${
                                  exercise.id === exerciseForUpdate?.id
                                    ? getColorClassForTagCategory(
                                        exercise.tag.category
                                      )
                                    : ""
                                }`}
                              >
                                <p className="text-xs">Updating...</p>
                              </span>
                            ) : (
                              <button
                                className="cursor-pointer"
                                disabled={exercise.id === exerciseForUpdate?.id}
                                onClick={async () => {
                                  setSearchParams(
                                    (prev) => {
                                      prev.set("exerciseId", exercise.id);
                                      prev.set("exerciseName", exercise.name);
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
                                <Trash2Icon className="size-5 text-gray-400 hover:text-white" />
                              </button>
                            )}
                          </div>
                        </div> */}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>load</div>
            )}
          </>
        ) : (
          <div className="text-gray-600 gap-x-2 text-xl flex items-center justify-center p-4 size-full">
            <span className="flex items-center gap-x-2 text-sm md:text-lg">
              {exerciseName ? (
                `No exercises named "${exerciseName}"`
              ) : (
                <>
                  Create a new exercise by clicking on the
                  <CircleFadingPlusIcon className="size-6 md:size-8 text-gray-200" />
                </>
              )}
            </span>
          </div>
        )}
      </ul>
      <ExercisePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <DeleteExerciseModal />
    </div>
  );
};
