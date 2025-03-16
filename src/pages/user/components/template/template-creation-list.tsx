import React, { useRef, useState } from "react";
import { TemplateExerciseItem } from "./template-exercise-item";
import { ArrowRightIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { handleTemplateCreation } from "../../../../api/templates/template-creation";
import { TemplateFormData } from "../../../../api/templates/fetch-create-update-template";
import { useStatus } from "../../../../hooks/status/status-context";

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

export const TemplateCreationList = React.memo(
  ({
    exercises,
    onUpdateNotes,
    onRemoveExercise,
    setIsCreatingTemplate,
    setTemplateExercises,
  }: TemplateCreationListProps) => {
    const [templateName, setTemplateName] = useState("New Template");
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { setStatusText } = useStatus();

    const createTemplateMutation = useMutation({
      mutationFn: async (formData: TemplateFormData) => {
        return await handleTemplateCreation(
          formData,
          setIsLoading,
          setTemplateExercises
        );
      },
      onSuccess: () => {
        setTemplateName("New Template");
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
        name: templateName,
        exercises: exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          notes: exercise.notes || "",
        })),
      };

      await createTemplateMutation.mutateAsync(formData);
    };

    return (
      <div className="w-1/4 h-full relative border hidden lg:block p-4">
        <div
          onClick={() => {
            setIsCreatingTemplate(false);
          }}
          className="absolute top-4 rounded-full bg-neutral-950 p-1 -left-5"
        >
          <ArrowRightIcon className="size-6" />
        </div>
        <form action="create_template" onSubmit={handleSubmit} ref={formRef}>
          <div className="flex flex-col gap-y-2 justify-between h-full">
            <input
              type="text"
              name="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="input input-bordered input-sm"
              placeholder="Template Name"
            />

            <div className="flex flex-col gap-2 overflow-y-auto h-full no-scrollbar">
              {exercises &&
                exercises.length > 0 &&
                exercises.map((exercise, index) => (
                  <TemplateExerciseItem
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
            </div>

            <button
              className="btn btn-primary btn-sm mt-2"
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

TemplateCreationList.displayName = "TemplateCreationList";
