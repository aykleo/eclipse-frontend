import { NotebookPenIcon, TrashIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TemplateCreationMobilePreviewProps {
  exerciseId: string;
  notes: string;
  exerciseName: string;
  exerciseOrder: number;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

export const TemplateCreationMobilePreview = React.memo(
  ({
    exerciseId,
    notes,
    exerciseName,
    exerciseOrder,
    onUpdateNotes,
    onRemoveExercise,
  }: TemplateCreationMobilePreviewProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [showNotes, setShowNotes] = useState(false);
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

    const handleNotesToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowNotes((prev) => !prev);
    };

    const handleClose = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowNotes(false);
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onRemoveExercise(exerciseId);
    };

    return (
      <div
        ref={setRefs}
        style={style}
        className={`flex flex-col relative gap-2 h-19 min-w-26 max-w-26 bg-gradient-to-t from-neutral-950 to-neutral-950 text-xs rounded-sm hover:bg-neutral-800/50 transition-colors ${
          isDragging ? "opacity-50 z-50" : ""
        } touch-none`}
      >
        {showNotes && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-4 rounded-lg w-72 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{exerciseName} notes</h3>
                <div
                  onClick={handleClose}
                  className="text-white hover:text-white text-xl cursor-pointer"
                >
                  ×
                </div>
              </div>
              <textarea
                value={notes}
                onChange={(e) => onUpdateNotes(e.target.value, exerciseId)}
                className="textarea textarea-bordered bg-transparent w-full"
                placeholder="Add notes..."
              />
            </div>
          </div>
        )}

        <>
          <span className="text-xs size-4 flex items-center justify-center absolute -right-1 -top-1 rounded-full bg-red-950 p-0.5">
            {exerciseOrder}
          </span>
          <div className="flex flex-col gap-y-0.5 justify-between h-full">
            <div className="truncate pl-1 pr-3.5 text-error">
              {exerciseName}
            </div>
            {notes && (
              <span
                {...attributes}
                {...listeners}
                className="h-11 text-xs px-1 text-error w-full text-center cursor-grab active:cursor-grabbing transition-colors"
              >
                Has notes
              </span>
            )}
            <div className="flex flex-row gap-1 items-end justify-between px-1.5 w-full pb-1">
              <div onClick={handleRemove}>
                <TrashIcon className="size-4 cursor-pointer text-red-500" />
              </div>
              <p onClick={handleNotesToggle}>
                <NotebookPenIcon className="size-4 cursor-pointer text-warning" />
              </p>
            </div>
          </div>
        </>
      </div>
    );
  }
);

TemplateCreationMobilePreview.displayName = "TemplateCreationMobilePreview";
