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

export const ListAllExercises = ({
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
  const pageSize = 10;
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
    <div className="relative w-full h-full flex-col flex items-center gap-y-0.5 justify-start p-3 ">
      {statusText && (
        <StatusToast statusText={statusText}>
          <div className="progress-bar bg-gray-300 h-1 mt-2 animate-progress-animation progress-bar rounded-full">
            <div className="progress bg-error h-full"></div>
          </div>
          <ToastProgress />
        </StatusToast>
      )}
      <CategorySelector
        selectedCategory={selectedCategory}
        handleTabClick={handleTabClick}
        exerciseForUpdate={exerciseForUpdate}
        setIsCreatingExercise={setIsCreatingExercise}
        isCreatingExercise={isCreatingExercise}
        setExerciseForUpdate={setExerciseForUpdate}
        setSearchParams={setSearchParams}
      />
      <ul className="list rounded-box shadow-md gap-y-0.5 w-full h-full pb-21">
        {exerciseData && exerciseData.exercises.length > 0 ? (
          <>
            {!isLoading ? (
              <div className="h-full overflow-y-auto overflow-x-hidden no-scrollbar gap-y-1.5 py-1 flex flex-col w-full">
                {exercises &&
                  exercises.map((exercise: Exercise) => (
                    <div
                      key={exercise.id}
                      className={`${
                        exerciseForUpdate
                          ? exerciseForUpdate.id === exercise.id
                            ? "bg-gradient-to-r from-zinc-950 border to-neutral-950 border-error/25"
                            : "bg-transparent opacity-20"
                          : "border-b border-gray-700/30 rounded-b-none"
                      } flex-col w-full p-1.5 rounded-md`}
                    >
                      <div className="flex flex-row gap-x-4 items-center w-full">
                        <div className="flex flex-col gap-y-0.5 w-full">
                          <div className="flex flex-row gap-y-0.5 gap-x-2 items-center justify-between w-full">
                            <div
                              className={`${getColorClassForTagCategory(
                                exercise.tag.category
                              )} text-lg gap-x-4 flex items-center justify-start pr-1 w-2/3`}
                            >
                              <span className="truncate">{exercise.name}</span>

                              <span
                                className={`"text-xs opacity-40 truncate ${getColorClassForTagCategory(
                                  exercise.tag.category
                                )} `}
                              >
                                {exercise.tag.name}
                              </span>
                              <div
                                className="tooltip tooltip-bottom cursor-help"
                                data-tip={
                                  exercise.description
                                    ? exercise.description
                                    : "There is no description"
                                }
                              >
                                <MessageCircleQuestionIcon className="size-5 text-gray-400 hover:text-white" />
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-y-0.5">
                              {/* <span className="text-xs text-gray-600">
                                {new Intl.DateTimeFormat("pt-BR", {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                }).format(new Date(exercise.createdAt))}
                              </span> */}
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
                          </div>
                          <div className="flex flex-row item-center justify-between">
                            <div className="gap-x-2 w-1/2 flex flex-wrap">
                              <img
                                src={`src/assets/icons/category/${exercise.tag.category}.png`}
                                alt={`${exercise.tag.category} icon`}
                                className={`${getColorBackgroundForTagCategory(
                                  exercise.tag.category
                                )} icon-class size-7 rounded-lg p-1`}
                              />
                              {exercise.exerciseMuscleGroups.map(
                                (muscleGroup) => (
                                  <img
                                    src={`src/assets/icons/muscle-group/${muscleGroup.muscleGroup.name}.png`}
                                    alt={`${muscleGroup.muscleGroup.name} icon`}
                                    className={`${
                                      muscleGroup.isPrimary ? "" : "opacity-35"
                                    } size-7 rounded-full border border-transparent shadow-xs shadow-gray-700`}
                                  />
                                )
                              )}
                            </div>

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
                                  disabled={
                                    exercise.id === exerciseForUpdate?.id
                                  }
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
                          </div>
                        </div>
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
