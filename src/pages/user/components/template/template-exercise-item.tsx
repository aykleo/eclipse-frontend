import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

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
  const ref = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exerciseId,
  });

  const setRefs = (element: HTMLDivElement | null) => {
    setNodeRef(element);
    ref.current = element;
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (ref.current && isFirstMount.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      isFirstMount.current = false;
    }
  }, []);

  return (
    <div
      ref={setRefs}
      style={style}
      className={`card bg-gradient-to-r from-neutral-900 to-red-950/50 p-2 transition-opacity duration-200 ${
        isDragging ? "opacity-75" : ""
      } touch-none`}
    >
      <div className="flex justify-between items-center">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 hover:text-red-500 transition-colors"
        >
          <GripVertical className="size-4" />
        </div>
        <div
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center justify-center gap-2 w-full cursor-pointer"
        >
          <div className="text-sm font-medium w-4 text-center text-error">
            {exerciseOrder}
          </div>
          <span className="text-sm font-medium w-full truncate pr-1">
            {exerciseName}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-white px-1 cursor-pointer hover:text-red-500 transition-colors"
          aria-label="Remove exercise"
        >
          ×
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          className="textarea textarea-bordered bg-transparent max-h-36 textarea-xs mt-2 w-full"
          placeholder="Add notes..."
          rows={2}
        />
      ) : (
        <div className="text-xs pr-2 truncate text-neutral-400">{notes}</div>
      )}
    </div>
  );
};
