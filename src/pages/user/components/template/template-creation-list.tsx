import React, { useState } from "react";
import { TemplateExerciseItem } from "./template-exercise-item";
import { ArrowRightIcon } from "lucide-react";

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
}

export const TemplateCreationList = React.memo(
  ({
    exercises,
    onUpdateNotes,
    onRemoveExercise,
    setIsCreatingTemplate,
  }: TemplateCreationListProps) => {
    const [templateName, setTemplateName] = useState("New Template");

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
        <div className="flex flex-col gap-y-2 justify-between h-full">
          <input
            type="text"
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
            disabled={exercises && exercises.length === 0}
          >
            Create Template
          </button>
        </div>
      </div>
    );
  }
);

TemplateCreationList.displayName = "TemplateCreationList";
