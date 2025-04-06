import { RefObject, useEffect, useRef, useState } from "react";
import { Exercise } from "../../../utils/types/exercise-types";
import { useMutation } from "@tanstack/react-query";
import { TemplateFormData } from "../../../api/templates/fetch-create-update-template";
import {
  handleTemplateCreation,
  TemplateCreationResult,
} from "../../../api/templates/template-creation";
import React from "react";
import { useStatus } from "../../../hooks/status/status-context";
import { MobileTemplateItem } from "../template/mobile-template-item";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { Input } from "../../../components/forms/input";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { Template, TemplateItem } from "../../../utils/types/template-types";
import { CategoryCounterHorizontal } from "../../../components/statistics/exercises/category-counter-horizontal";
import { CategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { useTemplate } from "../../../hooks/templates/template-context";
import { handleTemplateUpdate } from "../../../api/templates/template-update";
interface MobileTemplateFormProps {
  templateExercises: TemplateItem[];
  setTemplateExercises: React.Dispatch<React.SetStateAction<TemplateItem[]>>;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  showExerciseInfoById: (exerciseId: string) => void;
  templateExercisesHashTable: RefObject<{ [key: string]: Exercise }>;
  templateForUpdate?: Template | null;
}

const MobileTemplateForm = React.memo(
  ({
    templateExercises,
    setTemplateExercises,
    onUpdateNotes,
    onRemoveExercise,
    showExerciseInfoById,
    templateExercisesHashTable,
    templateForUpdate,
  }: MobileTemplateFormProps) => {
    const [templateName, setTemplateName] = useState<string>("");
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [templateInfo, setTemplateInfo] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { setStatusText } = useStatus();
    const { setIsCreatingTemplate } = useExerciseState();
    const { setTemplateForUpdate } = useTemplate();
    const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({
      "": 0,
      ENDURANCE: 0,
      MOVEMENT: 0,
      PLYOMETRICS: 0,
      STRENGTH: 0,
    });

    useEffect(() => {
      if (templateForUpdate) {
        setTemplateName(templateForUpdate.name);
      }
    }, [templateForUpdate]);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = templateExercises.findIndex(
          (exercise) => exercise.exerciseId === active.id
        );
        const newIndex = templateExercises.findIndex(
          (exercise) => exercise.exerciseId === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          setTemplateExercises(
            arrayMove(templateExercises, oldIndex, newIndex)
          );
        }
      }
    };

    const createTemplateMutation = useMutation({
      mutationFn: async (formData: TemplateFormData) => {
        return await handleTemplateCreation(formData, setIsLoading);
      },
      onSuccess: (response: TemplateCreationResult) => {
        if (!response.success) {
          setStatusText(`${response.error}`);
          const timeout = setTimeout(() => {
            setStatusText(null);
          }, 3000);
          return () => clearTimeout(timeout);
        }
        setTemplateName("");
        setIsCreatingTemplate(false);
        onRemoveExercise("all");
        setShowNameInput(false);
        if (formRef.current) {
          formRef.current.reset();
        }
        setStatusText("Workout created successfully");
        const timeout = setTimeout(() => {
          setStatusText(null);
        }, 3000);
        return () => clearTimeout(timeout);
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
          const timeout = setTimeout(() => {
            setStatusText(null);
          }, 3000);
          return () => clearTimeout(timeout);
        }
        setTemplateName("");
        setIsCreatingTemplate(false);
        onRemoveExercise("all");
        if (templateForUpdate) {
          setTemplateForUpdate(null);
        }
        if (formRef.current) {
          formRef.current.reset();
        }
        setStatusText(`${templateForUpdate?.name} updated successfully`);
        const timeout = setTimeout(() => {
          setStatusText(null);
        }, 3000);
        return () => clearTimeout(timeout);
      },
    });

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!templateForUpdate) {
        const formData = {
          name: templateName,
          exercises: templateExercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            notes: exercise.notes || "",
          })),
        };

        await createTemplateMutation.mutateAsync(formData);
      } else {
        const formData = {
          templateId: templateForUpdate.id,
          name: templateName,
          exercises: templateExercises.map((exercise) => ({
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

    const toggleNameInput = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setTemplateInfo(false);
      setShowNameInput((prev) => !prev);
    };

    const toggleTemplateInfo = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowNameInput(false);
      setTemplateInfo((prev) => !prev);
    };

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
    }, [templateExercises]);

    return (
      <RenderSvg
        src="body/body-96.svg"
        size="auto"
        repeat="repeat"
        position="center"
        className="relative w-9/10 p-1 h-24"
      >
        <RenderSvg
          src="body/body-side-96.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="absolute top-0 h-full -left-1.5 w-2"
        />
        <RenderSvg
          src="body/body-side-96.svg"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="absolute top-0 h-full -right-1.5 w-2"
          transform="rotate(180deg)"
        />
        <form
          action="create_template"
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div
            className={`${
              showNameInput ? "block" : "hidden"
            }  h-22 w-full flex items-center justify-center p-2`}
          >
            <Input
              type="text"
              name="name"
              className=""
              placeholder="Workout name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div
            className={`${
              templateInfo ? "block" : "hidden"
            }  h-22 w-full  grid grid-cols-2`}
          >
            <CategoryCounterHorizontal categoryCounts={categoryCounts} />
          </div>

          {!showNameInput && !templateInfo && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full flex items-center h-22  flex-row gap-x-4 overflow-x-auto overflow-y-hidden no-scrollbar px-3 py-2">
                <SortableContext
                  items={templateExercises.map((e) => e.exerciseId)}
                  strategy={horizontalListSortingStrategy}
                >
                  {templateExercises.map((exercise, index) => (
                    <MobileTemplateItem
                      key={exercise.exerciseId}
                      exerciseId={exercise.exerciseId}
                      notes={exercise.notes}
                      exerciseName={exercise.name}
                      exerciseOrder={index + 1}
                      onUpdateNotes={(notes) =>
                        onUpdateNotes(exercise.exerciseId, notes)
                      }
                      onRemoveExercise={onRemoveExercise}
                      showExerciseInfoById={showExerciseInfoById}
                    />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          )}

          <RenderSvg
            src="body/body-64.svg"
            size="auto"
            repeat="repeat"
            position="center"
            className="w-max px-4 left-1/2 translate-x-[-50%] h-16 absolute bottom-24 flex flex-row gap-x-2 items-center justify-evenly"
          >
            <RenderSvg
              src="body/body-side-64.svg"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="absolute h-[64px] w-[21px] -left-1"
            />
            <RenderSvg
              src="body/body-side-64.svg"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="absolute h-[64px] w-[21px] -right-1"
              transform="rotate(180deg)"
            />

            <button
              type="button"
              className=""
              disabled={isLoading}
              onClick={toggleNameInput}
            >
              <RenderSvg
                src="buttons/btn-pen-32.svg"
                size="auto"
                repeat="no-repeat"
                position="center"
                className={`${
                  templateName.length < 5 && "animate-pulse"
                } size-8 cursor-pointer`}
              />
            </button>

            <button
              type="button"
              className="filter brightness-75"
              disabled={isLoading}
              onClick={toggleTemplateInfo}
            >
              <RenderSvg
                src="buttons/btn-chart.32.svg"
                size="auto"
                repeat="no-repeat"
                position="center"
                className="size-8 cursor-pointer"
              />
            </button>

            <button
              type="submit"
              disabled={isLoading || templateExercises.length === 0}
            >
              <RenderSvg
                src="buttons/btn-submit.svg"
                size="auto"
                repeat="no-repeat"
                position="center"
                className={`filter ${
                  templateName.length > 5 && templateExercises.length > 0
                    ? "brightness-100"
                    : "brightness-50"
                } h-8 w-24 flex items-center justify-center cursor-pointer pb-0.5`}
              >
                {templateForUpdate
                  ? `${isLoading ? "Updating..." : "Update"}`
                  : `${isLoading ? "Creating..." : "Create"}`}
              </RenderSvg>
            </button>

            <button
              type="button"
              className={`filter ${
                isLoading || templateExercises.length === 0
                  ? "brightness-50"
                  : "brightness-100"
              } `}
              disabled={isLoading || templateExercises.length === 0}
              onClick={(e) => {
                e.preventDefault();
                onRemoveExercise("all");
                setTemplateName("");
                if (templateForUpdate) {
                  setTemplateForUpdate(null);
                }
              }}
            >
              <RenderSvg
                src="buttons/btn-eraser-32.svg"
                size="auto"
                repeat="no-repeat"
                position="center"
                className="size-8 cursor-pointer"
              />
            </button>
          </RenderSvg>
        </form>
      </RenderSvg>
    );
  }
);

export default MobileTemplateForm;
