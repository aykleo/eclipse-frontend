import { Exercise } from "../../utils/types/exercise-types";
import { User } from "../../utils/types/user-types";

export async function fetchExercises(
  currentPage: number,
  pageSize: number,
  selectedCategory: string | "",
  user: User,
  // muscleGroup?: string | "",
  exerciseName?: string | ""
): Promise<{ exercises: Exercise[]; totalPages: number }> {
  const controller = new AbortController();
  const signal = controller.signal;

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    pageSize: pageSize.toString(),
    // muscleGroup: muscleGroup || "",
    tagCategory: selectedCategory !== "" ? selectedCategory : "",
    exerciseName: exerciseName || "",
  });

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/${
        user?.id
      }/exercises?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.log("Server error. Please try again later.");
    }

    const data = await response.json();

    if (!data || !data.exercises) {
      return { exercises: [], totalPages: 0 };
    }

    return { exercises: data.exercises, totalPages: data.totalPages };
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return { exercises: [], totalPages: 0 };
  } finally {
    controller.abort();
  }
}
