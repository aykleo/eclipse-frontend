import { useEffect, useState } from "react";
import { useUser } from "../../hooks/user-hooks/useUser";
import { Exercise } from "../../utils/exercise-types";
import {
  getColorBackgroundForTagCategory,
  getColorClassForTagCategory,
} from "../../utils/tag-colors";

type ExerciseCategory =
  | ""
  | "ENDURANCE"
  | "MOVEMENT"
  | "PLYOMETRICS"
  | "STRENGTH";

export const ListAllExercises = () => {
  const { user } = useUser();
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;
  const [selectedCategory, setSelectedCategory] =
    useState<ExerciseCategory>("");

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchExercises = async (page: number, muscleGroup?: string) => {
        try {
          const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            muscleGroup: muscleGroup || "",
            tagCategory: selectedCategory !== "" ? selectedCategory : "",
          });

          const response = await fetch(
            `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/${
              user?.id
            }/exercises?${queryParams.toString()}`,
            {
              method: "GET",
              credentials: "include",
              signal,
            }
          );
          const data = await response.json();
          setExercises(data.exercises);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error("Failed to fetch exercises:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchExercises(currentPage);

      return () => {
        controller.abort();
      };
    }
  }, [user, currentPage, selectedCategory]);

  const handleTabClick = (category: ExerciseCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="relative w-full h-full flex-col flex items-center gap-y-0.5 justify-start p-3 ">
      <div
        role="tablist"
        className="tabs tabs-box w-full bg-stone-950 rounded-none border-b border-gray-700"
      >
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm cursor-pointer ${
            selectedCategory === "" ? "text-white text-xl" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("")}
        >
          All
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm cursor-pointer ${
            selectedCategory === "ENDURANCE"
              ? "text-blue-500 text-xl"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("ENDURANCE")}
        >
          Endurance
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm text-gray-400 cursor-pointer ${
            selectedCategory === "MOVEMENT"
              ? "text-green-500 text-xl"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("MOVEMENT")}
        >
          Movement
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm text-gray-400 cursor-pointer ${
            selectedCategory === "PLYOMETRICS"
              ? "text-yellow-500 text-xl"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("PLYOMETRICS")}
        >
          Plyometrics
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm text-gray-400 cursor-pointer ${
            selectedCategory === "STRENGTH"
              ? "text-red-500 text-xl"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("STRENGTH")}
        >
          Strength
        </a>
      </div>
      <ul className="list rounded-box shadow-md gap-y-0.5 w-full h-full pb-20">
        {exercises ? (
          <>
            {!isLoading ? (
              <div className="h-full overflow-y-auto remove-scrollbar">
                {exercises &&
                  exercises.map((exercise: Exercise) => (
                    <div
                      key={`${exercise.id}-${exercise.name}`}
                      className="border-b rounded-none border-gray-700 flex-col collapse"
                    >
                      <input
                        type="radio"
                        name="my-accordion-1"
                        onClick={() => {
                          console.log(exercise.id);
                        }}
                      />
                      <div className="collapse-title flex gap-x-3 items-center w-full">
                        <img
                          src={`src/assets/icons/${exercise.tag.category}.png`}
                          alt={`${exercise.tag.category} icon`}
                          className={`${getColorBackgroundForTagCategory(
                            exercise.tag.category
                          )} icon-class size-10 rounded-lg p-1`}
                        />

                        <div className="">
                          <div
                            className={`${getColorClassForTagCategory(
                              exercise.tag.category
                            )} text-xl gap-x-2 flex items-center`}
                          >
                            <span>{exercise.name}</span>
                            <span className="text-xs text-gray-600">
                              {exercise.tag.name}
                            </span>
                            <span className="text-xs text-gray-600">
                              {new Intl.DateTimeFormat("pt-BR", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              }).format(new Date(exercise.createdAt))}
                            </span>
                          </div>
                          <div className="flex flex-row gap-x-2">
                            {exercise.exerciseMuscleGroups.map(
                              (muscleGroup, index) => (
                                <span
                                  key={`${exercise.id}-${muscleGroup.muscleGroup.name}-${index}`}
                                  className={`${
                                    muscleGroup.isPrimary
                                      ? "text-gray-200"
                                      : "text-gray-600"
                                  } text-xs`}
                                >
                                  {muscleGroup.muscleGroup.name}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="collapse-content text-gray-300">
                        {exercise.description}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>load</div>
            )}
          </>
        ) : (
          <div className="text-gray-600 text-center p-4 size-full">
            No exercises found
          </div>
        )}
      </ul>
      <div className="join w-full flex items-center text-lg absolute bottom-1 opacity-100 backdrop-blur-3xl">
        <button
          className="join-item btn w-1/5"
          onClick={() => {
            if (currentPage > 5) {
              setCurrentPage((prevPage) => prevPage - 1);
            }
          }}
          disabled={currentPage <= 5}
        >
          ««
        </button>
        <button
          className="join-item btn w-1/5"
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage((prevPage) => prevPage - 1);
            }
          }}
          disabled={currentPage === 1}
        >
          «
        </button>
        <span className="join-item btn w-1/5  cursor-default">
          {currentPage}
        </span>
        <button
          className="join-item btn w-1/5"
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage((prevPage) => prevPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
        >
          »
        </button>
        <button
          className="join-item btn w-1/5"
          onClick={() => {
            if (currentPage <= totalPages - 5) {
              setCurrentPage((prevPage) => prevPage + 5);
            }
          }}
          disabled={currentPage >= totalPages - 5}
        >
          »»
        </button>
      </div>
    </div>
  );
};
