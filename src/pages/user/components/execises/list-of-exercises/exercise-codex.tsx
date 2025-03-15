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
import { ExerciseCard } from "./exercise-card";

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
              <div
                className={` ${
                  exerciseForUpdate ? "overflow-hidden" : "overflow-y-auto "
                } h-full  no-scrollbar justify-evenly gap-y-8 gap-x-8 pt-7 pb-3 px-1 flex flex-wrap w-full`}
              >
                <div
                  onClick={() => {
                    if (exerciseForUpdate) {
                      setIsCreatingExercise(true);
                    } else {
                      setIsCreatingExercise(!isCreatingExercise);
                    }
                    setExerciseForUpdate(null);
                  }}
                  className={`${
                    exerciseForUpdate
                      ? "opacity-20"
                      : "opacity-50 hover:opacity-100"
                  } w-48 relative h-72  gap-y-3 px-1 cursor-pointer flex-grow-0 flex-shrink-0 rounded-md bg-gradient-to-b from-neutral-900 to-black border-neutral-600 border`}
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
                <ExerciseCard
                  exerciseForUpdate={exerciseForUpdate}
                  setExerciseForUpdate={setExerciseForUpdate}
                  exercises={exerciseData.exercises}
                  setSearchParams={setSearchParams}
                />
              </div>
            ) : (
              <div>load</div>
            )}
          </>
        ) : (
          <div
            onClick={() => {
              if (exerciseForUpdate) {
                setIsCreatingExercise(true);
              } else {
                setIsCreatingExercise(!isCreatingExercise);
              }
              setExerciseForUpdate(null);
            }}
            className={`${
              exerciseForUpdate ? "opacity-20" : "opacity-50 hover:opacity-100"
            } w-48 relative h-72  gap-y-3 px-1 cursor-pointer flex-grow-0 flex-shrink-0 rounded-md bg-gradient-to-b from-neutral-900 to-black border-neutral-600 border`}
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
