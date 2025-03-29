import React, { lazy, memo } from "react";
import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";
import { NewExerciseBtn } from "./new-exercise-btn";
import { CodexPagination } from "./codex-pagination";
import { RenderSvg } from "../../../../../components/pixel-art/render-svg";

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
        } flex size-full relative bg-[#252525] mb-10`}
      >
        <div
          className="h-full w-4 absolute left-0 bg-black"
          style={{
            backgroundImage:
              "url(src/assets/pixel-art/body/body-side-paper-64.svg)",
            backgroundRepeat: "repeat-y",
          }}
        />
        <div
          className="h-[11px] w-1/2 absolute left-1 bottom-0 bg-black"
          style={{
            backgroundImage:
              "url(src/assets/pixel-art/body/body-bottom-paper-48.svg)",
            backgroundRepeat: "repeat-x",
          }}
        />

        <div
          className="h-full w-4 absolute right-0 bg-black"
          style={{
            backgroundImage:
              "url(src/assets/pixel-art/body/body-side-paper-64.svg)",
            backgroundRepeat: "repeat-y",
            transform: "rotateY(180deg)",
          }}
        />
        <div
          className="h-[11px] w-1/2 absolute right-1 bottom-0 bg-black"
          style={{
            backgroundImage:
              "url(src/assets/pixel-art/body/body-bottom-paper-48.svg)",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div
          className={`${
            isCreatingTemplate ? "w-full lg:w-3/4" : "w-full"
          }  h-full relative`}
        >
          <div className="w-full lg:w-[calc(100%-1.5rem)] gap-x-2 pt-2 h-14 relative bg-transparent flex items-end justify-center">
            <div className="w-1/3 h-full relative pt-2.5">
              <div className="w-full h-[2px] absolute bottom-[13px] bg-[#bfb7b7]" />
              <RenderSvg
                src="url(src/assets/pixel-art/white-cross-16.svg)"
                className="size-full absolute"
                size="auto"
                repeat="no-repeat"
                position="right"
              />
              <RenderSvg
                src="url(src/assets/pixel-art/white-cross-16.svg)"
                className="size-full absolute"
                size="auto"
                repeat="no-repeat"
                position="left"
              />
            </div>
            <div className="text-center pb-0.5">
              {exerciseNumber && currentPage ? (
                <>
                  {exerciseNumber > 1 ? (
                    <span>
                      {exerciseNumber}{" "}
                      <span className="hidden md:inline">
                        exercises were found
                      </span>{" "}
                      in page {currentPage}
                    </span>
                  ) : (
                    <span>
                      {exerciseNumber}{" "}
                      <span className="hidden md:inline">
                        exercise was found
                      </span>{" "}
                      in page {currentPage}
                    </span>
                  )}
                </>
              ) : (
                <>No exercises were found</>
              )}
            </div>
            <div className="w-1/3 h-full relative pt-2.5">
              <div className="w-full h-[2px] absolute bottom-[13px] bg-[#bfb7b7]" />
              <RenderSvg
                src="url(src/assets/pixel-art/white-cross-16.svg)"
                className="size-full absolute"
                size="auto"
                repeat="no-repeat"
                position="left"
              />
              <RenderSvg
                src="url(src/assets/pixel-art/white-cross-16.svg)"
                className="size-full absolute"
                size="auto"
                repeat="no-repeat"
                position="right"
              />
            </div>
          </div>
          {currentPage && totalPages && setCurrentPage && (
            <CodexPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              isCreatingTemplate={isCreatingTemplate}
            />
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
