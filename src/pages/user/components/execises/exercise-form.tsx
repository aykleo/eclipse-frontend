import React, { RefObject } from "react";
import {
  Exercise,
  MuscleGroupData,
  TagCategory,
} from "../../../../utils/types/exercise-types";
import { ToastProgress } from "../../../../components/styles/toast-progress";

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
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
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
}) => {
  return (
    <div className="form-control relative w-full flex flex-col p-2 justify-evenly h-[calc(100vh-10rem)] py-8">
      <form
        action="create_exercise"
        className="size-full flex flex-col gap-y-2"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="text-4xl py-2 font-bold absolute right-0 -top-6 flex flex-col gap-y-1 w-full px-2">
          {!exerciseForUpdate || exerciseForUpdate === null
            ? "Exercise creation"
            : "Update" + " " + exerciseForUpdate.name}
          <div className="h-[1px] rounded-full bg-gray-600/25 w-full" />
        </div>
        <div className="flex flex-col gap-y-2 px-1 h-full overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-x-6">
            <div className="gap-y-1 flex flex-col">
              <label className="label">
                <span className="label-text text-sm">Name of the exercise</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                className="input input-error w-full"
                name="name"
                defaultValue={exerciseForUpdate ? exerciseForUpdate.name : ""}
                required
                onChange={(e) => {
                  exerciseNameRef.current = e.target.value;
                }}
              />
            </div>
            <div className="gap-y-1 flex flex-col">
              <label className="label">
                <span className="label-text text-sm">
                  Select the main muscle
                </span>
              </label>
              <select
                defaultValue={
                  exerciseForUpdate
                    ? exerciseForUpdate.exerciseMuscleGroups[0].muscleGroup.name
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
              <label className="label">
                <span className="label-text text-sm">Secondary movers</span>
              </label>
              <div className="collapse border gap-2 w-full bg-base-100 border-error rounded-md h-fit">
                <input type="checkbox" />
                <div className="collapse-title font-semibold text-sm text-gray-300 h-2">
                  Secondary muscles
                </div>
                <div className="collapse-content text-sm grid-cols-7 gap-y-2 grid">
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
                            checked={muscleGroupIds.includes(muscleGroup.id)}
                            onChange={() => {
                              handleMuscleGroupIds(muscleGroup.id);
                            }}
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-x-6 mt-4">
            <div className="gap-y-1 flex flex-col col-span-2">
              <label className="label">
                <span className="label-text text-sm">Type of exercise</span>
              </label>
              <input
                type="text"
                placeholder="Category"
                className="input input-error w-full "
                name="tagName"
                defaultValue={
                  exerciseForUpdate ? exerciseForUpdate.tag.name : ""
                }
                required
                onChange={(e) => {
                  exerciseTagNameRef.current = e.target.value;
                }}
              />
            </div>
            <div className="gap-y-1 flex flex-col col-start-3 col-span-1">
              <label className="label">
                <span className="label-text text-sm">Category of exercise</span>
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
                onChange={(e) => {
                  exerciseTagCategoryRef.current = e.target.value;
                }}
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
                onChange={(e) => {
                  exerciseDescriptionRef.current = e.target.value;
                }}
              />
            </fieldset>
          </div>
        </div>

        <div className="form-control w-full flex flex-col gap-y-2 absolute right-0 -bottom-6">
          <div className="h-[1px] rounded-full bg-gray-600/25" />
          <button
            disabled={isLoading}
            className={`text-gray-400 btn bg-zinc-900 border  border-gray-600/25 shadow-none w-full rounded-lg`}
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
          <div className="toast toast-bottom transition-opacity duration-500 bg-transparent w-max">
            <div className="alert flex flex-col p-2 font-medium text-stone-900 h-max border-transparent bg-stone-800 w-72">
              {statusText.split(",").map((textPart, index) => (
                <span
                  key={index}
                  className="size-full break-words whitespace-normal block text-gray-100"
                >
                  {textPart.trim()}
                </span>
              ))}
              <div className="progress-bar bg-gray-300 h-1 mt-2 animate-progress-animation progress-bar rounded-full">
                <div className="progress bg-error h-full"></div>
              </div>
            </div>
          </div>
        )}
      </form>
      <ToastProgress />
    </div>
  );
};

export default ExerciseForm;
