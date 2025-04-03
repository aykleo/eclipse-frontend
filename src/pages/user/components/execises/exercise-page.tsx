import { memo, useState } from "react";
import { Exercise } from "../../../../utils/types/exercise-types";
import { ExerciseCodex } from "./exercise-codex/exercise-codex";
import { useSearchParams } from "react-router-dom";
import { ExerciseInfo } from "../../../../components/exercise/exercise-info";

export const ExercisePage = memo(() => {
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [exerciseForUpdate, setExerciseForUpdate] = useState<Exercise | null>(
    null
  );
  const [showExerciseInfo, setShowExerciseInfo] = useState<
    Exercise | undefined
  >(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  return (
    <div className="size-full self-start pt-16">
      <div className="relative ">
        <ExerciseCodex
          isCreatingExercise={isCreatingExercise}
          setIsCreatingExercise={setIsCreatingExercise}
          exerciseForUpdate={exerciseForUpdate}
          setExerciseForUpdate={setExerciseForUpdate}
          setShowExerciseInfo={setShowExerciseInfo}
          showExerciseInfo={showExerciseInfo}
          isCreatingTemplate={isCreatingTemplate}
          setIsCreatingTemplate={setIsCreatingTemplate}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        {/* <ExerciseStatistics /> */}
      </div>
      {showExerciseInfo && (
        <ExerciseInfo
          exercise={showExerciseInfo}
          setShowExerciseInfo={setShowExerciseInfo}
          showExerciseInfo={showExerciseInfo}
          exerciseForUpdate={exerciseForUpdate}
          setExerciseForUpdate={setExerciseForUpdate}
          setSearchParams={setSearchParams}
          isCreatingTemplate={isCreatingTemplate}
        />
      )}
    </div>
  );
});
