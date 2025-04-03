export type MuscleGroup = {
  id: string;
  name: MuscleGroupName;
};

export enum MuscleGroupName {
  ADDUCTORS = "ADDUCTORS",
  BICEPS = "BICEPS",
  CHEST = "CHEST",
  DELTOID = "DELTOID",
  ERECTOR_SPINAE = "ERECTOR_SPINAE",
  GASTROCNEMIUS = "GASTROCNEMIUS",
  GLUTEUS_MAXIMUS = "GLUTEUS_MAXIMUS",
  GLUTEUS_MEDIUS = "GLUTEUS_MEDIUS",
  HAMSTRINGS = "HAMSTRINGS",
  LATISSIMUS = "LATISSIMUS",
  QUADRICEPS = "QUADRICEPS",
  CORE = "CORE",
  TRAPEZIUS = "TRAPEZIUS",
  TRICEPS = "TRICEPS",
}

export type Tag = {
  id: string;
  name: string;
  category: TagCategory;
};

export enum TagCategory {
  ENDURANCE = "ENDURANCE",
  MOVEMENT = "MOVEMENT",
  PLYOMETRICS = "PLYOMETRICS",
  STRENGTH = "STRENGTH",
}

export type Exercise = {
  id: string;
  name: string;
  description?: string;
  tag: Tag;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  exerciseMuscleGroups: ExerciseMuscleGroup[];
  templateExercises: TemplateExercise[];
  workouts: WorkoutExercise[];
  deletedAt?: Date;
};

export type MuscleGroupData = {
  id: string;
  name: MuscleGroupName;
};

export type ExerciseMuscleGroup = {
  exerciseId: string;
  muscleGroupId: string;
  isPrimary: boolean;
  muscleGroup: MuscleGroup;
};

export interface TemplateExercise {
  exercise: Exercise;
  exerciseId: string;
  notes: string;
  order: number;
}

export type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: Set[];
  order: number;
  notes?: string;
};

export type Set = {
  id: string;
  workoutExerciseId: string;
  weight: number;
  reps: number;
  rpe?: number;
  notes?: string;
  createdAt: Date;
};
