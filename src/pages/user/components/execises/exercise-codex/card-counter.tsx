import { DumbbellIcon } from "lucide-react";
import { TemplateExercise } from "../../../../../utils/types/exercise-types";

interface CardCounterProps {
  isCreatingTemplate: boolean;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
  templateExercises: TemplateExercise[];
}

export const CardCounter = ({
  isCreatingTemplate,
  setIsCreatingTemplate,
  templateExercises,
}: CardCounterProps) => {
  return (
    <button
      onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
      className={`${
        isCreatingTemplate ? "h-20 w-14" : " h-16 w-10"
      } cursor-pointer flex items-center flex-col relative gap-x-1 border-error bg-gradient-to-br from-neutral-900 to-neutral-950 border rounded-sm`}
    >
      <div
        className={`${
          isCreatingTemplate ? "-top-4 right-2.5 p-2" : "-top-2 right-2 p-1"
        } rounded-full bg-neutral-900 border-error  absolute border`}
      >
        <DumbbellIcon
          className={`${isCreatingTemplate ? "size-4" : "size-3"} text-error`}
        />
      </div>

      <div
        className={`${
          isCreatingTemplate ? "mt-8 w-16 h-6" : "mt-6 w-12 h-5"
        } text-sm font-medium  border-error bg-neutral-950 border items-center justify-center flex`}
      >
        {templateExercises.length > 0
          ? templateExercises.length
          : isCreatingTemplate
          ? "0"
          : "+"}
      </div>
    </button>
  );
};
