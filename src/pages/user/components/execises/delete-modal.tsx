import React from "react";
import { SpiningModal } from "../../../../components/modals/spining-modal";
import { useRef } from "react";
import { useStatus } from "../../../../hooks/status/status-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleExerciseDeletion } from "../../../../utils/fetch-functions/exercises/exercise-deletion";
import { useSearchParams } from "react-router-dom";

export const DeleteExerciseModal = React.memo(() => {
  const formRef = useRef<HTMLFormElement>(null);
  const { statusText, setStatusText } = useStatus();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedExerciseIdForDeletion =
    (searchParams.get("exerciseId") as string) || "";
  const selectedExerciseNameForDeletion =
    (searchParams.get("exerciseName") as string) || "";

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (selectedExerciseIdForDeletion) {
        return await handleExerciseDeletion(selectedExerciseIdForDeletion);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      setSearchParams({}, { replace: true });
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
        handleSubmit={async () => {
          await deleteMutation.mutate();
        }}
        statusText={statusText ?? ""}
      >
        <div className="flex flex-col w-full">
          <h2 className="text-lg font-bold text-gray-200">
            Are you sure you want to delete
          </h2>
          <p className="text-gray-300 text-4xl text-center">
            {selectedExerciseNameForDeletion} {"?"}
          </p>
        </div>

        <div className="flex flex-row w-full items-center justify-between p-2">
          <div className="form-control">
            <button className="btn btn-error hover:bg-pink-400 hover:text-black">
              Delete
            </button>
          </div>
          <button className="btn btn-outline btn-ghost">Cancel</button>
        </div>
      </SpiningModal>
    </>
  );
});
