import { useRef, useState } from "react";
import { TemplateExercise } from "../../../../../utils/types/exercise-types";
import { useMutation } from "@tanstack/react-query";
import { TemplateFormData } from "../../../../../api/templates/fetch-create-update-template";
import { handleTemplateCreation } from "../../../../../api/templates/template-creation";
import React from "react";
import { useStatus } from "../../../../../hooks/status/status-context";
import { MobileTemplateItem } from "../../template/mobile-template-item";
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
import { RenderSvg } from "../../../../../components/pixel-art/render-svg";
import { Input } from "../../../../../components/forms/input";

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
      <RenderSvg
        src="url(src/assets/pixel-art/body/body-96.svg)"
        size="auto"
        repeat="repeat"
        position="center"
        className="relative w-9/10 p-1 h-24"
      >
        <RenderSvg
          src="url(src/assets/pixel-art/body/body-side-96.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="absolute top-0 h-full -left-1.5 w-2"
        />
        <RenderSvg
          src="url(src/assets/pixel-art/body/body-side-96.svg)"
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
              name="templateName"
              className=""
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
                    />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          )}

          <RenderSvg
            src="url(src/assets/pixel-art/body/body-64.svg)"
            size="48px"
            repeat="repeat"
            position="center"
            className="w-max px-4 left-1/2 translate-x-[-50%] h-12 absolute bottom-24 flex flex-row gap-x-2 items-center justify-evenly"
          >
            <RenderSvg
              src="url(src/assets/pixel-art/body/body-side-64.svg)"
              size="15px"
              repeat="no-repeat"
              position="center"
              role="tablist"
              className="absolute h-full w-12 -left-5"
            />
            <RenderSvg
              src="url(src/assets/pixel-art/body/body-side-64.svg)"
              size="15px"
              repeat="no-repeat"
              position="center"
              role="tablist"
              className="absolute h-full w-12 -right-5"
              transform="rotate(180deg)"
            />

            <button
              type="button"
              className=""
              disabled={isLoading}
              onClick={toggleNameInput}
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-pen-32.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className={`${
                  templateName.length < 5 && "animate-pulse"
                } size-8 cursor-pointer`}
              />
            </button>

            <button
              type="submit"
              className={`${
                !templateName ||
                templateExercises.length === 0 ||
                templateName.length < 5
                  ? "opacity-40"
                  : "opacity-100"
              }`}
              disabled={
                isLoading ||
                templateExercises.length === 0 ||
                templateName.length < 5
              }
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-submit.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className={`${
                  templateName.length > 5 && templateExercises.length > 0
                    ? "animate-pulse"
                    : ""
                } h-8 w-24 cursor-pointer pt-[2px]`}
              >
                {isLoading ? "Creating..." : "Create"}
              </RenderSvg>
            </button>

            <button
              type="button"
              className={`${
                isLoading || templateExercises.length === 0
                  ? "opacity-40"
                  : "opacity-100"
              } `}
              disabled={isLoading || templateExercises.length === 0}
              onClick={(e) => {
                e.preventDefault();
                setTemplateExercises([]);
                setTemplateName("");
              }}
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-eraser-32.svg)"
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
