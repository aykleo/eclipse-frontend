import { lazy, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "../../../utils/types/exercise-types";
import { useUser } from "../../../hooks/user/use-context";
import { fetchExercises } from "../../../api/exercises/fetch-exercises";
import { DeleteExerciseModal } from "../delete-modal";
import { ExerciseCard } from "../../../components/exercise/exercise-card";
import { CodexSelector } from "./codex-selector";
import React from "react";
import { CardCounter } from "./card-counter";
import { ExerciseCategory } from "../../../utils/codex-selector-categories";
import { CardList } from "./card-list";
import { RenderPng } from "../../../components/pixel-art/render-png";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { useSearchParams } from "react-router-dom";
import { TemplateItem } from "../../../utils/types/template-types";
import { RenderSvg } from "../../../components/pixel-art/render-svg";

const CreateOrUpdateExercises = lazy(
  () => import("../create-update-exercises")
);
const MobileTemplateForm = lazy(() => import("../form/mobile-template-form"));

export const ExerciseCodex = React.memo(() => {
  const { user } = useUser() || {};
  const {
    isCreatingExercise,
    exerciseForUpdate,
    showExerciseInfo,
    setShowExerciseInfo,
    isCreatingTemplate,
  } = useExerciseState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;
  const selectedCategory =
    (searchParams.get("category") as ExerciseCategory) || "";
  const exerciseName = searchParams.get("exerciseName") || "";
  const [templateExercises, setTemplateExercises] = useState<TemplateItem[]>(
    []
  );

  const templateExercisesHashTable = useRef<{ [key: string]: Exercise }>({});

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
            const newParams = new URLSearchParams(prev);
            newParams.set("category", category);
            return newParams;
          },
          { replace: true }
        );
      } else {
        setSearchParams(
          (prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.delete("category");
            return newParams;
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
      if (exerciseId === "all") {
        setTemplateExercises([]);
        templateExercisesHashTable.current = {};
      } else if (templateExercises) {
        setTemplateExercises(
          templateExercises.filter(
            (exercise) => exercise.exerciseId !== exerciseId
          )
        );
        delete templateExercisesHashTable.current[exerciseId];
      }
    },

    [templateExercises, setTemplateExercises]
  );

  const handleAddExerciseToTemplate = (exercise: Exercise) => {
    if (isCreatingTemplate && setTemplateExercises && templateExercises) {
      const isExerciseAlreadyAdded = templateExercises.some(
        (templateExercise) => templateExercise.exerciseId === exercise.id
      );

      if (!isExerciseAlreadyAdded) {
        setTemplateExercises([
          ...templateExercises,

          { exerciseId: exercise.id, notes: "", name: exercise.name },
        ]);

        templateExercisesHashTable.current[exercise.id] = exercise;
      }
    }
  };

  const showExerciseInfoById = (exerciseId: string) => {
    const exercise = templateExercisesHashTable.current[exerciseId];
    if (exercise && setShowExerciseInfo) {
      setShowExerciseInfo(exercise);
    }
  };

  return (
    <div className="relative w-full h-max flex-col flex items-center gap-y-0.5 justify-start">
      <div className="w-full fixed z-49 mt-16">
        <CodexSelector
          handleTabClick={handleTabClick}
          setSearchParams={setSearchParams}
          selectedCategory={selectedCategory}
        />
      </div>

      <ul className="relative gap-1 mt-12 w-full h-full">
        <div
          className={`${
            isCreatingTemplate ? "top-1/4 lg:hidden" : "top-40"
          } right-2 fixed z-99 ${
            exerciseForUpdate || isCreatingExercise ? "hidden" : ""
          }`}
        >
          <CardCounter templateExercises={templateExercises} />
        </div>
        {isCreatingTemplate && templateExercises && !showExerciseInfo && (
          <div className="fixed bottom-2 right-0 flex justify-center items-center z-100 lg:hidden w-full">
            <React.Suspense fallback={<div>Loading...</div>}>
              <MobileTemplateForm
                templateExercises={templateExercises}
                setTemplateExercises={setTemplateExercises}
                onUpdateNotes={onUpdateNotes}
                onRemoveExercise={onRemoveExercise}
                showExerciseInfoById={showExerciseInfoById}
                templateExercisesHashTable={templateExercisesHashTable}
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
                templateExercises={templateExercises}
                onUpdateNotes={onUpdateNotes}
                onRemoveExercise={onRemoveExercise}
                setTemplateExercises={setTemplateExercises}
                showExerciseInfoById={showExerciseInfoById}
                templateExercisesHashTable={templateExercisesHashTable}
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
                      <div
                        onClick={() => handleAddExerciseToTemplate(exercise)}
                        key={exercise.id}
                        className={`${
                          !isCreatingTemplate
                            ? "cursor-default"
                            : "cursor-pointer"
                        } size-max flex-grow-0 group flex-shrink-0 relative`}
                      >
                        <button
                          className="size-max z-1 absolute top-0 right-[-0.5rem]"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (setShowExerciseInfo) {
                              setShowExerciseInfo(exercise);
                            }
                          }}
                        >
                          <RenderPng
                            src="buttons/btn-info-48.png"
                            alt="info-button"
                            className={`size-[36px] ${
                              isCreatingTemplate ? "hidden" : "block"
                            } lg:hidden ${
                              !isCreatingTemplate ? "lg:group-hover:block" : ""
                            } cursor-pointer`}
                            imgClassName="transition-all filter brightness-75 duration-200 hover:brightness-110"
                          />
                        </button>
                        <ExerciseCard exercise={exercise} />
                      </div>
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
            templateExercises={templateExercises}
            onUpdateNotes={onUpdateNotes}
            onRemoveExercise={onRemoveExercise}
            setTemplateExercises={setTemplateExercises}
            showExerciseInfoById={showExerciseInfoById}
            templateExercisesHashTable={templateExercisesHashTable}
          />
        )}
        {(isCreatingExercise || exerciseForUpdate) && (
          <CreateOrUpdateExercises />
        )}
      </ul>
      <RenderSvg
        src="body/body-bot-4.svg"
        size="auto"
        repeat="repeat-x"
        position="center"
        className="absolute bottom-0 h-1 w-full"
      />
      <DeleteExerciseModal />
    </div>
  );
});
