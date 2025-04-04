import React, { lazy, RefObject } from "react";
import { TemplateItem } from "../../../utils/types/template-types";
import { Exercise } from "../../../utils/types/exercise-types";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { CodexPagination } from "./codex-pagination";
import { NewExerciseBtn } from "./new-exercise-btn";

const TemplateCreationList = lazy(
  () => import("../form/desktop-template-creation-list")
);

interface CardListProps {
  templateExercises: TemplateItem[];
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  setTemplateExercises: React.Dispatch<React.SetStateAction<TemplateItem[]>>;
  showExerciseInfoById: (exerciseId: string) => void;
  templateExercisesHashTable: RefObject<{ [key: string]: Exercise }>;
  exerciseNumber?: number;
  currentPage?: number;
  children?: React.ReactNode;
  totalPages?: number;
  setCurrentPage?: (page: number) => void;
}

export const CardList = React.memo(
  ({
    templateExercises,
    onUpdateNotes,
    onRemoveExercise,
    setTemplateExercises,
    showExerciseInfoById,
    exerciseNumber,
    currentPage,
    children,
    totalPages,
    setCurrentPage,
    templateExercisesHashTable,
  }: CardListProps) => {
    const { isCreatingExercise, exerciseForUpdate, isCreatingTemplate } =
      useExerciseState();

    return (
      <div
        className={`${
          isCreatingExercise || exerciseForUpdate ? "hidden" : ""
        } flex size-full relative bg-[#252525] pt-16`}
      >
        <div
          className={`${
            isCreatingTemplate ? "w-full lg:w-3/4" : "w-full"
          }  h-full relative`}
        >
          <div className="w-full lg:w-[calc(100%-1.5rem)] gap-x-2 pt-2 h-14 relative bg-transparent flex items-end justify-center">
            <div className="w-1/3 h-full relative pt-2.5">
              <div className="w-full h-[2px] absolute bottom-[13px] bg-[#bfb7b7]" />
              <RenderSvg
                src="general/white-cross-16.svg"
                className="size-full absolute"
                size="auto"
                repeat="no-repeat"
                position="right"
              />
              <RenderSvg
                src="general/white-cross-16.svg"
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
                <>
                  <span className="hidden md:inline">
                    No exercises were found
                  </span>
                  <span className="inline md:hidden">No exercises</span>
                </>
              )}
            </div>
            <div className="w-1/3 h-full relative pt-2.5">
              <div className="w-full h-[2px] absolute bottom-[13px] bg-[#bfb7b7]" />
              <RenderSvg
                src="general/white-cross-16.svg"
                className="size-full absolute"
                size="auto"
                repeat="no-repeat"
                position="left"
              />
              <RenderSvg
                src="general/white-cross-16.svg"
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
            />
          )}

          <div
            className={`overflow-y-auto ${
              isCreatingTemplate
                ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:px-10"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 "
            } h-full w-full no-scrollbar grid gap-y-2 justify-items-center items-start pb-10 min-h-screen -mt-8`}
          >
            {!isCreatingTemplate && <NewExerciseBtn />}

            {children}
          </div>
        </div>

        {isCreatingTemplate && (
          <div className="w-1/4 sticky h-[calc(100vh-7rem)] top-28 right-0 hidden lg:block mr-2 mb-3">
            <div className="w-full h-full p-2 relative">
              <div className="h-[51px] w-full relative">
                <RenderSvg
                  src="desktop-template-creation/top-left.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="w-[32px] h-full absolute top-0 left-[-5px] filter brightness-75"
                />
                <RenderSvg
                  src="desktop-template-creation/top-middle.svg"
                  size="auto"
                  repeat="repeat-x"
                  position="center"
                  className="w-[95%] right-1/2 translate-x-1/2 h-full absolute filter brightness-75"
                />
                <RenderSvg
                  src="desktop-template-creation/top-right.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="w-[32px] h-full absolute top-0 right-[-2px] filter brightness-75"
                />
              </div>
              <div className="w-full h-[calc(100%-108px)] ">
                <RenderSvg
                  src="desktop-template-creation/middle-left.svg"
                  size="auto"
                  repeat="repeat-y"
                  position="center"
                  className="w-[32px] h-[calc(100%-120px)] absolute top-[56px] left-[5px] filter brightness-75"
                />
                <RenderSvg
                  src="desktop-template-creation/middle-middle.svg"
                  size="auto"
                  repeat="repeat"
                  position="center"
                  className="w-[calc(100%-64px)] right-1/2 translate-x-1/2 h-[calc(100%-122px)] absolute filter brightness-75"
                />
                <RenderSvg
                  src="desktop-template-creation/middle-right.svg"
                  size="auto"
                  repeat="repeat-y"
                  position="center"
                  className="w-[32px] h-[calc(100%-120px)] absolute top-[56px] right-[8px] filter brightness-75"
                />
              </div>
              <div className="h-[64px] w-full relative">
                <RenderSvg
                  src="desktop-template-creation/bottom-left.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="w-[32px] h-full absolute bottom-0 left-[-3px] filter brightness-75"
                />
                <RenderSvg
                  src="desktop-template-creation/bottom-middle.svg"
                  size="auto"
                  repeat="repeat-x"
                  position="center"
                  className="w-[95%] right-1/2 translate-x-1/2 h-full absolute filter brightness-75"
                />
                <RenderSvg
                  src="desktop-template-creation/bottom-right.svg"
                  size="auto"
                  repeat="no-repeat"
                  position="center"
                  className="w-[32px] h-full absolute bottom-0 right-0 filter brightness-75"
                />
              </div>

              <div className="absolute size-full top-0 right-0 flex justify-center items-center">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <TemplateCreationList
                    exercises={templateExercises}
                    onUpdateNotes={onUpdateNotes}
                    onRemoveExercise={onRemoveExercise}
                    showExerciseInfoById={showExerciseInfoById}
                    setTemplateExercises={setTemplateExercises}
                    templateExercisesHashTable={templateExercisesHashTable}
                  />
                </React.Suspense>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
