import React, { useRef, useState } from "react";
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
import { DesktopTemplateItem } from "../../template/desktop-template-item";
import { ArrowRightIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { handleTemplateCreation } from "../../../../../api/templates/template-creation";
import { TemplateFormData } from "../../../../../api/templates/fetch-create-update-template";
import { useStatus } from "../../../../../hooks/status/status-context";

interface TemplateExercise {
  exerciseId: string;
  notes: string;
  name: string;
}

interface TemplateCreationListProps {
  exercises: TemplateExercise[];
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
  setTemplateExercises: React.Dispatch<
    React.SetStateAction<TemplateExercise[]>
  >;
}

const TemplateCreationList = React.memo(
  ({
    exercises,
    onUpdateNotes,
    onRemoveExercise,
    setIsCreatingTemplate,
    setTemplateExercises,
  }: TemplateCreationListProps) => {
    const templateNameRef = useRef<string>("");
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
        templateNameRef.current = "";
        setTemplateExercises([]);
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
        name: templateNameRef.current,
        exercises: exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          notes: exercise.notes || "",
        })),
      };

      await createTemplateMutation.mutateAsync(formData);
    };

    return (
      <div className="w-full h-full">
        <div
          onClick={(e) => {
            e.preventDefault();
            setIsCreatingTemplate(false);
          }}
          className="absolute rounded-l-md h-10 flex items-center justify-center bg-neutral-950 p-1 -left-6 top-0 cursor-pointer"
        >
          <ArrowRightIcon className="size-5" />
        </div>
        <form
          action="create_template"
          onSubmit={handleSubmit}
          ref={formRef}
          className="h-full w-full"
        >
          <div className="flex flex-col gap-y-2 justify-between h-full w-full">
            <input
              type="text"
              name="templateName"
              onChange={(e) => (templateNameRef.current = e.target.value)}
              className="input input-bordered input-sm bg-transparent w-full"
              placeholder="Template name"
            />

            <div className="flex flex-col gap-2 overflow-y-auto h-full no-scrollbar">
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
                        onRemove={() => onRemoveExercise(exercise.exerciseId)}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </div>

            <button
              className="btn btn-error btn-sm mt-2"
              disabled={(exercises && exercises.length === 0) || isLoading}
            >
              {isLoading ? "Creating..." : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

export default TemplateCreationList;
