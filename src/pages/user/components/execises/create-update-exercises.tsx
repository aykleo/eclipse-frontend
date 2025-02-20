import React, { useRef, useState, Suspense, useCallback } from "react";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Exercise } from "../../../../utils/types/exercise-types";
import { fetchMuscleGroups } from "../../../../utils/fetch-functions/exercises/fetch-muscle-groups";
import { ExerciseFormData } from "../../../../utils/fetch-functions/exercises/fetch-create-update-exercise";
import { handleExerciseUpdate } from "../../../../utils/fetch-functions/exercises/exercise-update";
import { handleExerciseCreation } from "../../../../utils/fetch-functions/exercises/exercise-creation";
import { useStatus } from "../../../../hooks/status/status-context";

const ExerciseForm = React.lazy(() => import("./form/exercise-form"));

interface CreateOrUpdateExercisesProps {
  setIsCreatingExercise?: (isCreatingExercise: boolean) => void;
  exerciseForUpdate?: Exercise | null;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
}

const CreateOrUpdateExercises: React.FC<CreateOrUpdateExercisesProps> =
  React.memo(
    ({ exerciseForUpdate, setIsCreatingExercise, setExerciseForUpdate }) => {
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
      const { statusText, setStatusText } = useStatus();
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
            setPrimaryMuscleGroupId,
            setMuscleGroupIds,
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
          setStatusText("Exercise updated successfully");
          setTimeout(() => {
            setStatusText(null);
          }, 3000);
        },
        onError: (error: Error) => {
          setStatusText(`${error.message}`);
          setTimeout(() => {
            setStatusText(null);
          }, 3000);
        },
      });

      const createMutation = useMutation({
        mutationFn: async (formData: ExerciseFormData) => {
          return await handleExerciseCreation(
            formData,
            setIsLoading,
            setPrimaryMuscleGroupId,
            setMuscleGroupIds,
            setIsCreatingExercise
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
          if (setIsCreatingExercise) {
            setIsCreatingExercise(false);
          }
          setStatusText("Exercise created successfully");
          setTimeout(() => {
            setStatusText(null);
          }, 3000);
        },
        onError: (error: Error) => {
          setStatusText(`${error.message}`);
          setTimeout(() => {
            setStatusText(null);
          }, 3000);
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
    }
  );

export default CreateOrUpdateExercises;
