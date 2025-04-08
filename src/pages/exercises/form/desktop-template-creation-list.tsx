import React, {
  RefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DesktopTemplateItem } from "../template/desktop-template-item";
import { useMutation } from "@tanstack/react-query";
import {
  handleTemplateCreation,
  TemplateCreationResult,
} from "../../../api/templates/template-creation";
import { TemplateFormData } from "../../../api/templates/fetch-create-update-template";
import { useStatus } from "../../../hooks/status/status-context";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { Exercise } from "../../../utils/types/exercise-types";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { Template, TemplateItem } from "../../../utils/types/template-types";
import { CategoryCounterVertical } from "../../../components/statistics/exercises/category-counter-vertical";
import { CategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { useTemplate } from "../../../hooks/templates/template-context";
import { handleTemplateUpdate } from "../../../api/templates/template-update";
import { useNavigate } from "react-router-dom";
interface TemplateCreationListProps {
  exercises: TemplateItem[];
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  setTemplateExercises: React.Dispatch<React.SetStateAction<TemplateItem[]>>;
  showExerciseInfoById: (exerciseId: string) => void;
  templateExercisesHashTable: RefObject<{ [key: string]: Exercise }>;
  templateForUpdate?: Template | null;
}

const TemplateCreationList = React.memo(
  ({
    exercises,
    onUpdateNotes,
    onRemoveExercise,
    setTemplateExercises,
    showExerciseInfoById,
    templateExercisesHashTable,
    templateForUpdate,
  }: TemplateCreationListProps) => {
    const templateNameRef = useRef<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { setStatusText } = useStatus();
    const { setIsCreatingTemplate } = useExerciseState();
    const { setTemplateForUpdate, setSelectedTemplate } = useTemplate();
    const navigate = useNavigate();

    const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({
      "": 0,
      ENDURANCE: 0,
      MOVEMENT: 0,
      PLYOMETRICS: 0,
      STRENGTH: 0,
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (templateForUpdate) {
        templateNameRef.current = templateForUpdate.name;
      }
    }, [templateForUpdate]);

    const countCategories = (
      templateExercisesHashTable: RefObject<{ [key: string]: Exercise }>
    ) => {
      const counts: CategoryCounts = {
        "": 0,
        ENDURANCE: 0,
        MOVEMENT: 0,
        PLYOMETRICS: 0,
        STRENGTH: 0,
      };

      Object.values(templateExercisesHashTable.current).forEach((exercise) => {
        const category = exercise.tag.category as keyof CategoryCounts;
        if (counts[category] !== undefined) {
          counts[category]++;
        }
        counts[""]++;
      });

      setCategoryCounts(counts);
    };

    useEffect(() => {
      countCategories(templateExercisesHashTable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exercises]);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
          const oldIndex = exercises.findIndex(
            (exercise) => exercise.exerciseId === active.id
          );
          const newIndex = exercises.findIndex(
            (exercise) => exercise.exerciseId === over.id
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            setTemplateExercises(arrayMove(exercises, oldIndex, newIndex));
          }
        }
      },
      [exercises, setTemplateExercises]
    );

    const createTemplateMutation = useMutation({
      mutationFn: async (formData: TemplateFormData) => {
        return await handleTemplateCreation(formData, setIsLoading);
      },
      onSuccess: (response: TemplateCreationResult) => {
        if (!response.success) {
          setStatusText(`${response.error}`);
          return;
        }
        templateNameRef.current = "";
        onRemoveExercise("all");
        if (formRef.current) {
          formRef.current.reset();
        }
        setStatusText("Workout created successfully");
      },
      onError: (error) => {
        setStatusText(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      },
    });

    const updateTemplateMutation = useMutation({
      mutationFn: async ({
        formData,
        templateForUpdateId,
      }: {
        formData: TemplateFormData;
        templateForUpdateId: string;
      }) => {
        return await handleTemplateUpdate(
          formData,
          setIsLoading,
          templateForUpdateId
        );
      },
      onSuccess: (response: TemplateCreationResult) => {
        if (!response.success) {
          setStatusText(`${response.error}`);
          return;
        }
        templateNameRef.current = "";
        onRemoveExercise("all");
        if (templateForUpdate) {
          setTemplateForUpdate(null);
          setSelectedTemplate(null);
          navigate("/workouts");
        }
        if (formRef.current) {
          formRef.current.reset();
        }
        setStatusText(`${templateForUpdate?.name} updated successfully`);
      },
      onError: (error) => {
        setStatusText(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      },
    });

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!templateForUpdate) {
        const formData = {
          name: templateNameRef.current,
          exercises: exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            notes: exercise.notes || "",
          })),
        };

        await createTemplateMutation.mutateAsync(formData);
      } else {
        const formData = {
          templateId: templateForUpdate.id,
          name: templateNameRef.current,
          exercises: exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            notes: exercise.notes || "",
          })),
        };

        await updateTemplateMutation.mutateAsync({
          formData,
          templateForUpdateId: templateForUpdate.id,
        });
      }
    };

    return (
      <div className="size-full relative">
        <RenderSvg
          src="general/desktop-template-details-attach.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="h-16 w-8 absolute top-0.5 right-[6px]"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <RenderSvg
            src="icons/right-icon-16.svg"
            size="auto"
            repeat="no-repeat"
            position="center"
            transform={!isOpen ? "rotate(90deg)" : "rotate(270deg)"}
            className="size-4 absolute top-6 right-[14px] transition-all duration-200 filter hover:filter hover:brightness-150 cursor-pointer"
          />
        </button>
        <RenderSvg
          src="general/desktop-template-back-attach.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="h-16 w-6 absolute top-10 left-[-6px]"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsCreatingTemplate(false);
          }}
        >
          <RenderSvg
            src="icons/right-icon-16.svg"
            size="auto"
            repeat="no-repeat"
            position="center"
            className="size-4 absolute top-16 left-[-2px] transition-all duration-200 filter hover:filter hover:brightness-150 cursor-pointer"
          />
        </button>

        <form
          action="create_template"
          onSubmit={handleSubmit}
          ref={formRef}
          className="h-full w-full"
        >
          <div className="flex flex-col gap-y-2 justify-between h-full w-full">
            <input
              type="text"
              name="name"
              onChange={(e) => (templateNameRef.current = e.target.value)}
              defaultValue={templateForUpdate?.name || ""}
              className="h-8 pl-3 pt-1 font-bold text-xl input-sm bg-transparent w-10/12 absolute top-2 clean"
              placeholder="Workout name"
            />

            <div className="flex flex-col gap-2 pt-2 overflow-y-auto w-[calc(100%-34px)] h-[calc(100%-120px)] no-scrollbar absolute top-14 left-4">
              {isOpen ? (
                <CategoryCounterVertical categoryCounts={categoryCounts} />
              ) : (
                <>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={exercises.map((e) => e.exerciseId)}
                      strategy={verticalListSortingStrategy}
                    >
                      {exercises &&
                        exercises.length > 0 &&
                        exercises.map((exercise, index) => (
                          <DesktopTemplateItem
                            key={exercise.exerciseId}
                            exerciseId={exercise.exerciseId}
                            notes={exercise.notes}
                            exerciseName={exercise.name}
                            exerciseOrder={index + 1}
                            onUpdateNotes={(notes) =>
                              onUpdateNotes(exercise.exerciseId, notes)
                            }
                            onRemove={() =>
                              onRemoveExercise(exercise.exerciseId)
                            }
                            showExerciseInfoById={showExerciseInfoById}
                          />
                        ))}
                    </SortableContext>
                  </DndContext>
                </>
              )}
            </div>

            <div className="absolute bottom-2 w-full h-[44px] flex items-center justify-between px-3">
              <button
                className={`h-full w-[calc(48*4px)] ${
                  (exercises && exercises.length === 0) || isLoading
                    ? "opacity-80"
                    : "opacity-100"
                }`}
                disabled={(exercises && exercises.length === 0) || isLoading}
              >
                <RenderSvg
                  src="buttons/btn-create-template.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="size-full cursor-pointer text-xl font-bold flex items-center justify-center pb-1 transition-all duration-200 filter brightness-75 hover:brightness-110"
                >
                  {templateForUpdate
                    ? `${isLoading ? "Updating..." : "Update Workout"}`
                    : `${isLoading ? "Creating..." : "Create Workout"}`}
                </RenderSvg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveExercise("all");
                  if (templateForUpdate) {
                    setTemplateForUpdate(null);
                  }
                }}
                className="h-full w-[calc(24*4px)] transition-all duration-200 filter brightness-75 hover:brightness-110"
              >
                <RenderSvg
                  src="buttons/btn-erase-template.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="size-full cursor-pointer"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default TemplateCreationList;
