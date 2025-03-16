import { NotebookPenIcon, TrashIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

    useEffect(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [ref]);

    return (
      <div
        ref={ref}
        className="tooltip tooltip-top cursor-help flex flex-col relative gap-2 h-20 w-16 max-w-16 bg-gradient-to-t from-red-950 to-neutral-950 text-xs rounded-sm"
        data-tip={exerciseName}
      >
        {showNotes && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-4 rounded-lg w-72 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{exerciseName} notes</h3>
                <button
                  onClick={() => setShowNotes(false)}
                  className="text-neutral-400 hover:text-white text-xl cursor-pointer"
                >
                  ×
                </button>
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
          <span className="truncate pl-1 pr-2">{exerciseName}</span>
          <span className="text-xs size-4 flex items-center justify-center absolute -right-1 -top-1 rounded-full bg-red-950 p-0.5">
            {exerciseOrder}
          </span>
          <div className="flex flex-row gap-1 items-end justify-between px-1.5 w-full h-full pb-1">
            <button onClick={() => onRemoveExercise(exerciseId)}>
              <TrashIcon className="size-4 cursor-pointer" />
            </button>
            <p onClick={() => setShowNotes(!showNotes)}>
              <NotebookPenIcon className="size-4 cursor-pointer" />
            </p>
          </div>
        </>
      </div>
    );
  }
);

TemplateCreationMobilePreview.displayName = "TemplateCreationMobilePreview";
