import React, { useRef, useState, Suspense, useCallback } from "react";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Exercise } from "../../../../utils/types/exercise-types";
import { fetchMuscleGroups } from "../../../../api/exercises/fetch-muscle-groups";
import { ExerciseFormData } from "../../../../api/exercises/fetch-create-update-exercise";
import { handleExerciseUpdate } from "../../../../api/exercises/exercise-update";
import { handleExerciseCreation } from "../../../../api/exercises/exercise-creation";
import { useStatus } from "../../../../hooks/status/status-context";
import { useUser } from "../../../../hooks/user/use-context";

const ExerciseForm = React.lazy(() => import("./form/exercise-form"));

interface CreateOrUpdateExercisesProps {
  setIsCreatingExercise?: (isCreatingExercise: boolean) => void;
  isCreatingExercise?: boolean;
  exerciseForUpdate?: Exercise | null;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
}

const CreateOrUpdateExercises: React.FC<CreateOrUpdateExercisesProps> =
  React.memo(
    ({
      exerciseForUpdate,
      isCreatingExercise,
      setIsCreatingExercise,
      setExerciseForUpdate,
    }: CreateOrUpdateExercisesProps) => {
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
      const { statusText, setStatusText } = useStatus();
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
            setPrimaryMuscleGroupId,
            setMuscleGroupIds,
            exerciseForUpdate
          );
        },
        onSuccess: () => {
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
          setStatusText("Exercise updated successfully");
          const timeout = setTimeout(() => {
            setStatusText(null);
          }, 3000);
          return () => clearTimeout(timeout);
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
        <div className="size-full relative bg-[#252525]">
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
              isCreatingExercise={
                isCreatingExercise ? isCreatingExercise : false
              }
              setExerciseForUpdate={setExerciseForUpdate || (() => {})}
              setIsCreatingExercise={setIsCreatingExercise || (() => {})}
              exerciseDescriptionRef={exerciseDescriptionRef}
              exerciseTagNameRef={exerciseTagNameRef}
              exerciseTagCategoryRef={exerciseTagCategoryRef}
            />
          </Suspense>
        </div>
      );
    }
  );

export default CreateOrUpdateExercises;
