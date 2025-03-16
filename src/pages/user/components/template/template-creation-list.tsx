import React, { useState } from "react";
import { TemplateExerciseItem } from "./template-exercise-item";

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

export const TemplateCreationList: React.FC<TemplateCreationListProps> = ({
  exercises,
  onUpdateNotes,
  onRemoveExercise,
  setIsCreatingTemplate,
}) => {
  const [templateName, setTemplateName] = useState("New Template");

  return (
    <div className="w-1/4 h-full border hidden lg:block p-4">
      <div
        onClick={() => {
          setIsCreatingTemplate(false);
        }}
        className="absolute top-0 right-0"
      >
        fechar
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="input input-bordered input-sm"
          placeholder="Template Name"
        />

        <div className="flex flex-col gap-2 overflow-y-auto">
          {exercises &&
            exercises.length > 0 &&
            exercises.map((exercise) => (
              <TemplateExerciseItem
                key={exercise.exerciseId}
                exerciseId={exercise.exerciseId}
                notes={exercise.notes}
                exerciseName={exercise.name}
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
};
