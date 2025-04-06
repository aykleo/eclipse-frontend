import { TemplateExercise } from "../../../utils/types/exercise-types";
import { Template } from "../../../utils/types/template-types";

export type CategoryCounts = {
  "": number;
  ENDURANCE: number;
  MOVEMENT: number;
  PLYOMETRICS: number;
  STRENGTH: number;
};

const defaultCounts: CategoryCounts = {
  "": 0,
  ENDURANCE: 0,
  MOVEMENT: 0,
  PLYOMETRICS: 0,
  STRENGTH: 0,
};

export const calculateCategoryCounts = (workout: Template): CategoryCounts => {
  const counts = { ...defaultCounts };

  if (!workout.exercises) return counts;

  counts[""] = workout.exercises.length;

  workout.exercises.forEach((exerciseItem: TemplateExercise) => {
    if (
      exerciseItem.exercise &&
      exerciseItem.exercise.tag &&
      exerciseItem.exercise.tag.category
    ) {
      const category = exerciseItem.exercise.tag.category;
      if (category in counts) {
        counts[category as keyof CategoryCounts] += 1;
      }
    }
  });

  return counts;
};
