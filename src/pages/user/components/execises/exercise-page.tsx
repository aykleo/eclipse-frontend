import { lazy, Suspense, useState } from "react";
import { Exercise } from "../../../../utils/types/exercise-types";
import { ListAllExercises } from "./list-of-exercises/list-all-exercises";
import { ExerciseByTagBar } from "./statistics/exercise-by-tag-bars";
import { SpinSlowStyle } from "../../../../components/styles/spin-slow-style";

import { handleExerciseByTag } from "../../../../api/statistics/exercises/exercise-by-tag";
import { useQuery } from "@tanstack/react-query";
import { ExerciseByTagPie } from "./statistics/exercise-by-tag-pie";
import ExerciseByMuscleGroup from "./statistics/exercise-by-muscle-group";
import { ExerciseCodex } from "./list-of-exercises/exercise-codex";

const CreateOrUpdateExercises = lazy(() => import("./create-update-exercises"));

export type ExerciseByTagData = {
  exerciseCountsByCategory: Record<
    string,
    { count: number; percentage: number }
  >;
  numberOfExercises: number;
};

type ApiResponse = ExerciseByTagData | { error: string };

function isExerciseByTagData(data: ApiResponse): data is ExerciseByTagData {
  return (
    data &&
    "numberOfExercises" in data &&
    "exerciseCountsByCategory" in data &&
    typeof data.numberOfExercises === "number" &&
    typeof data.exerciseCountsByCategory === "object"
  );
}

export const ExercisePage = () => {
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [exerciseForUpdate, setExerciseForUpdate] = useState<Exercise | null>(
    null
  );

  const { data, isLoading } = useQuery({
    queryKey: ["exerciseByTag"],
    queryFn: () => handleExerciseByTag(),
  });

  return (
    // <div className="grid lg:grid-cols-5 grid-cols-1 size-full z-1 p-4 gap-x-3 pb-4">
    <div className="size-full pb-4 px-3">
      <div className="mt-16 h-144 col-start-1 size-screen lg:col-span-3 flex flex-col relative p-[2px] rounded-lg overflow-hidden">
        <div
          style={{
            background:
              "conic-gradient(rgba(253, 51, 51, 0.8) 0deg, rgba(255, 102, 102, 0.8) 100deg, transparent 150deg)",
          }}
          className="absolute -z-1 top-1/2 left-1/2 w-full h-full animate-spin-slow"
        />
        <div className="h-full w-full flex flex-col rounded-lg bg-gradient-to-r from-black to-zinc-950">
          {/* <ListAllExercises
            isCreatingExercise={isCreatingExercise}
            setIsCreatingExercise={setIsCreatingExercise}
            exerciseForUpdate={exerciseForUpdate}
            setExerciseForUpdate={setExerciseForUpdate}
          /> */}
          <ExerciseCodex
            isCreatingExercise={isCreatingExercise}
            setIsCreatingExercise={setIsCreatingExercise}
            exerciseForUpdate={exerciseForUpdate}
            setExerciseForUpdate={setExerciseForUpdate}
          />
        </div>
      </div>
      {/* <div className="mt-16 h-144 lg:col-start-4 lg:col-span-2 p-1 size-screen flex flex-col items-center justify-center rounded-lg">
        <Suspense
          fallback={
            <div>
              <span className="loading loading-dots loading-xl"></span>
            </div>
          }
        >
          {isCreatingExercise && !exerciseForUpdate ? (
            <CreateOrUpdateExercises
              setIsCreatingExercise={setIsCreatingExercise}
            />
          ) : (
            <>
              {exerciseForUpdate ? (
                <>
                  <CreateOrUpdateExercises
                    exerciseForUpdate={exerciseForUpdate}
                    setExerciseForUpdate={setExerciseForUpdate}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col gap-y-3">
                  <div className="w-full flex flex-row gap-x-3 h-max">
                    {data && isExerciseByTagData(data) && (
                      <>
                        <ExerciseByTagBar data={data} isLoading={isLoading} />
                        <ExerciseByTagPie data={data} isLoading={isLoading} />
                      </>
                    )}
                  </div>
                  <div className="w-full h-full">
                    <ExerciseByMuscleGroup />
                  </div>
                </div>
              )}
            </>
          )}
        </Suspense>
      </div> */}
      <SpinSlowStyle />
    </div>
  );
};
