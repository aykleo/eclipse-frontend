import React, { RefObject, useCallback, useState } from "react";
import {
  Exercise,
  MuscleGroupData,
  TagCategory,
} from "../../../../../utils/types/exercise-types";
import { ToastProgress } from "../../../../../components/styles/toast-progress";
import { getColorClassForTagCategory } from "../../../../../utils/tag-colors";
import { FormSteps } from "./form-steps";
import { StatusToast } from "../../../../../components/status-toast";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

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
    const [isVisible, setIsVisible] = useState<boolean>(false);

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
                  ? "Creation"
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
            <div className="grid grid-cols-2 gap-x-6">
              <div className="gap-y-1 flex flex-col">
                <label className="label">
                  <span className="label-text text-sm">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-error w-full"
                  name="name"
                  defaultValue={exerciseForUpdate ? exerciseForUpdate.name : ""}
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
                        .replace(/\b\w/g, (char: string) => char.toUpperCase())}
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
            </div>

            {primaryMuscleGroupId && (
              <div className="gap-y-1 flex flex-col">
                <label className="label w-full justify-between">
                  <span className="label-text text-sm">Secondary movers</span>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      setIsVisible(!isVisible);
                    }}
                  >
                    {isVisible ? (
                      <ArrowBigUp className="text-error cursor-pointer" />
                    ) : (
                      <ArrowBigDown className="text-error cursor-pointer" />
                    )}
                  </button>
                </label>
                <div className="w-full h-[1px] rounded-full bg-gray-600/25" />

                <div
                  className={`${
                    isVisible ? "block" : "hidden"
                  } text-sm grid-cols-5 gap-y-2 grid p-2 opacity-75 rounded-md`}
                >
                  {muscleGroupData &&
                    muscleGroupData.map(
                      (muscleGroup: MuscleGroupData, index: number) => (
                        <div
                          key={index}
                          className={`${
                            muscleGroup.id === primaryMuscleGroupId
                              ? "hidden"
                              : ""
                          } flex flex-col items-center justify-end`}
                        >
                          <span className="text-xs text-center">
                            {muscleGroup.name
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-error"
                            defaultChecked={
                              exerciseForUpdate
                                ? exerciseForUpdate?.exerciseMuscleGroups.some(
                                    (group) =>
                                      group.muscleGroup.id === muscleGroup.id
                                  )
                                : undefined
                            }
                            onChange={() => {
                              handleMuscleGroupIds(muscleGroup.id);
                            }}
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-x-6 mt-4">
              <div className="gap-y-1 flex flex-col col-span-2">
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
              <div className="gap-y-1 flex flex-col col-start-3 col-span-1">
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
            </div>
            <div className="gap-y-1 flex flex-col col-start-3 col-span-1">
              <label className="label">
                <span className="label-text text-sm">Optional description</span>
              </label>
              <fieldset className="fieldset">
                <textarea
                  className="textarea textarea-error size-full"
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

          <div className="flex flex-col gap-y-2 h-12 w-full">
            <div className="h-[1px] rounded-full bg-gray-600/25 w-full" />
            <FormSteps
              exerciseNameRef={exerciseNameRef}
              primaryMuscleGroupId={primaryMuscleGroupId}
              muscleGroupIds={muscleGroupIds}
              exerciseTagNameRef={exerciseTagNameRef}
              exerciseTagCategoryRef={exerciseTagCategoryRef}
              exerciseDescriptionRef={exerciseDescriptionRef}
            />
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
