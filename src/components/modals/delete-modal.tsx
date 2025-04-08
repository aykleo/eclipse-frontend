import React from "react";
import { GeneralModal } from "./general-modal";
import { useRef } from "react";
import { useStatus } from "../../hooks/status/status-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleExerciseDeletion } from "../../api/exercises/exercise-deletion";
import { useSearchParams } from "react-router-dom";
import { useExerciseState } from "../../hooks/exercises/exercise-context";
import { handleTemplateDeletion } from "../../api/templates/template-deletion";
import { Template } from "../../utils/types/template-types";
import { RenderSvg } from "../pixel-art/render-svg";

interface DeleteModalProps {
  type: "exercise" | "template";
  setSelectedTemplate?: (template: Template | null) => void;
}

export const DeleteModal = ({
  type,
  setSelectedTemplate,
}: DeleteModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { setStatusText } = useStatus();
  const { setShowExerciseInfo } = useExerciseState();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdForDeletion =
    (searchParams.get(
      type === "exercise" ? "exerciseToDeleteId" : "templateId"
    ) as string) || "";
  const selectedNameForDeletion =
    (searchParams.get(
      type === "exercise" ? "exerciseToDeleteName" : "templateToDeleteName"
    ) as string) || "";

  const deleteExerciseMutation = useMutation({
    mutationFn: async () => {
      if (selectedIdForDeletion) {
        return await handleExerciseDeletion(selectedIdForDeletion);
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
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      setSearchParams({}, { replace: true });
      setShowExerciseInfo(undefined);
      setStatusText("Exercise deleted successfully");
    },
    onError: (error: Error) => {
      setStatusText(`${error.message}`);
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async () => {
      if (selectedIdForDeletion) {
        return await handleTemplateDeletion(selectedIdForDeletion);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      if (setSelectedTemplate) {
        setSelectedTemplate(null);
      }
      setSearchParams({}, { replace: true });
      setStatusText("Template deleted successfully");
    },
    onError: (error: Error) => {
      setStatusText(`${error.message}`);
    },
  });

  return (
    <>
      <GeneralModal
        id={`delete_${type}_modal`}
        formRef={formRef as React.RefObject<HTMLFormElement>}
        handleSubmit={async (event) => {
          event.preventDefault();
          if (type === "exercise") {
            await deleteExerciseMutation.mutate();
          } else {
            await deleteTemplateMutation.mutate();
          }
          setSearchParams({}, { replace: true });
          const modal = document.getElementById(
            `delete_${type}_modal`
          ) as HTMLDialogElement;
          modal?.close();
        }}
      >
        <div className="flex flex-col w-full text-lg">
          <h2 className="text-gray-200 font-medium">
            Are you sure you want to delete
          </h2>
          <div className="flex flex-row items-center justify-center gap-x-2">
            <p className="text-red-400 text-center font-bold">
              {selectedNameForDeletion}
            </p>
            <p className="text-gray-200 text-center font-bold">{"?"}</p>
          </div>
        </div>

        <div className="flex flex-row w-full items-center justify-between p-2">
          <div className="form-control">
            <button>
              <RenderSvg
                src="buttons/btn-delete-open.svg"
                size="auto"
                repeat="no-repeat"
                className="h-8 w-16 cursor-pointer transition-opacity duration-200 filter brightness-100 hover:brightness-150"
                position="center"
              />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              const modal = document.getElementById(
                `delete_${type}_modal`
              ) as HTMLDialogElement;
              modal?.close();
              setSearchParams({}, { replace: true });
            }}
          >
            <RenderSvg
              src="buttons/btn-cancel-open.svg"
              size="auto"
              repeat="no-repeat"
              className="h-8 w-16 cursor-pointer transition-opacity duration-200 filter brightness-100 hover:brightness-150"
              position="center"
            />
          </button>
        </div>
      </GeneralModal>
    </>
  );
};
