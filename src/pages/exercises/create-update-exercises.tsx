import React, { useRef, useState, Suspense, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useExerciseState } from "../../hooks/exercises/exercise-context";
import { ExerciseCreationResult } from "../../api/exercises/exercise-creation";
import { ExerciseUpdateResult } from "../../api/exercises/exercise-update";
import { ExerciseFormData } from "../../api/exercises/fetch-create-update-exercise";
import { fetchMuscleGroups } from "../../api/exercises/fetch-muscle-groups";
import { useUser } from "../../hooks/user/use-context";
import { useStatus } from "../../hooks/status/status-context";
import { handleExerciseCreation } from "../../api/exercises/exercise-creation";
import { handleExerciseUpdate } from "../../api/exercises/exercise-update";
import { RenderSvg } from "../../components/pixel-art/render-svg";

const ExerciseForm = React.lazy(() => import("./form/exercise-form"));

const CreateOrUpdateExercises: React.FC = React.memo(() => {
  const {
    isCreatingExercise,
    setIsCreatingExercise,
    exerciseForUpdate,
    setExerciseForUpdate,
  } = useExerciseState();
  const queryClient = useQueryClient();
  const { user } = useUser() || {};
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
  const { setStatusText } = useStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [primaryMuscleGroupId, setPrimaryMuscleGroupId] = useState<
    string | null
  >(
    exerciseForUpdate
      ? exerciseForUpdate.exerciseMuscleGroups[0].muscleGroup.id
      : null
  );
  const [muscleGroupIds, setMuscleGroupIds] = useState<string[]>(
    exerciseForUpdate
      ? exerciseForUpdate.exerciseMuscleGroups.map(
          (muscleGroup) => muscleGroup.muscleGroup.id
        )
      : []
  );

  const { data: muscleGroupData } = useQuery({
    queryKey: ["muscleGroup"],
    queryFn: () => fetchMuscleGroups(),
    staleTime: Infinity,
    enabled: !!user,
  });

  const handlePrimaryMuscleGroup = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    },
    [setPrimaryMuscleGroupId, setMuscleGroupIds]
  );

  const handleMuscleGroupIds = useCallback(
    (muscleId: string) => {
      setMuscleGroupIds((prevSelected) => {
        const updatedSelected = new Set(prevSelected);
        if (updatedSelected.has(muscleId)) {
          updatedSelected.delete(muscleId);
        } else {
          updatedSelected.add(muscleId);
        }
        return Array.from(updatedSelected);
      });
    },
    [setMuscleGroupIds]
  );

  const updateMutation = useMutation({
    mutationFn: async (formData: ExerciseFormData) => {
      if (!exerciseForUpdate || exerciseForUpdate === null) {
        return null;
      }

      return await handleExerciseUpdate(
        formData,
        setIsLoading,
        exerciseForUpdate
      );
    },
    onSuccess: (result: ExerciseUpdateResult | null) => {
      if (!result || !result.success) {
        const errorMessage = result?.error || "Failed to update exercise";
        setStatusText(errorMessage);
        const timeout = setTimeout(() => {
          setStatusText(null);
        }, 3000);
        return () => clearTimeout(timeout);
      }

      queryClient.invalidateQueries({
        queryKey: ["exercises"],
      });
      queryClient.invalidateQueries({
        queryKey: ["exerciseByTag"],
      });
      queryClient.invalidateQueries({
        queryKey: ["exerciseByMuscleGroup"],
      });
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
      setPrimaryMuscleGroupId("");
      setMuscleGroupIds([]);
      setStatusText("Exercise updated successfully");
      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 3000);
      return () => clearTimeout(timeout);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: ExerciseFormData) => {
      return await handleExerciseCreation(formData, setIsLoading);
    },
    onSuccess: (result: ExerciseCreationResult) => {
      if (!result.success) {
        setStatusText(result.error || "Failed to create exercise");
        const timeout = setTimeout(() => {
          setStatusText(null);
        }, 3000);
        return () => clearTimeout(timeout);
      }

      queryClient.invalidateQueries({
        queryKey: ["exercises"],
      });
      queryClient.invalidateQueries({
        queryKey: ["exerciseByTag"],
      });
      queryClient.invalidateQueries({
        queryKey: ["exerciseByMuscleGroup"],
      });
      exerciseNameRef.current = "";
      exerciseDescriptionRef.current = "";
      exerciseTagNameRef.current = "";
      exerciseTagCategoryRef.current = "";
      if (formRef && formRef.current) {
        formRef.current.reset();
      }
      if (setIsCreatingExercise) {
        setIsCreatingExercise(false);
      }
      setPrimaryMuscleGroupId("");
      setMuscleGroupIds([]);
      setStatusText("Exercise created successfully");
      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 3000);
      return () => clearTimeout(timeout);
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
    <div className="size-full relative bg-neutral-800 mt-16">
      <Suspense
        fallback={
          <div className="size-full flex items-center justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        }
      >
        <ExerciseForm
          exerciseForUpdate={exerciseForUpdate ? exerciseForUpdate : null}
          muscleGroupData={muscleGroupData}
          primaryMuscleGroupId={primaryMuscleGroupId}
          muscleGroupIds={muscleGroupIds}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handlePrimaryMuscleGroup={handlePrimaryMuscleGroup}
          handleMuscleGroupIds={handleMuscleGroupIds}
          formRef={formRef}
          exerciseNameRef={exerciseNameRef}
          isCreatingExercise={isCreatingExercise ? isCreatingExercise : false}
          setExerciseForUpdate={setExerciseForUpdate || (() => {})}
          setIsCreatingExercise={setIsCreatingExercise || (() => {})}
          exerciseDescriptionRef={exerciseDescriptionRef}
          exerciseTagNameRef={exerciseTagNameRef}
          exerciseTagCategoryRef={exerciseTagCategoryRef}
        />
      </Suspense>
      <RenderSvg
        src="body/body-bot-4.svg"
        size="auto"
        repeat="repeat-x"
        position="center"
        className="absolute bottom-0 h-1 w-full"
      />
    </div>
  );
});

export default CreateOrUpdateExercises;
