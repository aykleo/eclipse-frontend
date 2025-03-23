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
import { CodexSelector } from "./codex-selector";
import React from "react";
import { CardCounter } from "./card-counter";
import { ExerciseCategory } from "../../../../../utils/codex-selector-categories";
import { CardList } from "./card-list";

const CreateOrUpdateExercises = lazy(
  () => import("../create-update-exercises")
);

const MobileTemplateForm = lazy(() => import("../form/mobile-template-form"));

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

        setCurrentPage(1);
      },
      [setSearchParams, setCurrentPage]
    );

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
      <div className="relative w-full h-max flex-col flex items-center gap-y-0.5 bg-transparent justify-start">
        {statusText && <StatusToast statusText={statusText} />}
        <div className="w-full fixed z-999">
          <CodexSelector
            handleTabClick={handleTabClick}
            setSearchParams={setSearchParams}
            selectedCategory={selectedCategory}
          />
        </div>

        <ul className="relative gap-1 mt-12 w-full h-full">
          <div
            className={`${
              isCreatingTemplate ? "top-1/3 lg:hidden" : "top-40"
            } right-2 fixed z-99 ${
              exerciseForUpdate || isCreatingExercise ? "hidden" : ""
            }`}
          >
            <CardCounter
              isCreatingTemplate={isCreatingTemplate}
              setIsCreatingTemplate={setIsCreatingTemplate}
              templateExercises={templateExercises}
            />
          </div>
          {isCreatingTemplate && templateExercises && (
            <div className="fixed bottom-10  right-0 flex justify-center items-center z-100 lg:hidden w-full">
              <React.Suspense fallback={<div>Loading...</div>}>
                <MobileTemplateForm
                  templateExercises={templateExercises}
                  setTemplateExercises={setTemplateExercises}
                  onUpdateNotes={onUpdateNotes}
                  onRemoveExercise={onRemoveExercise}
                  setIsCreatingTemplate={setIsCreatingTemplate}
                />
              </React.Suspense>
            </div>
          )}
          {exerciseData && exerciseData.exercises.length > 0 ? (
            <>
              {!isLoading ? (
                <CardList
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  exerciseNumber={exerciseData.exercises.length}
                  currentPage={currentPage}
                  exerciseForUpdate={exerciseForUpdate}
                  setIsCreatingExercise={setIsCreatingExercise}
                  isCreatingExercise={isCreatingExercise}
                  setExerciseForUpdate={setExerciseForUpdate}
                  isCreatingTemplate={isCreatingTemplate}
                  templateExercises={templateExercises}
                  onUpdateNotes={onUpdateNotes}
                  onRemoveExercise={onRemoveExercise}
                  setIsCreatingTemplate={setIsCreatingTemplate}
                  setTemplateExercises={setTemplateExercises}
                >
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
                </CardList>
              ) : (
                <div>load</div>
              )}
            </>
          ) : (
            <CardList
              exerciseNumber={exerciseData?.exercises.length}
              currentPage={currentPage}
              exerciseForUpdate={exerciseForUpdate}
              setIsCreatingExercise={setIsCreatingExercise}
              isCreatingExercise={isCreatingExercise}
              setExerciseForUpdate={setExerciseForUpdate}
              isCreatingTemplate={isCreatingTemplate}
              templateExercises={templateExercises}
              onUpdateNotes={onUpdateNotes}
              onRemoveExercise={onRemoveExercise}
              setIsCreatingTemplate={setIsCreatingTemplate}
              setTemplateExercises={setTemplateExercises}
            />
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

        <DeleteExerciseModal />
      </div>
    );
  }
);
