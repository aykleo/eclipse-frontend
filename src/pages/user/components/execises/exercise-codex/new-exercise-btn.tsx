import { CircleFadingPlusIcon } from "lucide-react";
import { Exercise } from "../../../../../utils/types/exercise-types";

interface NewExerciseBtnProps {
  exerciseForUpdate: Exercise | null;
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
  isCreatingExercise: boolean;
  setExerciseForUpdate: (exerciseForUpdate: Exercise | null) => void;
}

export const NewExerciseBtn = ({
  exerciseForUpdate,
  setIsCreatingExercise,
  isCreatingExercise,
  setExerciseForUpdate,
}: NewExerciseBtnProps) => {
  return (
    <div
      onClick={() => {
        if (exerciseForUpdate) {
          setIsCreatingExercise(true);
        } else {
          setIsCreatingExercise(!isCreatingExercise);
        }
        setExerciseForUpdate(null);
      }}
      className={`${
        exerciseForUpdate ? "opacity-20" : "opacity-50 hover:opacity-100"
      } w-48 relative h-72 gap-y-2 px-1 cursor-pointer flex-grow-0 flex-shrink-0 rounded-md bg-gradient-to-b from-neutral-900 to-black border-neutral-600 border`}
    >
      <div
        style={{
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
        className={`bg-neutral-700 icon-class size-7 rounded-lg p-1 absolute -top-3.5 -right-3`}
      />
      <span className="truncate w-full h-8 flex items-center">
        New exercise
      </span>
      <a
        className={`flex items-center opacity-60 justify-center text-gray-400 py-5`}
      >
        <CircleFadingPlusIcon className="size-22" />
      </a>
      <div className="w-full flex flex-col gap-y-1">
        <span className={`w-full px-1 text-white`}>
          <div
            className="w-full truncate bg-neutral-500/50 text-center px-3"
            style={{
              clipPath:
                "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
            }}
          >
            Create
          </div>
        </span>
        <div className="w-full h-max text-xs">
          Activate to create a new exercise
        </div>
      </div>
    </div>
  );
};
