import React, { useState, ReactNode } from "react";
import { ExerciseContextType, ExerciseContext } from "./exercise-context";
import { Exercise } from "../../utils/types/exercise-types";

interface ExerciseProviderProps {
  children: ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({
  children,
}) => {
  const [isCreatingExercise, setIsCreatingExercise] = useState<boolean>(false);
  const [exerciseForUpdate, setExerciseForUpdate] = useState<Exercise | null>(
    null
  );
  const [showExerciseInfo, setShowExerciseInfo] = useState<
    Exercise | undefined
  >(undefined);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);

  const value: ExerciseContextType = {
    isCreatingExercise,
    setIsCreatingExercise,
    exerciseForUpdate,
    setExerciseForUpdate,
    showExerciseInfo,
    setShowExerciseInfo,
    isCreatingTemplate,
    setIsCreatingTemplate,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
