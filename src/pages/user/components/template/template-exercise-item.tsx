interface TemplateExerciseItemProps {
  exerciseId: string;
  notes: string;
  exerciseName: string;
  onUpdateNotes: (notes: string) => void;
  onRemove: () => void;
}

export const TemplateExerciseItem: React.FC<TemplateExerciseItemProps> = ({
  exerciseId,
  notes,
  exerciseName,
  onUpdateNotes,
  onRemove,
}) => {
  return (
    <div className="card bg-base-200 p-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{exerciseName}</span>
        <button
          onClick={onRemove}
          className="btn btn-ghost btn-xs"
          aria-label="Remove exercise"
        >
          ×
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => onUpdateNotes(e.target.value)}
        className="textarea textarea-bordered textarea-xs mt-2 w-full"
        placeholder="Add notes..."
        rows={2}
      />
    </div>
  );
};
