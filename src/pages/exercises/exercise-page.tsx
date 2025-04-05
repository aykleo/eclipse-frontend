import { ExerciseCodex } from "./exercise-codex/exercise-codex";

export const ExercisePage = () => {
  return (
    <div className="size-full self-start">
      <div className="relative ">
        <ExerciseCodex />
        {/* <ExerciseStatistics /> */}
      </div>
    </div>
  );
};
