import React, { useEffect, useRef, useState } from "react";
import { Template } from "../../../utils/types/template-types";
import { TemplateExercise } from "../../../utils/types/exercise-types";
import { ExerciseCard } from "../../../components/exercise/exercise-card";
import { CategoryCounterVertical } from "../../../components/statistics/exercises/category-counter-vertical";
import { calculateCategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { CategoryCounterHorizontal } from "../../../components/statistics/exercises/category-counter-horizontal";
import { useTemplate } from "../../../hooks/templates/template-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { DeleteModal } from "../../../components/modals/delete-modal";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { RenderPng } from "../../../components/pixel-art/render-png";
import { useMutation } from "@tanstack/react-query";
import {
  handleHistoryCreation,
  HistoryCreationResult,
} from "../../../api/history/history-creation";
import { useStatus } from "../../../hooks/status/status-context";
import { CreateHistoryFormData } from "../../../lib/validation/history-schema";

interface Set {
  weight: number;
  reps: number;
  rpe: number | null;
  notes: string;
}

interface ExerciseSets {
  [exerciseId: string]: Set[];
}

interface TemplateInfoProps {
  template: Template;
}

const TemplateInfo = React.memo(({ template }: TemplateInfoProps) => {
  const templateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setIsCreatingTemplate, setShowExerciseInfo } = useExerciseState();
  const { setTemplateForUpdate } = useTemplate();
  const [, setSearchParams] = useSearchParams();
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const [startedWorkout, setStartedWorkout] = useState(false);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSets>({});
  const { setStatusText } = useStatus();

  useEffect(() => {
    // Initialize exerciseSets with one empty set for each exercise
    if (startedWorkout) {
      const initialSets: ExerciseSets = {};
      template.exercises.forEach((exercise) => {
        initialSets[exercise.exercise.id] = [
          {
            weight: 0,
            reps: 0,
            rpe: null,
            notes: "",
          },
        ];
      });
      setExerciseSets(initialSets);
    }
  }, [startedWorkout, template.exercises]);

  const addSet = (exerciseId: string) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: [
        ...prev[exerciseId],
        { weight: 0, reps: 0, rpe: null, notes: "" },
      ],
    }));
  };

  const removeSet = (exerciseId: string) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].slice(0, -1),
    }));
  };

  const updateSet = (
    exerciseId: string,
    setIndex: number,
    field: keyof Set,
    value: number | string | null
  ) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set, idx) =>
        idx === setIndex ? { ...set, [field]: value } : set
      ),
    }));
  };

  function updateTemplate() {
    navigate("/exercises");
    setIsCreatingTemplate(true);
    setTemplateForUpdate(template);
  }

  useEffect(() => {
    if (templateRef.current) {
      templateRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [template]);

  const createHistoryMutation = useMutation({
    mutationFn: async (formData: CreateHistoryFormData) => {
      if (!startedWorkout) {
        return {
          success: false,
          error: "Workout not started",
        };
      }
      return await handleHistoryCreation(formData, () => {});
    },
    onSuccess: (result: HistoryCreationResult) => {
      if (!result.success) {
        setStatusText(result.error || "Failed to create workout history");
        return;
      }
      setStartedWorkout(false);
      setStatusText("Workout history created successfully");
    },
    onError: (error) => {
      setStatusText(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const setsArray = template.exercises.map((exercise) => {
      const exerciseSetsData = exerciseSets[exercise.exercise.id] || [];
      return exerciseSetsData.map((set) => ({
        weight: set.weight,
        reps: set.reps,
        rpe: set.rpe ?? undefined,
        notes: set.notes || undefined,
      }));
    });

    const formData: CreateHistoryFormData = {
      templateId: template.id,
      sets: setsArray,
    };

    createHistoryMutation.mutate(formData);
  };

  return (
    <>
      {startedWorkout ? (
        <>
          <form onSubmit={handleSubmit} className="size-full">
            <div className="flex justify-center items-center flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-white text-lg">{template.name}</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  End Workout
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl p-4">
                {template.exercises.map((exercise) => (
                  <div
                    key={exercise.exercise.id}
                    className="flex flex-col gap-4 bg-neutral-900 p-4 rounded-lg"
                  >
                    <ExerciseCard exercise={exercise.exercise} />
                    <div className="flex flex-col gap-2">
                      {exerciseSets[exercise.exercise.id]?.map(
                        (set, setIndex) => (
                          <div
                            key={setIndex}
                            className="flex flex-col gap-2 bg-neutral-800 p-3 rounded"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">
                                Set {setIndex + 1}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-300">
                                  Weight (kg)
                                </label>
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) =>
                                    updateSet(
                                      exercise.exercise.id,
                                      setIndex,
                                      "weight",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="bg-neutral-700 text-white px-2 py-1 rounded"
                                  min="0"
                                  step="0.5"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-300">
                                  Reps
                                </label>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) =>
                                    updateSet(
                                      exercise.exercise.id,
                                      setIndex,
                                      "reps",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="bg-neutral-700 text-white px-2 py-1 rounded"
                                  min="0"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-300">
                                  RPE
                                </label>
                                <input
                                  type="number"
                                  value={set.rpe || ""}
                                  onChange={(e) =>
                                    updateSet(
                                      exercise.exercise.id,
                                      setIndex,
                                      "rpe",
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
                                    )
                                  }
                                  className="bg-neutral-700 text-white px-2 py-1 rounded"
                                  min="0"
                                  max="10"
                                  step="0.5"
                                  placeholder="Optional"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-300">
                                  Notes
                                </label>
                                <input
                                  type="text"
                                  value={set.notes}
                                  onChange={(e) =>
                                    updateSet(
                                      exercise.exercise.id,
                                      setIndex,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  className="bg-neutral-700 text-white px-2 py-1 rounded"
                                  placeholder="Optional"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addSet(exercise.exercise.id)}
                          className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex-1"
                        >
                          Add Set
                        </button>
                        {exerciseSets[exercise.exercise.id]?.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSet(exercise.exercise.id)}
                            className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm flex-1"
                          >
                            Remove Last Set
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </>
      ) : (
        <div className="size-full">
          <div ref={templateRef}>
            <span className="text-white text-lg">{template.name}</span>
            <div
              onClick={() => {
                if (selectedTemplate) {
                  setStartedWorkout(true);
                }
              }}
            >
              start
            </div>
            <div
              onClick={() => {
                setSelectedTemplate(null);
              }}
            >
              sair
            </div>
            <div onClick={updateTemplate} className="text-white text-sm">
              update
            </div>
            <div
              onClick={() => {
                setSearchParams(
                  (prev) => {
                    prev.set("templateId", template.id);
                    prev.set("templateToDeleteName", template.name);
                    return prev;
                  },
                  { replace: true }
                );
                const modal = document.getElementById(
                  "delete_template_modal"
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              delete
            </div>
          </div>
          <div className="w-full h-48 md:hidden">
            <CategoryCounterVertical
              categoryCounts={calculateCategoryCounts(template)}
              hasCount={false}
            />
          </div>
          <div className="hidden w-full h-48 md:grid grid-cols-2 pl-6">
            <CategoryCounterHorizontal
              categoryCounts={calculateCategoryCounts(template)}
            />
          </div>
          <div className="grid grid-cols-2  lg:grid-cols-3 2xl:grid-cols-4 gap-y-4 justify-items-center items-start w-full">
            {template.exercises
              .slice()
              .sort(
                (a: TemplateExercise, b: TemplateExercise) => a.order - b.order
              )
              .map((exercise: TemplateExercise) => (
                <div
                  key={exercise.exercise.id}
                  className="flex flex-col md:flex-row gap-2 items-center h-full"
                >
                  <div className="relative group">
                    <button
                      className="size-max z-1 absolute top-0 right-[-0.5rem]"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (setShowExerciseInfo) {
                          setShowExerciseInfo(exercise.exercise);
                        }
                      }}
                    >
                      <RenderPng
                        src="buttons/btn-info-48.png"
                        alt="info-button"
                        className={`size-[36px] block lg:hidden lg:group-hover:block cursor-pointer`}
                        imgClassName="transition-all filter brightness-75 duration-200 hover:brightness-110"
                      />
                    </button>
                    <div className="relative">
                      <RenderSvg
                        src="cards/order-marker.svg"
                        size="auto"
                        repeat="no-repeat"
                        position="center"
                        className="absolute top-24 right-7 size-6 text-slate-300 z-2 flex items-center opacity-40 justify-center text-xxs"
                      >
                        {exercise.order}
                      </RenderSvg>
                      <ExerciseCard exercise={exercise.exercise} />
                    </div>
                  </div>
                  {!exercise.notes ? (
                    <span className="text-center md:h-full md:w-52 w-full p-2 h-max overflow-y-auto md:max-h-64 max-h-40">
                      No notes
                    </span>
                  ) : (
                    <span className="text-center md:h-full md:w-52 w-full p-2 h-max overflow-y-auto no-scrollbar md:max-h-64 max-h-40">
                      {exercise.notes}
                    </span>
                  )}
                </div>
              ))}
          </div>
          <DeleteModal
            type="template"
            setSelectedTemplate={setSelectedTemplate}
          />
        </div>
      )}
    </>
  );
});

export default TemplateInfo;
