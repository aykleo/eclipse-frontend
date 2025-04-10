import { RenderPng } from "../../../components/pixel-art/render-png";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import React, { useRef } from "react";

export const NewExerciseBtn = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setIsCreatingExercise, setExerciseForUpdate } = useExerciseState();

  return (
    <RenderPng
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onClick={() => {
        setIsCreatingExercise(true);
        setExerciseForUpdate(null);
      }}
      className={`w-[192px] h-[256px] relative cursor-pointer flex items-center justify-center flex-grow-0 flex-shrink-0 font-bold opacity-50 hover:opacity-100`}
      src="cards/new-exercise-card.png"
      alt="new-exercise-card"
      imgClassName="absolute top-0 left-0 w-full h-full"
    >
      <span className="w-[154px] h-[29px] justify-center px-2 absolute top-31">
        <div className="size-full truncate text-center">New exercise</div>
      </span>

      <div className="h-[84px] text-xxs p-1.5 absolute w-[144px] break-words bottom-2.5 overflow-y-auto no-scrollbar">
        Activate to create a new exercise
      </div>
    </RenderPng>
  );
});
