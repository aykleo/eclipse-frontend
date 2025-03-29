import React, { RefObject, useEffect, useState } from "react";
import {
  Exercise,
  MuscleGroupData,
  TagCategory,
  MuscleGroupName,
} from "../../../../../utils/types/exercise-types";
import { getColorClassForTagCategory } from "../../../../../utils/tag-colors";
import { StatusToast } from "../../../../../components/status-toast";
import { ExerciseCard } from "../../../../../components/exercise/exercise-card";
import { EyeIcon } from "lucide-react";
import { Input } from "../../../../../components/forms/input";
import { Select } from "../../../../../components/forms/select";
import { MuscleGroupSelect } from "../../../../../components/forms/muscle-group-select";
import { TextArea } from "../../../../../components/forms/text-area";
import MuscleGroupTree from "./muscle-group-tree";

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
    const initialMuscleGroupIds = muscleGroupIds;
    const [cardRender, setCardRender] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const toggleTooltip = () => {
      setIsTooltipVisible(!isTooltipVisible);
    };

    const exercise = {
      id: exerciseForUpdate?.id || "",
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

    useEffect(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, []);

    return (
      <div className="form-control relative w-full flex flex-col px-2 justify-between h-full py-2">
        <form
          action="create_exercise"
          className="size-full flex flex-col"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="text-4xl py-2 font-bold flex flex-col gap-y-1 w-full px-2">
            <div className="flex w-full flex-row items-center justify-between relative">
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
              <div className="flex flex-row gap-x-6">
                <div
                  onClick={toggleTooltip}
                  className="cursor-pointer md:hidden"
                >
                  <EyeIcon className="size-5 text-white transition-all duration-300" />
                </div>
                <button
                  className="text-sm cursor-pointer px-1 text-white"
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
                  Close
                </button>
              </div>
            </div>
          </div>
          {isTooltipVisible && (
            <div
              className="absolute inset-0 z-99 flex items-start pt-16 cursor-pointer lg:hidden justify-center backdrop-blur-xs bg-neutral-950/50"
              onClick={toggleTooltip}
            >
              <ExerciseCard exercise={exercise} />
            </div>
          )}
          <div className="flex flex-col gap-y-2 px-1 h-full overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-x-6">
              <div className="gap-y-1 flex flex-col col-start-1 col-span-3 md:col-span-1">
                <Input
                  hasLabel={true}
                  label="Name"
                  type="text"
                  placeholder="Name"
                  name="name"
                  required
                  defaultValue={exerciseForUpdate ? exerciseForUpdate.name : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    exerciseNameRef.current = e.target.value;
                    if (e.target.value.length > 2) {
                      setCardRender(!cardRender);
                    } else {
                      setCardRender(!cardRender);
                    }
                  }}
                />
                <Select
                  hasLabel={true}
                  label="Category"
                  defaultValue={
                    exerciseForUpdate
                      ? exerciseForUpdate.tag.category
                      : "Select a category"
                  }
                  required={true}
                  name="category"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    exerciseTagCategoryRef.current = e.target.value;
                    if (e.target.value.length > 2) {
                      setCardRender(!cardRender);
                    } else {
                      setCardRender(!cardRender);
                    }
                  }}
                  placeholder="Select a category"
                  options={Object.values(TagCategory).map((tag) => (
                    <option key={tag} value={tag}>
                      {tag.charAt(0) + tag.slice(1).toLowerCase()}
                    </option>
                  ))}
                />

                <Input
                  hasLabel={true}
                  label="Type"
                  type="text"
                  placeholder="Bodyweight, weighted, cardio, yoga, etc"
                  name="tagName"
                  defaultValue={
                    exerciseForUpdate ? exerciseForUpdate.tag.name : ""
                  }
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    exerciseTagNameRef.current = e.target.value;
                    if (e.target.value.length > 2) {
                      setCardRender(!cardRender);
                    } else {
                      setCardRender(!cardRender);
                    }
                  }}
                />

                <TextArea
                  hasLabel={true}
                  label="Description"
                  name="description"
                  placeholder="..."
                  defaultValue={
                    exerciseForUpdate ? exerciseForUpdate.description : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    exerciseDescriptionRef.current = e.target.value;
                    if (e.target.value.length >= 5) {
                      setCardRender(!cardRender);
                    } else {
                      setCardRender(!cardRender);
                    }
                  }}
                />
              </div>

              <div className="hidden md:col-start-2 col-span-1 md:flex size-full items-center justify-center">
                <ExerciseCard exercise={exercise} />
              </div>

              <div className="gap-y-3 flex flex-col md:col-start-3 col-span-3 md:col-span-1">
                <MuscleGroupSelect
                  label="Main muscle"
                  muscleGroupData={muscleGroupData}
                  defaultValue={
                    exerciseForUpdate?.exerciseMuscleGroups[0].muscleGroup.name
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
                    "Primary mover"
                  }
                  onChange={handlePrimaryMuscleGroup}
                  name="primaryMuscleGroupId"
                  required
                />

                <MuscleGroupTree
                  muscleGroupData={muscleGroupData}
                  initialMuscleGroupIds={initialMuscleGroupIds}
                  primaryMuscleGroupId={primaryMuscleGroupId}
                  handleMuscleGroupIds={handleMuscleGroupIds}
                />
              </div>
            </div>
          </div>

          <div className="form-control w-full flex flex-col gap-y-2 h-24 pb-1 justify-end">
            <button
              disabled={isLoading}
              className={` btn btn-error  border shadow-none w-full rounded-md`}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                <>
                  {!exerciseForUpdate || exerciseForUpdate === null
                    ? "Create"
                    : "Update"}
                </>
              )}
            </button>
          </div>
          {statusText && <StatusToast statusText={statusText} />}
        </form>
      </div>
    );
  }
);

export default ExerciseForm;
