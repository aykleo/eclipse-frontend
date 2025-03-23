import { useState } from "react";
import { Exercise } from "../../../../utils/types/exercise-types";
import { ExerciseCodex } from "./exercise-codex/exercise-codex";
import { ExerciseStatistics } from "./statistics/exercise-statistics";

export const ExercisePage = () => {
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [exerciseForUpdate, setExerciseForUpdate] = useState<Exercise | null>(
    null
  );

  return (
    <div className="size-full self-start">
      <div className="h-full size-screen relative pt-16">
        <ExerciseCodex
          isCreatingExercise={isCreatingExercise}
          setIsCreatingExercise={setIsCreatingExercise}
          exerciseForUpdate={exerciseForUpdate}
          setExerciseForUpdate={setExerciseForUpdate}
        />
        <ExerciseStatistics />
      </div>
    </div>
  );
};
