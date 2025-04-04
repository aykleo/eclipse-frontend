import React from "react";
import { SpiningModal } from "../../components/modals/spining-modal";
import { useRef } from "react";
import { useStatus } from "../../hooks/status/status-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleExerciseDeletion } from "../../api/exercises/exercise-deletion";
import { useSearchParams } from "react-router-dom";
import { useExerciseState } from "../../hooks/exercises/exercise-context";

export const DeleteExerciseModal = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { setStatusText } = useStatus();
  const { setShowExerciseInfo } = useExerciseState();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedExerciseIdForDeletion =
    (searchParams.get("exerciseToDeleteId") as string) || "";
  const selectedExerciseNameForDeletion =
    (searchParams.get("exerciseToDeleteName") as string) || "";

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (selectedExerciseIdForDeletion) {
        return await handleExerciseDeletion(selectedExerciseIdForDeletion);
      }
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
      setSearchParams({}, { replace: true });
      setShowExerciseInfo(undefined);
      setStatusText("Exercise deleted successfully");
      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 3000);
      return () => clearTimeout(timeout);
    },
    onError: (error: Error) => {
      setStatusText(`${error.message}`);
      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 3000);
      return () => clearTimeout(timeout);
    },
  });

  return (
    <>
      <SpiningModal
        id="delete_exercise_modal"
        formRef={formRef as React.RefObject<HTMLFormElement>}
        handleSubmit={async (event) => {
          event.preventDefault();
          await deleteMutation.mutate();
          setSearchParams({}, { replace: true });
          const modal = document.getElementById(
            "delete_exercise_modal"
          ) as HTMLDialogElement;
          modal?.close();
        }}
      >
        <div className="flex flex-col w-full text-lg">
          <h2 className="text-gray-200 font-medium">
            Are you sure you want to delete
          </h2>
          <p className="text-gray-300 text-center font-bold">
            {selectedExerciseNameForDeletion} {"?"}
          </p>
        </div>

        <div className="flex flex-row w-full items-center justify-between p-2">
          <div className="form-control">
            <button className="btn btn-error  hover:text-black">Delete</button>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              const modal = document.getElementById(
                "delete_exercise_modal"
              ) as HTMLDialogElement;
              modal?.close();
              setSearchParams({}, { replace: true });
            }}
            className="btn btn-outline btn-ghost hover:bg-neutral-950"
          >
            Cancel
          </button>
        </div>
      </SpiningModal>
    </>
  );
};
