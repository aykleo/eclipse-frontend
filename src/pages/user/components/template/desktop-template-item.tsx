import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RenderSvg } from "../../../../components/pixel-art/render-svg";
import { TextArea } from "../../../../components/forms/text-area";

interface DesktopTemplateItemProps {
  exerciseId: string;
  notes: string;
  exerciseName: string;
  exerciseOrder: number;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemove: () => void;
}

export const DesktopTemplateItem: React.FC<DesktopTemplateItemProps> = ({
  exerciseId,
  notes,
  exerciseName,
  exerciseOrder,
  onUpdateNotes,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={`relative min-h-13 max-h-13 w-full group p-2 transition-opacity duration-200 ${
        isDragging ? "opacity-75" : ""
      } touch-none`}
    >
      <RenderSvg
        src="url(src/assets/pixel-art/desktop-template-creation/template-item-middle.svg)"
        size="auto"
        repeat="repeat-x"
        position="center"
        className="h-13 w-[calc(100%-72px)] absolute left-10 top-0"
      />
      <RenderSvg
        src="url(src/assets/pixel-art/desktop-template-creation/template-item-left.svg)"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-full w-[32px] absolute top-0 left-4"
      />
      <RenderSvg
        src="url(src/assets/pixel-art/desktop-template-creation/template-item-right.svg)"
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-full w-[32px] absolute top-0 right-0"
      />
      <div className="flex justify-between items-center absolute top-0 left-0 w-full h-full">
        <div
          {...attributes}
          {...listeners}
          className="size-[32px] cursor-grab absolute left-1/2 -translate-x-1/5 top-[-10px]"
        >
          <RenderSvg
            src="url(src/assets/pixel-art/icons/grab-icon-32.svg)"
            size="auto"
            repeat="no-repeat"
            position="center"
            className="size-full"
          />
        </div>

        <RenderSvg
          src="url(src/assets/pixel-art/icons/circular-icon-22.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-[22px] flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2"
        >
          {exerciseOrder}
        </RenderSvg>
        <span className="text-md font-medium w-[calc(100%-64px)] truncate pr-1 absolute left-8 top-1/2 -translate-y-1/2">
          {exerciseName}
        </span>

        <button
          onClick={onRemove}
          aria-label="Remove exercise"
          className="size-[22px] absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block cursor-pointer opacity-60 hover:opacity-100"
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
          onClick={() => setIsEditing(!isEditing)}
          className={`${
            !notes ? "opacity-35" : "opacity-100"
          } size-[22px] absolute right-9 top-1/2 -translate-y-1/2 hidden group-hover:block cursor-pointer hover:opacity-100`}
        >
          <RenderSvg
            src="url(src/assets/pixel-art/icons/circular-notes-icon-22.svg)"
            size="auto"
            repeat="no-repeat"
            position="center"
            className="size-full"
          />
        </button>
      </div>
      {isEditing && (
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
    </div>
  );
};
