import { ExerciseCodex } from "./exercise-codex/exercise-codex";

export const ExercisePage = () => {
  return (
    <div className="size-full self-start pt-16">
      <div className="relative ">
        <ExerciseCodex />
        {/* <ExerciseStatistics /> */}
      </div>
    </div>
  );
};
