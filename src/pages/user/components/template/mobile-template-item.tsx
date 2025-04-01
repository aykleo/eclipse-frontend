import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RenderPng } from "../../../../components/pixel-art/render-png";
import { TextArea } from "../../../../components/forms/text-area";
import { RenderSvg } from "../../../../components/pixel-art/render-svg";

interface MobileTemplateItemProps {
  exerciseId: string;
  notes: string;
  exerciseName: string;
  exerciseOrder: number;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  showExerciseInfoById: (exerciseId: string) => void;
}

export const MobileTemplateItem = React.memo(
  ({
    exerciseId,
    notes,
    exerciseName,
    exerciseOrder,
    onUpdateNotes,
    onRemoveExercise,
    showExerciseInfoById,
  }: MobileTemplateItemProps) => {
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
      <RenderPng
        style={style}
        ref={setRefs}
        src="/src/assets/pixel-art/exercise-cards/card-preview-mobile.png"
        alt="Template creation mobile preview"
        className={`flex h-[80px] min-w-[104px] max-w-[104px] text-xs ${
          isDragging ? "opacity-50 z-50" : ""
        } touch-none relative`}
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
              <TextArea
                value={notes}
                onChange={(e) => onUpdateNotes(e.target.value, exerciseId)}
                className=""
                placeholder="Add notes..."
              />
            </div>
          </div>
        )}

        <>
          <span className="text-xs size-4 flex items-center justify-center absolute right-1 top-[2px] rounded-full p-0.5">
            {exerciseOrder}
          </span>

          <div className="truncate absolute top-[9px] left-[16px] w-[74px] h-4 text-center">
            {exerciseName}
          </div>

          <span
            className={`h-[14px] w-[80px] absolute top-8 right-3 text-xs px-1 text-center ${
              notes ? "text-warning" : "text-gray-500"
            }`}
          >
            {notes ? "Has notes" : "No notes"}
          </span>

          <div
            {...attributes}
            {...listeners}
            className="absolute left-[-10px] top-[4px] size-10 text-xs px-1 text-center cursor-grab active:cursor-grabbing transition-colors"
          >
            <RenderSvg
              src="url(src/assets/pixel-art/icons/grab-icon-32.svg)"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-full"
              transform="rotate(90deg)"
            />
          </div>
          <button
            type="button"
            onClick={() => showExerciseInfoById(exerciseId)}
            className="size-[22px] absolute left-1/2 -translate-x-1/2 bottom-0 cursor-pointer transition-all filter brightness-100 duration-200 hover:filter hover:brightness-110"
          >
            <RenderSvg
              src="url(src/assets/pixel-art/icons/circular-info-icon-22.svg)"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-full"
            />
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute bottom-0 right-0 cursor-pointer size-[22px] transition-all filter brightness-75 duration-200 hover:filter hover:brightness-110"
          >
            <RenderSvg
              src="url(src/assets/pixel-art/icons/circular-cancel-icon-22.svg)"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-full"
            />
          </button>
          <button
            type="button"
            onClick={handleNotesToggle}
            className={`absolute bottom-[0px] left-[0px] cursor-pointer size-[22px] transition-all filter ${
              !notes
                ? "brightness-50 hover:brightness-110 hover:opacity-75"
                : "brightness-100 hover:brightness-125"
            }`}
          >
            <RenderSvg
              src="url(src/assets/pixel-art/icons/circular-notes-icon-22.svg)"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-full"
            />
          </button>
        </>
      </RenderPng>
    );
  }
);

MobileTemplateItem.displayName = "MobileTemplateItem";
