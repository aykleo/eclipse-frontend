import { useState } from "react";
import { Exercise } from "../../../../utils/types/exercise-types";
import { ExerciseCodex } from "./exercise-codex/exercise-codex";

export const ExercisePage = () => {
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [exerciseForUpdate, setExerciseForUpdate] = useState<Exercise | null>(
    null
  );

  return (
    <div className="size-full h-screen pb-4 px-3 self-start py-4">
      <div className="mt-16 h-[calc(100vh-7rem)] size-screen relative rounded-lg">
        <div className="h-full w-full flex flex-col rounded-lg bg-gradient-to-r from-neutral-950 via-neutral-800 to-zinc-950">
          <ExerciseCodex
            isCreatingExercise={isCreatingExercise}
            setIsCreatingExercise={setIsCreatingExercise}
            exerciseForUpdate={exerciseForUpdate}
            setExerciseForUpdate={setExerciseForUpdate}
          />
        </div>
      </div>
    </div>
  );
};
