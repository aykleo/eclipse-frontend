import { useExerciseState } from "../../hooks/exercises/exercise-context";
import { ExerciseCodex } from "./exercise-codex/exercise-codex";

export const ExercisePage = () => {
  const { showExerciseInfo } = useExerciseState();

  return (
    <div className="size-full self-start">
      <div className={`${showExerciseInfo ? "hidden" : ""} relative`}>
        <ExerciseCodex />
        {/* <ExerciseStatistics /> */}
      </div>
    </div>
  );
};
