import { createContext, useContext } from "react";
import { Exercise } from "../../utils/types/exercise-types";

export interface ExerciseContextType {
  isCreatingExercise: boolean;
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
  exerciseForUpdate: Exercise | null;
  setExerciseForUpdate: (exercise: Exercise | null) => void;
  showExerciseInfo: Exercise | undefined;
  setShowExerciseInfo: (exercise: Exercise | undefined) => void;
  isCreatingTemplate: boolean;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
}

export const ExerciseContext = createContext<ExerciseContextType | undefined>(
  undefined
);

export const useExerciseState = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error(
      "useExerciseContext must be used within an ExerciseProvider"
    );
  }
  return context;
};
