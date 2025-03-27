import React, { lazy, memo } from "react";
import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";
import { NewExerciseBtn } from "./new-exercise-btn";

const TemplateCreationList = lazy(
  () => import("../form/desktop-template-creation-list")
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

export const CardList = memo(
  ({
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
        } flex size-full relative bg-neutral-800`}
      >
        <div
          className={`${
            isCreatingTemplate ? "w-full lg:w-3/4" : "w-full"
          }  h-full relative`}
        >
          <div className="w-full lg:w-[calc(100%-1.5rem)] gap-x-2 h-10 relative bg-transparent flex items-end justify-center">
            {exerciseNumber && currentPage ? (
              <>
                {exerciseNumber > 1
                  ? exerciseNumber +
                    " exercises were found in page " +
                    currentPage
                  : exerciseNumber +
                    " exercise was found in page " +
                    currentPage}
              </>
            ) : (
              <>No exercises were found</>
            )}
          </div>
          {currentPage && totalPages && setCurrentPage && (
            <>
              <button
                className={`sticky ${
                  !isCreatingTemplate ? "left-2" : "left-2 lg:left-3"
                } z-2 top-1/2 translate-y-1/2 size-6 p-2 rounded-full border text-white flex items-center justify-center cursor-pointer`}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
              >
                aaaa
              </button>
              <button
                className={`sticky ${
                  !isCreatingTemplate
                    ? "left-[calc(100%-2rem)]"
                    : "left-[calc(100%-2rem)] lg:left-[calc(100%-23rem)]"
                } z-2 top-1/2 translate-y-1/2 size-6 p-2 rounded-full border text-white flex items-center justify-center cursor-pointer`}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === totalPages}
              >
                bbb
              </button>
            </>
          )}

          <div
            className={`overflow-y-auto ${
              isCreatingTemplate
                ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:px-10"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 "
            } h-full w-full no-scrollbar grid gap-y-8 px-4 gap-x-3 justify-items-center items-start pb-10 min-h-screen`}
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
  }
);
