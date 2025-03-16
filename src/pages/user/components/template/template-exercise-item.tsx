import { useState } from "react";

interface TemplateExerciseItemProps {
  exerciseId: string;
  notes: string;
  exerciseName: string;
  exerciseOrder: number;
  onUpdateNotes: (notes: string) => void;
  onRemove: () => void;
}

export const TemplateExerciseItem: React.FC<TemplateExerciseItemProps> = ({
  exerciseId,
  notes,
  exerciseName,
  exerciseOrder,
  onUpdateNotes,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="card bg-gradient-to-r from-neutral-900 to-red-950/50 p-2">
      <div
        onClick={() => setIsEditing(!isEditing)}
        className="flex justify-between items-center cursor-pointer"
      >
        <div className="flex items-center justify-center gap-2 w-full">
          <div className="text-sm font-medium w-4 text-center">
            {exerciseOrder}
          </div>
          <span className="text-sm font-medium w-full truncate pr-1">
            {exerciseName}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="btn btn-ghost btn-xs"
          aria-label="Remove exercise"
        >
          ×
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          className="textarea textarea-bordered bg-transparent max-h-20 textarea-xs mt-2 w-full"
          placeholder="Add notes..."
          rows={2}
        />
      ) : (
        <div>{notes}</div>
      )}
    </div>
  );
};
