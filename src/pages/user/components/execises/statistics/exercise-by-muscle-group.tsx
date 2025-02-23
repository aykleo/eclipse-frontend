import { useQuery } from "@tanstack/react-query";

import { handleExerciseByMuscleGroup } from "../../../../../api/statistics/exercises/exercise-by-msucle-group";

export const ExerciseByMuscleGroup = () => {
  const {
    data: exerciseByMuscleGroupData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["exerciseByMuscleGroup"],
    queryFn: () => handleExerciseByMuscleGroup(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-wrap gap-x-4 overflow-y-auto no-scrollbar bg-stone-900 rounded-lg justify-between h-full w-full p-2">
      {exerciseByMuscleGroupData ? (
        Object.entries(
          exerciseByMuscleGroupData.exerciseCountsByMuscleGroup
        ).map(([muscleGroup, byMuscleGroup]) => {
          const { count, percentage } = byMuscleGroup as {
            count: number;
            percentage: number;
          };
          return (
            <div
              key={muscleGroup}
              className={`h-max flex flex-col md:flex-row bg-stone-950/75 items-center w-1/5 gap-x-1 rounded-lg p-2`}
            >
              <img
                src={`src/assets/icons/muscle-group/${muscleGroup}.png`}
                alt={`${muscleGroup} icon`}
                className={`icon-class size-10 md:size-16`}
              />
              <div className="w-1/2">
                <span className="flex text-xs lg:text-sm flex-col gap-x-1  items-center w-full">
                  <div className="w-full text-center">{count}</div>
                  <div>{`(${percentage.toFixed(1)})`}%</div>
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div>No exercise data available</div>
      )}
    </div>
  );
};
