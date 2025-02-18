import React, { useRef, useState, Suspense } from "react";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Exercise } from "../../../../utils/types/exercise-types";
import { fetchMuscleGroups } from "../../../../utils/fetch-functions/exercises/fetch-muscle-groups";
import { ExerciseFormData } from "../../../../utils/fetch-functions/exercises/fetch-create-update-exercise";
import { handleExerciseUpdate } from "../../../../utils/fetch-functions/exercises/exercise-update";
import { handleExerciseCreation } from "../../../../utils/fetch-functions/exercises/exercise-creation";

const ExerciseForm = React.lazy(() => import("./exercise-form"));

interface CreateOrUpdateExercisesProps {
  setIsCreatingExercise?: (isCreatingExercise: boolean) => void;
  exerciseForUpdate?: Exercise | null;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
}

export const CreateOrUpdateExercises: React.FC<
  CreateOrUpdateExercisesProps
> = ({ exerciseForUpdate, setIsCreatingExercise, setExerciseForUpdate }) => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);
  const exerciseNameRef = useRef<string | null>(
    exerciseForUpdate ? exerciseForUpdate.name : null
  );
  const exerciseDescriptionRef = useRef<string | null>(
    exerciseForUpdate ? exerciseForUpdate.description : null
  );
  const exerciseTagNameRef = useRef<string | null>(
    exerciseForUpdate ? exerciseForUpdate.tag.name : null
  );
  const exerciseTagCategoryRef = useRef<string | null>(
    exerciseForUpdate ? exerciseForUpdate.tag.category : null
  );
  const [statusText, setStatusText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryMuscleGroupId, setPrimaryMuscleGroupId] = useState<
    string | null
  >(
    exerciseForUpdate
      ? exerciseForUpdate.exerciseMuscleGroups[0].muscleGroup.id
      : null
  );
  const [muscleGroupIds, setMuscleGroupIds] = useState<string[]>([]);

  const { data: muscleGroupData } = useQuery({
    queryKey: ["muscleGroup"],
    queryFn: () => fetchMuscleGroups(),
    staleTime: Infinity,
  });

  const handlePrimaryMuscleGroup = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;

    setPrimaryMuscleGroupId((prevPrimaryId) => {
      setMuscleGroupIds((prevIds) => {
        const updatedIds = prevIds.filter((id) => id !== prevPrimaryId);

        if (!updatedIds.includes(selectedId)) {
          updatedIds.push(selectedId);
        }

        return updatedIds;
      });

      return selectedId;
    });
  };

  const handleMuscleGroupIds = (muscleId: string) => {
    setMuscleGroupIds((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(muscleId)) {
        updatedSelected.delete(muscleId);
      } else {
        updatedSelected.add(muscleId);
      }
      return Array.from(updatedSelected);
    });
  };

  const updateMutation = useMutation({
    mutationFn: async (formData: ExerciseFormData) => {
      if (!exerciseForUpdate || exerciseForUpdate === null) {
        return null;
      }

      return await handleExerciseUpdate(
        formData,
        setIsLoading,
        setPrimaryMuscleGroupId,
        setMuscleGroupIds,
        setStatusText,
        exerciseForUpdate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      exerciseNameRef.current = "";
      exerciseDescriptionRef.current = "";
      exerciseTagNameRef.current = "";
      exerciseTagCategoryRef.current = "";
      if (formRef && formRef.current) {
        formRef.current.reset();
      }
      if (setExerciseForUpdate) {
        setExerciseForUpdate(null);
      }
    },
    onError: (error: Error) => {
      setStatusText(`${error.message}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: ExerciseFormData) => {
      return await handleExerciseCreation(
        formData,
        setIsLoading,
        setPrimaryMuscleGroupId,
        setMuscleGroupIds,
        queryClient,
        setStatusText,
        setIsCreatingExercise
      );
    },
    onSuccess: (response: string) => {
      setStatusText(response);
      setTimeout(() => {
        setStatusText(null);
      }, 3000);
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      exerciseNameRef.current = "";
      exerciseDescriptionRef.current = "";
      exerciseTagNameRef.current = "";
      exerciseTagCategoryRef.current = "";
      if (formRef && formRef.current) {
        formRef.current.reset();
      }
    },
    onError: (error: Error) => {
      setStatusText(`${error.message}`);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formRef.current) {
      if (!exerciseForUpdate) {
        const formData = {
          name: exerciseNameRef.current || "",
          description: exerciseDescriptionRef.current || "",
          tagName: exerciseTagNameRef.current || "",
          category: exerciseTagCategoryRef.current || "",
          primaryMuscleGroupId: primaryMuscleGroupId || "",
          muscleGroupIds: muscleGroupIds,
        };

        await createMutation.mutateAsync(formData);
      } else {
        const formData = {
          exerciseId: exerciseForUpdate.id,
          tagId: exerciseForUpdate.tag.id,
          name: exerciseNameRef.current || "",
          description: exerciseDescriptionRef.current || "",
          tagName: exerciseTagNameRef.current || "",
          category: exerciseTagCategoryRef.current || "",
          primaryMuscleGroupId: primaryMuscleGroupId || "",
          muscleGroupIds: muscleGroupIds,
        };

        await updateMutation.mutateAsync(formData);
      }
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExerciseForm
        exerciseForUpdate={exerciseForUpdate ? exerciseForUpdate : null}
        muscleGroupData={muscleGroupData}
        primaryMuscleGroupId={primaryMuscleGroupId}
        muscleGroupIds={muscleGroupIds}
        isLoading={isLoading}
        statusText={statusText}
        handleSubmit={handleSubmit}
        handlePrimaryMuscleGroup={handlePrimaryMuscleGroup}
        handleMuscleGroupIds={handleMuscleGroupIds}
        formRef={formRef}
        exerciseNameRef={exerciseNameRef}
        exerciseDescriptionRef={exerciseDescriptionRef}
        exerciseTagNameRef={exerciseTagNameRef}
        exerciseTagCategoryRef={exerciseTagCategoryRef}
      />
    </Suspense>
  );
};
