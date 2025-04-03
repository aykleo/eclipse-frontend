import { memo } from "react";
import { ExerciseCodex } from "./exercise-codex/exercise-codex";
import { useSearchParams } from "react-router-dom";
import { ExerciseInfo } from "../../../../components/exercise/exercise-info";
import { useExerciseState } from "../../../../hooks/exercises/exercise-context";

export const ExercisePage = memo(() => {
  const { showExerciseInfo } = useExerciseState();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="size-full self-start pt-16">
      <div className="relative ">
        <ExerciseCodex
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        {/* <ExerciseStatistics /> */}
      </div>
      {showExerciseInfo && <ExerciseInfo setSearchParams={setSearchParams} />}
    </div>
  );
});
