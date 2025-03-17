import { useRef, useState } from "react";
import { TemplateExercise } from "../../../../../utils/types/exercise-types";
import { useMutation } from "@tanstack/react-query";
import { TemplateFormData } from "../../../../../api/templates/fetch-create-update-template";
import { handleTemplateCreation } from "../../../../../api/templates/template-creation";
import React from "react";
import { useStatus } from "../../../../../hooks/status/status-context";
import { TemplateCreationMobilePreview } from "../../template/template-creation-mobile-preview";
import { EraserIcon, NotebookPenIcon } from "lucide-react";
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

interface MobileTemplateFormProps {
  templateExercises: TemplateExercise[];
  setTemplateExercises: React.Dispatch<
    React.SetStateAction<TemplateExercise[]>
  >;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
}

const MobileTemplateForm = React.memo(
  ({
    templateExercises,
    setTemplateExercises,
    onUpdateNotes,
    onRemoveExercise,
    setIsCreatingTemplate,
  }: MobileTemplateFormProps) => {
    const [templateName, setTemplateName] = useState<string>("");
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { setStatusText } = useStatus();

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
        return await handleTemplateCreation(
          formData,
          setIsLoading,
          setTemplateExercises
        );
      },
      onSuccess: () => {
        setTemplateName("");
        setTemplateExercises([]);
        setShowNameInput(false);
        if (formRef.current) {
          formRef.current.reset();
        }
      },
      onError: (error: Error) => {
        setStatusText(`${error.message}`);
        const timeout = setTimeout(() => {
          setStatusText(null);
        }, 3000);
        return () => clearTimeout(timeout);
      },
    });

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const formData = {
        name: templateName,
        exercises: templateExercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          notes: exercise.notes || "",
        })),
      };

      await createTemplateMutation.mutateAsync(formData);
      setIsCreatingTemplate(false);
    };

    const toggleNameInput = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowNameInput((prev) => !prev);
    };

    return (
      <div
        className={`${
          showNameInput ? "bg-neutral-950" : ""
        } absolute bottom-10 right-0 z-100 lg:hidden w-full bg-gradient-to-r from-neutral-700/25 via-neutral-800 to-neutral-700/25 rounded-xs`}
      >
        <form
          action="create_template"
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className={`${showNameInput ? "block" : "hidden"} p-2`}>
            <input
              type="text"
              name="templateName"
              className="input input-bordered w-full bg-transparent"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          {!showNameInput && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full flex items-center h-24 flex-row gap-x-4 overflow-auto no-scrollbar px-3 py-1.5">
                <SortableContext
                  items={templateExercises.map((e) => e.exerciseId)}
                  strategy={horizontalListSortingStrategy}
                >
                  {templateExercises.map((exercise, index) => (
                    <TemplateCreationMobilePreview
                      key={exercise.exerciseId}
                      exerciseId={exercise.exerciseId}
                      notes={exercise.notes}
                      exerciseName={exercise.name}
                      exerciseOrder={index + 1}
                      onUpdateNotes={(notes) =>
                        onUpdateNotes(exercise.exerciseId, notes)
                      }
                      onRemoveExercise={onRemoveExercise}
                    />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          )}

          <div
            className={`${
              showNameInput ? "bottom-13" : "bottom-23"
            } flex items-center justify-center absolute left-0 transition-all duration-300`}
          >
            <button
              type="button"
              className="btn btn-error py-0.5 px-2 size-max"
              disabled={isLoading}
              onClick={toggleNameInput}
            >
              <NotebookPenIcon className="size-4 cursor-pointer" />
            </button>
          </div>
          <div
            className={`${
              showNameInput ? "bottom-13" : "bottom-23"
            } transition-all duration-300 flex items-center justify-center pt-2 absolute right-0`}
          >
            <button
              type="submit"
              className={`${
                !templateName ||
                templateExercises.length === 0 ||
                templateName.length < 5
                  ? "hidden"
                  : "block"
              } btn btn-error py-0.5 px-2 size-max`}
              disabled={isLoading || templateExercises.length === 0}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
          <div
            className={`-bottom-5 flex items-center justify-center absolute left-0 transition-all duration-300`}
          >
            <button
              type="button"
              className="btn btn-error py-0.5 px-2 size-max"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                setTemplateExercises([]);
              }}
            >
              <EraserIcon className="size-4 cursor-pointer" />
            </button>
          </div>
        </form>
      </div>
    );
  }
);

export default MobileTemplateForm;
