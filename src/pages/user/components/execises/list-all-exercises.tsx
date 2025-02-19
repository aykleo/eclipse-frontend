import { useEffect, useState } from "react";
import {
  CircleFadingArrowUp,
  CircleFadingPlusIcon,
  MessageCircleQuestionIcon,
  Trash2Icon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "../../../../utils/types/exercise-types";
import { useUser } from "../../../../hooks/user-hooks/useUser";
import { fetchExercises } from "../../../../utils/fetch-functions/exercises/fetch-exercises";
import {
  getColorBackgroundForTagCategory,
  getColorClassForTagCategory,
} from "../../../../utils/tag-colors";
import { useSearchParams } from "react-router-dom";

type ExerciseCategory =
  | ""
  | "ENDURANCE"
  | "MOVEMENT"
  | "PLYOMETRICS"
  | "STRENGTH";

export const ListAllExercises = ({
  setIsCreatingExercise,
  isCreatingExercise,
  exerciseForUpdate,
  setExerciseForUpdate,
}: {
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
  isCreatingExercise: boolean;
  exerciseForUpdate: Exercise | null;
  setExerciseForUpdate: (exercise: Exercise | null) => void;
}) => {
  const { user } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory =
    (searchParams.get("category") as ExerciseCategory) || "";

  const { data: exerciseData, isLoading } = useQuery({
    queryKey: ["exercises", { currentPage, pageSize, selectedCategory, user }],
    queryFn: () => {
      if (user) {
        return fetchExercises(currentPage, pageSize, selectedCategory, user);
      }
      return Promise.resolve({ exercises: [], totalPages: 0 });
    },
  });

  useEffect(() => {
    if (exerciseData) {
      setExercises(exerciseData.exercises);
      setTotalPages(exerciseData.totalPages);
    }
  }, [exerciseData]);

  const handleTabClick = (category: ExerciseCategory) => {
    if (category) {
      setSearchParams(
        (prev) => {
          prev.set("category", category);
          return prev;
        },
        { replace: true }
      );
    } else {
      setSearchParams(
        (prev) => {
          prev.delete("category");
          return prev;
        },
        { replace: true }
      );
    }

    setCurrentPage(1);
  };

  return (
    <div className="relative w-full h-full flex-col flex items-center gap-y-0.5 justify-start p-3 ">
      <div
        role="tablist"
        className="tabs relative tabs-box w-full bg-stone-950 rounded-none border-b border-gray-700"
      >
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm hover:text-gray-100 cursor-pointer ${
            selectedCategory === "" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("")}
        >
          All
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm hover:text-blue-400 cursor-pointer ${
            selectedCategory === "ENDURANCE" ? "text-blue-500" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("ENDURANCE")}
        >
          Endurance
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm hover:text-green-400 text-gray-400 cursor-pointer ${
            selectedCategory === "MOVEMENT" ? "text-green-500" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("MOVEMENT")}
        >
          Movement
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm hover:text-yellow-400 text-gray-400 cursor-pointer ${
            selectedCategory === "PLYOMETRICS"
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
          onClick={() => handleTabClick("PLYOMETRICS")}
        >
          Plyometrics
        </a>
        <a
          role="tab"
          className={`flex items-end px-2 justify-end text-sm hover:text-red-400 text-gray-400 cursor-pointer ${
            selectedCategory === "STRENGTH" ? "text-red-500" : "text-gray-400"
          }`}
          onClick={() => handleTabClick("STRENGTH")}
        >
          Strength
        </a>
        <a
          role="tab"
          className={`flex items-center -top-1 px-2 justify-center text-sm hover:text-gray-100 absolute right-0 text-gray-400 cursor-pointer 
           `}
          onClick={() => {
            if (exerciseForUpdate) {
              setIsCreatingExercise(true);
            } else {
              setIsCreatingExercise(!isCreatingExercise);
            }
            setExerciseForUpdate(null);
          }}
        >
          <CircleFadingPlusIcon className="size-7" />
        </a>
      </div>
      <ul className="list rounded-box shadow-md gap-y-0.5 w-full h-full pb-20">
        {exercises ? (
          <>
            {!isLoading ? (
              <div className="h-full overflow-y-auto overflow-x-hidden no-scrollbar gap-y-0.5 py-1 flex flex-col w-full">
                {exercises &&
                  exercises.map((exercise: Exercise) => (
                    <div
                      key={`${exercise.id}-${exercise.createdAt}`}
                      className=" flex-col w-full py-1.5 px-2 bg-stone-900 rounded-lg"
                    >
                      <div className="flex flex-row gap-x-4 items-center w-full">
                        <img
                          src={`src/assets/icons/category/${exercise.tag.category}.png`}
                          alt={`${exercise.tag.category} icon`}
                          className={`${getColorBackgroundForTagCategory(
                            exercise.tag.category
                          )} icon-class size-12 rounded-lg p-1`}
                        />
                        <div className="flex flex-col gap-y-0.5 w-full">
                          <div className="flex flex-row gap-y-0.5 gap-x-2 items-center justify-between w-full">
                            <div
                              className={`${getColorClassForTagCategory(
                                exercise.tag.category
                              )} text-2xl gap-x-2 flex items-center justify-start pr-1 w-2/3`}
                            >
                              <span className="truncate">{exercise.name}</span>
                              <div
                                className="tooltip tooltip-bottom cursor-help"
                                data-tip={
                                  exercise.description
                                    ? exercise.description
                                    : "There is no description"
                                }
                              >
                                <MessageCircleQuestionIcon className="size-5 text-gray-400 hover:text-white" />
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-y-0.5">
                              <span
                                className={`"text-xs opacity-50 ${getColorClassForTagCategory(
                                  exercise.tag.category
                                )} `}
                              >
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
                          </div>
                          <div className="flex flex-row item-center justify-between">
                            <div className="gap-x-2 w-1/2 flex flex-wrap">
                              {exercise.exerciseMuscleGroups.map(
                                (muscleGroup) => (
                                  <img
                                    src={`src/assets/icons/muscle-group/${muscleGroup.muscleGroup.name}.png`}
                                    alt={`${muscleGroup.muscleGroup.name} icon`}
                                    className={`${
                                      muscleGroup.isPrimary ? "" : "opacity-35"
                                    } size-7 rounded-full border border-transparent shadow-xs shadow-gray-700`}
                                  />
                                )
                              )}
                            </div>

                            <div className="flex flex-row gap-x-6 items-end justify-end w-max px-2">
                              {exercise.id === exerciseForUpdate?.id ? (
                                <span
                                  className={`text-lg ${
                                    exercise.id === exerciseForUpdate?.id
                                      ? getColorClassForTagCategory(
                                          exercise.tag.category
                                        )
                                      : ""
                                  }`}
                                >
                                  Updating...
                                </span>
                              ) : (
                                <button
                                  className="cursor-pointer"
                                  disabled={
                                    exercise.id === exerciseForUpdate?.id
                                  }
                                >
                                  <Trash2Icon className="size-6 text-gray-400 hover:text-white" />
                                </button>
                              )}
                              <button
                                className={`cursor-pointer ${
                                  exercise.id === exerciseForUpdate?.id
                                    ? getColorClassForTagCategory(
                                        exercise.tag.category
                                      )
                                    : "text-gray-400"
                                }`}
                                onClick={() => {
                                  setExerciseForUpdate(exercise);
                                  if (exercise.id === exerciseForUpdate?.id) {
                                    setExerciseForUpdate(null);
                                  }
                                }}
                              >
                                <CircleFadingArrowUp className="size-6 hover:text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
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
      <div className="join w-full px-2 flex items-center text-lg absolute bottom-1.5 opacity-100 backdrop-blur-3xl">
        <button
          className="join-item btn w-1/5"
          onClick={() => {
            if (currentPage > 5) {
              setCurrentPage((prevPage) => prevPage - 5);
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
