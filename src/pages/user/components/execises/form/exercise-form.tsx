import React, { RefObject, useCallback, useState } from "react";
import {
  Exercise,
  MuscleGroupData,
  TagCategory,
  MuscleGroupName,
} from "../../../../../utils/types/exercise-types";
import { ToastProgress } from "../../../../../components/styles/toast-progress";
import { getColorClassForTagCategory } from "../../../../../utils/tag-colors";
import { StatusToast } from "../../../../../components/status-toast";
import { ExerciseCard } from "../exercise-codex/exercise-card";

interface ExerciseFormProps {
  exerciseForUpdate: Exercise | null;
  muscleGroupData: MuscleGroupData[];
  primaryMuscleGroupId: string | null;
  muscleGroupIds: string[];
  isLoading: boolean;
  statusText: string | null;
  handleSubmit: (event: React.FormEvent) => void;
  handlePrimaryMuscleGroup: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  handleMuscleGroupIds: (muscleId: string) => void;
  formRef: RefObject<HTMLFormElement | null>;
  exerciseNameRef: RefObject<string | null | undefined>;
  exerciseDescriptionRef: RefObject<string | null | undefined>;
  exerciseTagNameRef: RefObject<string | null | undefined>;
  exerciseTagCategoryRef: RefObject<string | null | undefined>;
  isCreatingExercise: boolean;
  setExerciseForUpdate: (exercise: Exercise | null) => void;
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = React.memo(
  ({
    exerciseForUpdate,
    muscleGroupData,
    primaryMuscleGroupId,
    muscleGroupIds,
    isLoading,
    statusText,
    handleSubmit,
    handlePrimaryMuscleGroup,
    handleMuscleGroupIds,
    formRef,
    exerciseNameRef,
    exerciseDescriptionRef,
    exerciseTagNameRef,
    exerciseTagCategoryRef,
    isCreatingExercise,
    setExerciseForUpdate,
    setIsCreatingExercise,
  }) => {
    const [step, setStep] = useState<boolean>(false);

    const exercise = {
      id: exerciseForUpdate?.id || "new-id",
      name: exerciseNameRef.current || "",
      description: exerciseDescriptionRef.current || "",
      tag: {
        id: exerciseForUpdate?.tag.id || "new-tag-id",
        name: exerciseTagNameRef.current || "",
        category: (exerciseTagCategoryRef.current as TagCategory) || undefined,
      },
      createdAt: exerciseForUpdate?.createdAt || new Date(),
      updatedAt: new Date(),
      userId: exerciseForUpdate?.userId || "default-user-id",
      exerciseMuscleGroups: muscleGroupIds.map((id) => {
        const muscleGroup = muscleGroupData.find((group) => group.id === id);
        return {
          exerciseId: exerciseForUpdate?.id || "new-exercise-id",
          muscleGroupId: id,
          isPrimary: id === primaryMuscleGroupId,
          muscleGroup: muscleGroup || {
            id: "unknown-id",
            name: MuscleGroupName.CORE,
          },
        };
      }),
      templateExercises: exerciseForUpdate?.templateExercises || [],
      workouts: exerciseForUpdate?.workouts || [],
      deletedAt: exerciseForUpdate?.deletedAt || undefined,
    };

    return (
      <div className="form-control relative w-full flex flex-col px-2  rounded-lg justify-between h-full">
        <form
          action="create_exercise"
          className="size-full flex flex-col"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="text-4xl py-2 font-bold flex flex-col gap-y-1 h-24 w-full px-2">
            <div className="flex w-full flex-row items-center justify-between">
              <h1
                className={`${
                  exerciseForUpdate
                    ? getColorClassForTagCategory(
                        exerciseForUpdate.tag.category
                      )
                    : "text-gray-300"
                } w-full truncate`}
              >
                {!exerciseForUpdate || exerciseForUpdate === null
                  ? "New exercise"
                  : exerciseForUpdate.name}
              </h1>
              <button
                className="btn btn-sm btn-error"
                onClick={(event) => {
                  event.preventDefault();
                  if (exerciseForUpdate) {
                    setExerciseForUpdate(null);
                  }
                  if (isCreatingExercise) {
                    setIsCreatingExercise(false);
                  }
                }}
              >
                fechar
              </button>
            </div>
            <div className="h-[1px] rounded-full bg-gray-600/25 w-full" />
          </div>
          <div className="flex flex-col gap-y-2 px-1 h-full overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-x-6">
              {/* name */}
              <div className="gap-y-1 flex flex-col col-start-1 col-span-1">
                <div className="gap-y-1 flex flex-col">
                  <label className="label">
                    <span className="label-text text-sm">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="input input-error w-full"
                    name="name"
                    defaultValue={
                      exerciseForUpdate ? exerciseForUpdate.name : ""
                    }
                    required
                    onChange={useCallback(
                      (e: React.ChangeEvent<HTMLInputElement>) => {
                        exerciseNameRef.current = e.target.value;
                        if (e.target.value.length >= 5) {
                          setStep(!step);
                        } else {
                          setStep(!step);
                        }
                      },
                      [exerciseNameRef, step]
                    )}
                  />
                </div>
                <div className="gap-y-1 flex flex-col">
                  <label className="label">
                    <span className="label-text text-sm">Category</span>
                  </label>
                  <select
                    defaultValue={
                      exerciseForUpdate
                        ? exerciseForUpdate.tag.category
                        : "Select a category"
                    }
                    className="select select-error w-full"
                    name="category"
                    required
                    onChange={useCallback(
                      (e: React.ChangeEvent<HTMLSelectElement>) => {
                        exerciseTagCategoryRef.current = e.target.value;
                        if (e.target.value.length > 2) {
                          setStep(!step);
                        } else {
                          setStep(!step);
                        }
                      },
                      [exerciseTagCategoryRef, step]
                    )}
                  >
                    {" "}
                    <option disabled={true}>Select a category</option>
                    {Object.values(TagCategory).map((tag) => (
                      <option key={tag} value={tag}>
                        {tag.charAt(0) + tag.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="gap-y-1 flex flex-col">
                  <label className="label">
                    <span className="label-text text-sm">Type</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bodyweight, weighted, cardio, yoga, etc"
                    className="input input-error w-full "
                    name="tagName"
                    defaultValue={
                      exerciseForUpdate ? exerciseForUpdate.tag.name : ""
                    }
                    required
                    onChange={useCallback(
                      (e: React.ChangeEvent<HTMLInputElement>) => {
                        exerciseTagNameRef.current = e.target.value;
                        if (e.target.value.length > 3) {
                          setStep(!step);
                        } else {
                          setStep(!step);
                        }
                      },
                      [exerciseTagNameRef, step]
                    )}
                  />
                </div>

                <div className="gap-y-1 flex flex-col h-full">
                  <label className="label">
                    <span className="label-text text-sm">
                      Optional description
                    </span>
                  </label>
                  <fieldset className="fieldset">
                    <textarea
                      className="textarea textarea-error w-full h-full min-h-32"
                      placeholder="..."
                      defaultValue={
                        exerciseForUpdate ? exerciseForUpdate.description : ""
                      }
                      name="description"
                      onChange={useCallback(
                        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          exerciseDescriptionRef.current = e.target.value;
                          if (e.target.value.length >= 5) {
                            setStep(!step);
                          } else {
                            setStep(!step);
                          }
                        },
                        [exerciseDescriptionRef, step]
                      )}
                    />
                  </fieldset>
                </div>
              </div>

              <div className="col-start-2 col-span-1 flex size-full items-center justify-center">
                <ExerciseCard exercise={exercise} />
              </div>

              <div className="gap-y-3 flex flex-col col-start-3 col-span-1">
                <div>
                  <label className="label">
                    <span className="label-text text-sm">Main muscle</span>
                  </label>
                  <select
                    defaultValue={
                      exerciseForUpdate
                        ? exerciseForUpdate.exerciseMuscleGroups[0].muscleGroup
                            .name
                        : "Primary mover"
                    }
                    className="select select-error w-full"
                    onChange={handlePrimaryMuscleGroup}
                    name="primaryMuscleGroupId"
                    required
                  >
                    {exerciseForUpdate ? (
                      <option disabled={true} className="hidden">
                        {exerciseForUpdate.exerciseMuscleGroups[0].muscleGroup.name
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (char: string) =>
                            char.toUpperCase()
                          )}
                      </option>
                    ) : (
                      <></>
                    )}
                    <option disabled={true}>Primary mover</option>
                    {muscleGroupData &&
                      muscleGroupData.map((muscleGroup: MuscleGroupData) => (
                        <option key={muscleGroup.id} value={muscleGroup.id}>
                          {muscleGroup.name
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="gap-y-1 flex flex-col h-full">
                  <label className="label w-full justify-between">
                    <span className="label-text text-sm">Secondary movers</span>
                  </label>

                  <div
                    className={`text-sm flex flex-wrap gap-2 py-2 opacity-75 `}
                  >
                    {muscleGroupData &&
                      muscleGroupData.map(
                        (muscleGroup: MuscleGroupData, index: number) => {
                          const isSelected = muscleGroupIds.includes(
                            muscleGroup.id
                          );

                          return (
                            <button
                              key={index}
                              disabled={!primaryMuscleGroupId}
                              className={`${
                                muscleGroup.id === primaryMuscleGroupId
                                  ? "hidden"
                                  : ""
                              } ${
                                !primaryMuscleGroupId
                                  ? "cursor-default"
                                  : "cursor-pointer"
                              } flex items-center justify-center py-1 px-2 rounded-xs transition-all duration-300 ${
                                isSelected
                                  ? "opacity-100 border border-error text-error"
                                  : "opacity-35 border border-white"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMuscleGroupIds(muscleGroup.id);
                              }}
                            >
                              <span className="text-xs text-center text-white">
                                {muscleGroup.name
                                  .replace(/_/g, " ")
                                  .toLowerCase()
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                  )}
                              </span>
                            </button>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-control w-full flex flex-col gap-y-2 h-24 pb-1 justify-end">
            <div className="h-[1px] rounded-full bg-gray-600/25" />
            <button
              disabled={isLoading}
              className={`text-gray-400 btn bg-zinc-900 border border-gray-600/25 shadow-none w-full rounded-lg`}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                <>
                  {!exerciseForUpdate || exerciseForUpdate === null
                    ? "Create"
                    : "Update"}
                </>
              )}
            </button>
          </div>
          {statusText && (
            <StatusToast statusText={statusText}>
              <div className="progress-bar bg-gray-300 h-1 mt-2 animate-progress-animation progress-bar rounded-full">
                <div className="progress bg-error h-full"></div>
              </div>
              <ToastProgress />
            </StatusToast>
          )}
        </form>
      </div>
    );
  }
);

export default ExerciseForm;
