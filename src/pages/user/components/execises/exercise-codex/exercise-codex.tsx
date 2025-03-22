import { lazy, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";
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
import { CardCounter } from "./card-counter";
import { isExerciseByTagData } from "../../../../../utils/exercise-by-tag-data";

const CreateOrUpdateExercises = lazy(
  () => import("../create-update-exercises")
);

const MobileTemplateForm = lazy(() => import("../form/mobile-template-form"));

const TemplateCreationList = lazy(
  () => import("../../template/template-creation-list")
);

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
    const pageSize = 20;
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory =
      (searchParams.get("category") as ExerciseCategory) || "";
    const { statusText } = useStatus();
    const exerciseName = searchParams.get("exerciseName") || "";
    const [isStatistics, setIsStatistics] = useState(false);
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
    const [templateExercises, setTemplateExercises] = useState<
      TemplateExercise[]
    >([]);

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

    const onUpdateNotes = useCallback(
      (exerciseId: string, notes: string) => {
        if (templateExercises) {
          setTemplateExercises(
            templateExercises.map((exercise) =>
              exercise.exerciseId === exerciseId
                ? { ...exercise, notes }
                : exercise
            )
          );
        }
      },
      [templateExercises, setTemplateExercises]
    );

    const onRemoveExercise = useCallback(
      (exerciseId: string) => {
        if (templateExercises) {
          setTemplateExercises(
            templateExercises.filter(
              (exercise) => exercise.exerciseId !== exerciseId
            )
          );
        }
      },
      [templateExercises, setTemplateExercises]
    );

    return (
      <div className="relative w-full h-max flex-col flex items-center gap-y-0.5 justify-start">
        {statusText && <StatusToast statusText={statusText} />}
        <div className="w-full fixed z-2">
          <CodexSelector
            selectedCategory={selectedCategory}
            handleTabClick={handleTabClick}
            setSearchParams={setSearchParams}
            isStatistics={isStatistics}
            setIsStatistics={setIsStatistics}
            isCreatingExercise={isCreatingExercise}
            exerciseForUpdate={exerciseForUpdate}
          />
        </div>

        <ul className="relative gap-1 mt-16 w-full h-full">
          <div
            className={`${
              isCreatingTemplate ? "top-1/3 lg:hidden" : "top-40"
            } right-2 fixed z-99 ${
              isStatistics || exerciseForUpdate || isCreatingExercise
                ? "hidden"
                : ""
            }`}
          >
            <CardCounter
              isCreatingTemplate={isCreatingTemplate}
              setIsCreatingTemplate={setIsCreatingTemplate}
              templateExercises={templateExercises}
            />
          </div>
          {isCreatingTemplate && templateExercises && !isStatistics && (
            <React.Suspense fallback={<div>Loading...</div>}>
              <MobileTemplateForm
                templateExercises={templateExercises}
                setTemplateExercises={setTemplateExercises}
                onUpdateNotes={onUpdateNotes}
                onRemoveExercise={onRemoveExercise}
                setIsCreatingTemplate={setIsCreatingTemplate}
              />
            </React.Suspense>
          )}
          {exerciseData &&
          exerciseData.exercises.length > 0 &&
          !isStatistics &&
          !isCreatingExercise &&
          !exerciseForUpdate ? (
            <>
              {!isLoading ? (
                <div className="flex size-full relative">
                  <div
                    className={` ${
                      exerciseForUpdate ? "overflow-hidden" : "overflow-y-auto "
                    } ${
                      isCreatingTemplate
                        ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:px-10 w-full lg:w-3/4"
                        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 w-full"
                    } h-full no-scrollbar grid gap-y-8 pt-7 px-4 gap-x-3 justify-items-center items-start pb-2 min-h-screen`}
                  >
                    {!isCreatingTemplate && (
                      <NewExerciseBtn
                        exerciseForUpdate={exerciseForUpdate}
                        setIsCreatingExercise={setIsCreatingExercise}
                        isCreatingExercise={isCreatingExercise}
                        setExerciseForUpdate={setExerciseForUpdate}
                      />
                    )}
                    {exerciseData.exercises &&
                      exerciseData.exercises
                        .filter(
                          (exercise) =>
                            !templateExercises?.some(
                              (templateExercise) =>
                                templateExercise.exerciseId === exercise.id
                            )
                        )
                        .map((exercise: Exercise) => (
                          <ExerciseCard
                            exerciseForUpdate={exerciseForUpdate}
                            setExerciseForUpdate={setExerciseForUpdate}
                            exercise={exercise}
                            setSearchParams={setSearchParams}
                            isCreatingTemplate={isCreatingTemplate}
                            templateExercises={templateExercises}
                            setTemplateExercises={setTemplateExercises}
                          />
                        ))}
                  </div>
                  {isCreatingTemplate && (
                    <div className="w-1/4 fixed h-[calc(100vh-7rem)] right-0 hidden lg:block p-2 rounded-l-md rounded-b-none bg-gradient-to-r from-neutral-950 to-red-950/50">
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <TemplateCreationList
                          exercises={templateExercises}
                          onUpdateNotes={onUpdateNotes}
                          onRemoveExercise={onRemoveExercise}
                          setIsCreatingTemplate={setIsCreatingTemplate}
                          setTemplateExercises={setTemplateExercises}
                        />
                      </React.Suspense>
                    </div>
                  )}
                </div>
              ) : (
                <div>load</div>
              )}
            </>
          ) : !isStatistics && !isCreatingExercise && !exerciseForUpdate ? (
            <div className="flex size-full relative">
              {/* <div
                className={`${
                  isCreatingTemplate ? "top-1/3 lg:hidden" : "top-40"
                } right-2 fixed z-99 ${
                  isStatistics || exerciseForUpdate || isCreatingExercise
                    ? "hidden"
                    : ""
                }`}
              >
                <CardCounter
                  isCreatingTemplate={isCreatingTemplate}
                  setIsCreatingTemplate={setIsCreatingTemplate}
                  templateExercises={templateExercises}
                />
              </div> */}
              <div
                className={` ${
                  exerciseForUpdate ? "overflow-hidden" : "overflow-y-auto "
                } w-full h-full lg:w-3/4 no-scrollbar grid gap-y-8 pt-7 px-4 gap-x-3 justify-items-start items-start pb-2`}
              >
                <NewExerciseBtn
                  exerciseForUpdate={exerciseForUpdate}
                  setIsCreatingExercise={setIsCreatingExercise}
                  isCreatingExercise={isCreatingExercise}
                  setExerciseForUpdate={setExerciseForUpdate}
                />
              </div>

              {isCreatingTemplate && (
                <div className="w-1/4 fixed h-[calc(100vh-7rem)] right-0 hidden lg:block p-2 rounded-l-md rounded-b-none bg-gradient-to-r from-neutral-950 to-red-950/50">
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <TemplateCreationList
                      exercises={templateExercises}
                      onUpdateNotes={onUpdateNotes}
                      onRemoveExercise={onRemoveExercise}
                      setIsCreatingTemplate={setIsCreatingTemplate}
                      setTemplateExercises={setTemplateExercises}
                    />
                  </React.Suspense>
                </div>
              )}
            </div>
          ) : (
            <>
              {!isCreatingExercise && !exerciseForUpdate && (
                <div className="w-full h-fit mt-14 md:mt-8 flex flex-col overflow-y-auto no-scrollbar lg:flex-row gap-y-3">
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
        {/* {!isStatistics && !isCreatingExercise && !exerciseForUpdate && (
          <CodexPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )} */}
        <DeleteExerciseModal />
      </div>
    );
  }
);
