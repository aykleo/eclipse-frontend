import { lazy, Suspense, useState } from "react";
import { Exercise } from "../../../../utils/types/exercise-types";
import { ListAllExercises } from "./list-of-exercises/list-all-exercises";
import { ExerciseByTag } from "./statistics/exercise-by-tag";
import { SpinSlowStyle } from "../../../../components/styles/spin-slow-style";
import { ExerciseByMuscleGroup } from "./statistics/exercise-by-muscle-group";

const CreateOrUpdateExercises = lazy(() => import("./create-update-exercises"));

export const ExercisePage = () => {
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [exerciseForUpdate, setExerciseForUpdate] = useState<Exercise | null>(
    null
  );

  return (
    <div className="grid lg:grid-cols-5 grid-cols-1 size-full z-1 p-4 gap-x-3 pb-4">
      <div className="mt-16 h-144 col-start-1 size-screen lg:col-span-2 flex flex-col relative p-[2px] rounded-lg overflow-hidden">
        <div
          style={{
            background:
              "conic-gradient(rgba(253, 51, 51, 0.8) 0deg, rgba(255, 102, 102, 0.8) 100deg, transparent 150deg)",
          }}
          className="absolute -z-1 top-1/2 left-1/2 w-full h-full animate-spin-slow"
        />
        <div className="h-full w-full flex flex-col rounded-lg bg-stone-950">
          <ListAllExercises
            isCreatingExercise={isCreatingExercise}
            setIsCreatingExercise={setIsCreatingExercise}
            exerciseForUpdate={exerciseForUpdate}
            setExerciseForUpdate={setExerciseForUpdate}
          />
        </div>
      </div>
      <div className="mt-16 h-144 lg:col-start-3 lg:col-span-3 p-1 size-screen flex flex-col items-center justify-center bg-stone-950 rounded-lg">
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
                <>
                  <div className="w-full h-max">
                    <ExerciseByTag />
                  </div>
                  <div className="w-full h-full p-1">
                    <ExerciseByMuscleGroup />
                  </div>
                </>
              )}
            </>
          )}
        </Suspense>
      </div>
      <SpinSlowStyle />
    </div>
  );
};
