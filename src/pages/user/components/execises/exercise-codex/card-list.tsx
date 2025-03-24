import React, { lazy } from "react";
import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";
import { NewExerciseBtn } from "./new-exercise-btn";
import { CodexPagination } from "./codex-pagination";

const TemplateCreationList = lazy(
  () => import("../../template/template-creation-list")
);

interface CardListProps {
  exerciseForUpdate: Exercise | null;
  setExerciseForUpdate: (exercise: Exercise | null) => void;
  isCreatingExercise: boolean;
  setIsCreatingExercise: (isCreatingExercise: boolean) => void;
  isCreatingTemplate: boolean;
  templateExercises: TemplateExercise[];
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
  setTemplateExercises: React.Dispatch<
    React.SetStateAction<TemplateExercise[]>
  >;
  exerciseNumber?: number;
  currentPage?: number;
  children?: React.ReactNode;
  totalPages?: number;
  setCurrentPage?: (page: number) => void;
}

export const CardList = ({
  exerciseForUpdate,
  setExerciseForUpdate,
  isCreatingExercise,
  setIsCreatingExercise,
  isCreatingTemplate,
  templateExercises,
  onUpdateNotes,
  onRemoveExercise,
  setIsCreatingTemplate,
  setTemplateExercises,
  exerciseNumber,
  currentPage,
  children,
  totalPages,
  setCurrentPage,
}: CardListProps) => {
  return (
    <div
      className={`${
        isCreatingExercise || exerciseForUpdate ? "hidden" : ""
      } flex size-full relative bg-red-950/50`}
    >
      <div
        className={`${
          isCreatingTemplate ? "w-full lg:w-3/4" : "w-full"
        }  h-full relative`}
      >
        {/* <div className="w-full lg:w-[calc(100%-1.5rem)] h-10 z-2 sticky top-28 bg-transparent flex items-center justify-center">
          {exerciseNumber &&
            currentPage &&
            `${exerciseNumber} exercise were found in page ${currentPage}`}
          {!isCreatingExercise &&
            !exerciseForUpdate &&
            setCurrentPage &&
            totalPages &&
            currentPage && (
              <CodexPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
        </div> */}
        <div
          className={`overflow-y-auto ${
            isCreatingTemplate
              ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:px-10"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 "
          } h-full w-full no-scrollbar grid gap-y-8 pt-7 px-4 gap-x-3 justify-items-center items-start pb-2 min-h-screen`}
        >
          <NewExerciseBtn
            setIsCreatingExercise={setIsCreatingExercise}
            isCreatingExercise={isCreatingExercise}
            setExerciseForUpdate={setExerciseForUpdate}
          />

          {children}
        </div>
      </div>

      {isCreatingTemplate && (
        <div className="w-1/4 sticky h-[calc(100vh-7rem)] top-28 right-0 hidden lg:block p-2 rounded-l-md rounded-b-none bg-gradient-to-r from-neutral-950 to-red-950/50">
          <React.Suspense fallback={<div>Loading...</div>}>
            <TemplateCreationList
              exercises={templateExercises}
              onUpdateNotes={onUpdateNotes}
              onRemoveExercise={onRemoveExercise}
              setIsCreatingTemplate={setIsCreatingTemplate}
              setTemplateExercises={setTemplateExercises}
            />
          </React.Suspense>
        </div>
      )}
    </div>
  );
};
