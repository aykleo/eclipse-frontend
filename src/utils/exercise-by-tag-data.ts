export type ExerciseByTagData = {
  exerciseCountsByCategory: Record<
    string,
    { count: number; percentage: number }
  >;
  numberOfExercises: number;
};

export type ApiResponse = ExerciseByTagData | { error: string };

export function isExerciseByTagData(
  data: ApiResponse
): data is ExerciseByTagData {
  return (
    data &&
    "numberOfExercises" in data &&
    "exerciseCountsByCategory" in data &&
    typeof data.numberOfExercises === "number" &&
    typeof data.exerciseCountsByCategory === "object"
  );
}
