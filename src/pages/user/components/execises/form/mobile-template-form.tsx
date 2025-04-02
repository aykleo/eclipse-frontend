import { RefObject, useEffect, useRef, useState } from "react";
import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";
import { useMutation } from "@tanstack/react-query";
import { TemplateFormData } from "../../../../../api/templates/fetch-create-update-template";
import { handleTemplateCreation } from "../../../../../api/templates/template-creation";
import React from "react";
import { useStatus } from "../../../../../hooks/status/status-context";
import { MobileTemplateItem } from "../../template/mobile-template-item";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { RenderSvg } from "../../../../../components/pixel-art/render-svg";
import { Input } from "../../../../../components/forms/input";
import { CategoryCounts } from "./desktop-template-creation-list";
import {
  getColorClassForTagCategory,
  getColorBackgroundForTagCategory,
} from "../../../../../utils/tag-colors";
import { TagCategory } from "../../../../../utils/types/exercise-types";

interface MobileTemplateFormProps {
  templateExercises: TemplateExercise[];
  setTemplateExercises: React.Dispatch<
    React.SetStateAction<TemplateExercise[]>
  >;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
  showExerciseInfoById: (exerciseId: string) => void;
  templateExercisesHashTable: RefObject<{ [key: string]: Exercise }>;
}

