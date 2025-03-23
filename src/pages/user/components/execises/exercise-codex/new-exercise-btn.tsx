import { Exercise } from "../../../../../utils/types/exercise-types";
import React, { useEffect, useRef } from "react";
import { RenderPixelArt } from "../../../../../components/pixel-art/render-pixel-art";

interface NewExerciseBtnProps {
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
  isCreatingExercise: boolean;
  setExerciseForUpdate: (exerciseForUpdate: Exercise | null) => void;
}

export const NewExerciseBtn = React.memo(
  ({ setIsCreatingExercise, setExerciseForUpdate }: NewExerciseBtnProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [containerRef]);

    return (
      <RenderPixelArt
        ref={containerRef}
        onClick={() => {
          setIsCreatingExercise(true);
          setExerciseForUpdate(null);
        }}
        src={"url(src/assets/pixel-art/exercise-cards/new-exercise-card.svg)"}
        size="auto"
        repeat="no-repeat"
        position="center"
        className={`w-[192px] h-[256px] relative cursor-pointer flex items-center justify-center flex-grow-0 flex-shrink-0 font-bold opacity-50 hover:opacity-100`}
      >
        <span className="w-[170px] h-[32px] justify-center px-2.5 absolute top-31.5">
          <div className="size-full pt-1.5 truncate text-center">
            New exercise
          </div>
        </span>

        <div className="h-[72px] text-xs p-1 absolute w-[156px] bottom-4 overflow-y-auto no-scrollbar">
          Activate to create a new exercise
        </div>
      </RenderPixelArt>
    );
  }
);
