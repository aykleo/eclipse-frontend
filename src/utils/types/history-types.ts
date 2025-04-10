export type Set = {
  id: string;
  workoutExerciseId: string;
  weight: number;
  reps: number;
  rpe: number | null;
  notes: string | null;
  createdAt: string;
};

export type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: Set[];
  order: number;
  notes: string | null;
};

export type WorkoutHistory = {
  id: string;
  name: string;
  date: string;
  userId: string;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
};