const MobileTemplateForm = React.memo(
  ({
    templateExercises,
    setTemplateExercises,
    onUpdateNotes,
    onRemoveExercise,
    setIsCreatingTemplate,
    showExerciseInfoById,
    templateExercisesHashTable,
  }: MobileTemplateFormProps) => {
    const [templateName, setTemplateName] = useState<string>("");
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [templateInfo, setTemplateInfo] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { setStatusText } = useStatus();
    const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({
      "": 0,
      ENDURANCE: 0,
      MOVEMENT: 0,
      PLYOMETRICS: 0,
      STRENGTH: 0,
    });

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = templateExercises.findIndex(
          (exercise) => exercise.exerciseId === active.id
        );
        const newIndex = templateExercises.findIndex(
          (exercise) => exercise.exerciseId === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          setTemplateExercises(
            arrayMove(templateExercises, oldIndex, newIndex)
          );
        }
      }
    };

    const createTemplateMutation = useMutation({
      mutationFn: async (formData: TemplateFormData) => {
        return await handleTemplateCreation(
          formData,
          setIsLoading,
          setTemplateExercises
        );
      },
      onSuccess: () => {
        setTemplateName("");
        setTemplateExercises([]);
        setShowNameInput(false);
        if (formRef.current) {
          formRef.current.reset();
        }
      },
      onError: (error: Error) => {
        setStatusText(`${error.message}`);
        const timeout = setTimeout(() => {
          setStatusText(null);
        }, 3000);
        return () => clearTimeout(timeout);
      },
    });

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const formData = {
        name: templateName,
        exercises: templateExercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          notes: exercise.notes || "",
        })),
      };

      await createTemplateMutation.mutateAsync(formData);
      setIsCreatingTemplate(false);
    };

    const toggleNameInput = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setTemplateInfo(false);
      setShowNameInput((prev) => !prev);
    };

    const toggleTemplateInfo = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowNameInput(false);
      setTemplateInfo((prev) => !prev);
    };

    const countCategories = (
      templateExercisesHashTable: RefObject<{ [key: string]: Exercise }>
    ) => {
      const counts: CategoryCounts = {
        "": 0,
        ENDURANCE: 0,
        MOVEMENT: 0,
        PLYOMETRICS: 0,
        STRENGTH: 0,
      };

      Object.values(templateExercisesHashTable.current).forEach((exercise) => {
        const category = exercise.tag.category as keyof CategoryCounts;
        if (counts[category] !== undefined) {
          counts[category]++;
        }
        counts[""]++;
      });

      setCategoryCounts(counts);
    };

    useEffect(() => {
      countCategories(templateExercisesHashTable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateExercises]);

    return (
      <RenderSvg
        src="url(src/assets/pixel-art/body/body-96.svg)"
        size="auto"
        repeat="repeat"
        position="center"
        className="relative w-9/10 p-1 h-24"
      >
        <RenderSvg
          src="url(src/assets/pixel-art/body/body-side-96.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="absolute top-0 h-full -left-1.5 w-2"
        />
        <RenderSvg
          src="url(src/assets/pixel-art/body/body-side-96.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="absolute top-0 h-full -right-1.5 w-2"
          transform="rotate(180deg)"
        />
        <form
          action="create_template"
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div
            className={`${
              showNameInput ? "block" : "hidden"
            }  h-22 w-full flex items-center justify-center p-2`}
          >
            <Input
              type="text"
              name="templateName"
              className=""
              placeholder="Workout name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div
            className={`${
              templateInfo ? "block" : "hidden"
            }  h-22 w-full  grid grid-cols-2`}
          >
            {Object.entries(categoryCounts).map(
              ([category, count]) =>
                category !== "" && (
                  <div
                    key={category}
                    className="flex flex-row items-center w-full"
                  >
                    <RenderSvg
                      src={`url(src/assets/pixel-art/buttons/btn-${category.toLowerCase()}.svg)`}
                      size="auto"
                      repeat="no-repeat"
                      position="center"
                      className="h-8 w-8"
                    />
                    <div className="w-[calc(80%-16px)] bg-neutral-950 h-6 ml-2 flex flex-row items-center py-[4px] justify-start pl-0.5 relative">
                      <RenderSvg
                        src={`url(src/assets/pixel-art/body/body-chart-top-8.svg)`}
                        size="24px"
                        repeat="no-repeat"
                        position="center"
                        className="h-2 w-6 absolute top-[8px] right-[-15px]"
                        transform="rotate(90deg)"
                      />
                      <RenderSvg
                        src={`url(src/assets/pixel-art/body/body-chart-top-8.svg)`}
                        size="24px"
                        repeat="no-repeat"
                        position="center"
                        className="h-2 w-6 absolute top-[8px] left-[-15px]"
                        transform="rotate(270deg)"
                      />
                      <div
                        className={`${getColorBackgroundForTagCategory(
                          category as TagCategory
                        )} h-full w-full text-black relative`}
                        style={{
                          width:
                            count > 0
                              ? `${(count / categoryCounts[""]) * 100}%`
                              : "5px",
                        }}
                      >
                        <RenderSvg
                          src={`url(src/assets/pixel-art/body/body-chart-top-${category}-8.svg)`}
                          size="18px"
                          repeat="no-repeat"
                          position="center"
                          className="h-2 w-5 absolute top-[4px] left-[-13px]"
                          transform="rotate(270deg)"
                        />
                        <RenderSvg
                          src={`url(src/assets/pixel-art/body/body-chart-top-${category}-8.svg)`}
                          size="18px"
                          repeat="no-repeat"
                          position="center"
                          className="h-2 w-5 absolute top-[4px] right-[-13px]"
                          transform="rotate(90deg)"
                        />
                      </div>
                      {count > 0 && (
                        <div
                          className={`${getColorClassForTagCategory(
                            category as TagCategory
                          )} text-sm font-bold text-center ml-2`}
                        >
                          {count}
                        </div>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>

          {!showNameInput && !templateInfo && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full flex items-center h-22  flex-row gap-x-4 overflow-x-auto overflow-y-hidden no-scrollbar px-3 py-2">
                <SortableContext
                  items={templateExercises.map((e) => e.exerciseId)}
                  strategy={horizontalListSortingStrategy}
                >
                  {templateExercises.map((exercise, index) => (
                    <MobileTemplateItem
                      key={exercise.exerciseId}
                      exerciseId={exercise.exerciseId}
                      notes={exercise.notes}
                      exerciseName={exercise.name}
                      exerciseOrder={index + 1}
                      onUpdateNotes={(notes) =>
                        onUpdateNotes(exercise.exerciseId, notes)
                      }
                      onRemoveExercise={onRemoveExercise}
                      showExerciseInfoById={showExerciseInfoById}
                    />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          )}

          <RenderSvg
            src="url(src/assets/pixel-art/body/body-64.svg)"
            size="48px"
            repeat="repeat"
            position="center"
            className="w-max px-4 left-1/2 translate-x-[-50%] h-12 absolute bottom-24 flex flex-row gap-x-2 items-center justify-evenly"
          >
            <RenderSvg
              src="url(src/assets/pixel-art/body/body-side-64.svg)"
              size="15px"
              repeat="no-repeat"
              position="center"
              className="absolute h-full w-12 -left-5"
            />
            <RenderSvg
              src="url(src/assets/pixel-art/body/body-side-64.svg)"
              size="15px"
              repeat="no-repeat"
              position="center"
              className="absolute h-full w-12 -right-5"
              transform="rotate(180deg)"
            />

            <button
              type="button"
              className=""
              disabled={isLoading}
              onClick={toggleNameInput}
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-pen-32.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className={`${
                  templateName.length < 5 && "animate-pulse"
                } size-8 cursor-pointer`}
              />
            </button>

            <button
              type="button"
              className="filter brightness-75"
              disabled={isLoading}
              onClick={toggleTemplateInfo}
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-chart.32.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className="size-8 cursor-pointer"
              />
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                templateExercises.length === 0 ||
                templateName.length < 5
              }
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-submit.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className={`filter ${
                  templateName.length > 5 && templateExercises.length > 0
                    ? "brightness-100"
                    : "brightness-50"
                } h-8 w-24 flex items-center justify-center cursor-pointer pb-0.5`}
              >
                {isLoading ? "Creating..." : "Create"}
              </RenderSvg>
            </button>

            <button
              type="button"
              className={`filter ${
                isLoading || templateExercises.length === 0
                  ? "brightness-50"
                  : "brightness-100"
              } `}
              disabled={isLoading || templateExercises.length === 0}
              onClick={(e) => {
                e.preventDefault();
                onRemoveExercise("all");
                setTemplateName("");
              }}
            >
              <RenderSvg
                src="url(src/assets/pixel-art/buttons/btn-eraser-32.svg)"
                size="auto"
                repeat="no-repeat"
                position="center"
                className="size-8 cursor-pointer"
              />
            </button>
          </RenderSvg>
        </form>
      </RenderSvg>
    );
  }
);

export default MobileTemplateForm;
