import { lazy, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "../../../../../utils/types/exercise-types";
import { useUser } from "../../../../../hooks/user/use-context";
import { fetchExercises } from "../../../../../api/exercises/fetch-exercises";
import { useSearchParams } from "react-router-dom";
import { useStatus } from "../../../../../hooks/status/status-context";
import { DeleteExerciseModal } from "../delete-modal";
import { StatusToast } from "../../../../../components/status-toast";
import { ExerciseCard } from "./exercise-card";
import { CodexSelector, ExerciseCategory } from "./codex-selector";
import { CodexPagination } from "./codex-pagination";
import React from "react";
import { NewExerciseBtn } from "./new-exercise-btn";
import { ExerciseByTagBar } from "../statistics/exercise-by-tag-bars";
import { ExerciseByTagPie } from "../statistics/exercise-by-tag-pie";
import ExerciseByMuscleGroup from "../statistics/exercise-by-muscle-group";
import { handleExerciseByTag } from "../../../../../api/statistics/exercises/exercise-by-tag";

const CreateOrUpdateExercises = lazy(
  () => import("../create-update-exercises")
);

export type ExerciseByTagData = {
  exerciseCountsByCategory: Record<
    string,
    { count: number; percentage: number }
  >;
  numberOfExercises: number;
};

type ApiResponse = ExerciseByTagData | { error: string };

function isExerciseByTagData(data: ApiResponse): data is ExerciseByTagData {
  return (
    data &&
    "numberOfExercises" in data &&
    "exerciseCountsByCategory" in data &&
    typeof data.numberOfExercises === "number" &&
    typeof data.exerciseCountsByCategory === "object"
  );
}

export const ExerciseCodex = React.memo(
  ({
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
    const { user } = useUser() || {};
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 30;
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory =
      (searchParams.get("category") as ExerciseCategory) || "";
    const { statusText } = useStatus();
    const exerciseName = searchParams.get("exerciseName") || "";
    const [isStatistics, setIsStatistics] = useState(false);

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
      enabled: !!user,
    });

    useEffect(() => {
      if (exerciseData) {
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

        if (isStatistics) {
          setIsStatistics(false);
        }
        setCurrentPage(1);
      },
      [setSearchParams, setCurrentPage, isStatistics]
    );

    const { data: exerciseByTagData } = useQuery({
      queryKey: ["exerciseByTag"],
      queryFn: () => handleExerciseByTag(),
      enabled: !!user,
    });

    return (
      <div className="relative w-full h-full flex-col flex items-center gap-y-0.5 justify-start p-3">
        {statusText && <StatusToast statusText={statusText} />}

        <CodexSelector
          selectedCategory={selectedCategory}
          handleTabClick={handleTabClick}
          setSearchParams={setSearchParams}
          isStatistics={isStatistics}
          setIsStatistics={setIsStatistics}
          isCreatingExercise={isCreatingExercise}
          exerciseForUpdate={exerciseForUpdate}
        />
        <ul className="rounded-box shadow-md gap-1 w-full h-full overflow-hidden">
          {exerciseData &&
          exerciseData.exercises.length > 0 &&
          !isStatistics &&
          !isCreatingExercise &&
          !exerciseForUpdate ? (
            <>
              {!isLoading ? (
                <div
                  className={` ${
                    exerciseForUpdate ? "overflow-hidden" : "overflow-y-auto "
                  } h-full no-scrollbar grid gap-y-8 pt-7 px-1 w-full justify-items-center items-start grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8`}
                >
                  <NewExerciseBtn
                    exerciseForUpdate={exerciseForUpdate}
                    setIsCreatingExercise={setIsCreatingExercise}
                    isCreatingExercise={isCreatingExercise}
                    setExerciseForUpdate={setExerciseForUpdate}
                  />
                  {exerciseData.exercises &&
                    exerciseData.exercises.map((exercise: Exercise) => (
                      <ExerciseCard
                        exerciseForUpdate={exerciseForUpdate}
                        setExerciseForUpdate={setExerciseForUpdate}
                        exercise={exercise}
                        setSearchParams={setSearchParams}
                      />
                    ))}
                </div>
              ) : (
                <div>load</div>
              )}
            </>
          ) : !isStatistics && !isCreatingExercise && !exerciseForUpdate ? (
            <NewExerciseBtn
              exerciseForUpdate={exerciseForUpdate}
              setIsCreatingExercise={setIsCreatingExercise}
              isCreatingExercise={isCreatingExercise}
              setExerciseForUpdate={setExerciseForUpdate}
            />
          ) : (
            <>
              {!isCreatingExercise && !exerciseForUpdate && (
                <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar lg:flex-row gap-y-3">
                  <div className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col gap-x-3 h-full">
                    {exerciseByTagData &&
                      isExerciseByTagData(exerciseByTagData) && (
                        <>
                          <ExerciseByTagBar
                            data={exerciseByTagData}
                            isLoading={isLoading}
                          />
                          <ExerciseByTagPie
                            data={exerciseByTagData}
                            isLoading={isLoading}
                          />
                        </>
                      )}
                  </div>
                  <div className="w-full lg:w-2/3 h-full">
                    <ExerciseByMuscleGroup />
                  </div>
                </div>
              )}
            </>
          )}
          {isCreatingExercise && !exerciseForUpdate && (
            <CreateOrUpdateExercises
              setIsCreatingExercise={setIsCreatingExercise}
              setExerciseForUpdate={setExerciseForUpdate}
              exerciseForUpdate={exerciseForUpdate}
              isCreatingExercise={isCreatingExercise}
            />
          )}
          {exerciseForUpdate && (
            <CreateOrUpdateExercises
              exerciseForUpdate={exerciseForUpdate}
              setExerciseForUpdate={setExerciseForUpdate}
              isCreatingExercise={isCreatingExercise}
              setIsCreatingExercise={setIsCreatingExercise}
            />
          )}
        </ul>
        {!isStatistics && !isCreatingExercise && !exerciseForUpdate && (
          <CodexPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
        <DeleteExerciseModal />
      </div>
    );
  }
);
