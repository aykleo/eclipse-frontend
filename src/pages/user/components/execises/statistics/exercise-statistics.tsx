import { useQuery } from "@tanstack/react-query";
import { ExerciseByTagBar } from "./exercise-by-tag-bars";
import { ExerciseByTagPie } from "./exercise-by-tag-pie";
import { handleExerciseByTag } from "../../../../../api/statistics/exercises/exercise-by-tag";
import { useUser } from "../../../../../hooks/user/use-context";
import { isExerciseByTagData } from "../../../../../utils/exercise-by-tag-data";
import ExerciseByMuscleGroup from "./exercise-by-muscle-group";

export const ExerciseStatistics = () => {
  const { user } = useUser() || {};

  const { data: exerciseByTagData, isLoading } = useQuery({
    queryKey: ["exerciseByTag"],
    queryFn: () => handleExerciseByTag(),
    enabled: !!user,
  });

  return (
    <div className="w-full h-fit mt-14 md:mt-8 flex flex-col overflow-y-auto no-scrollbar lg:flex-row gap-y-3">
      <div className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col gap-x-3 h-full">
        {exerciseByTagData && isExerciseByTagData(exerciseByTagData) && (
          <>
            <ExerciseByTagBar data={exerciseByTagData} isLoading={isLoading} />
            <ExerciseByTagPie data={exerciseByTagData} isLoading={isLoading} />
          </>
        )}
      </div>
      <div className="w-full lg:w-2/3 h-full">
        <ExerciseByMuscleGroup />
      </div>
    </div>
  );
};
