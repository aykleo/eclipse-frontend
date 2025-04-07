import React, { useEffect, useRef } from "react";
import { Template } from "../../../utils/types/template-types";
import { TemplateExercise } from "../../../utils/types/exercise-types";
import { ExerciseCard } from "../../../components/exercise/exercise-card";
import { CategoryCounterVertical } from "../../../components/statistics/exercises/category-counter-vertical";
import { calculateCategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { CategoryCounterHorizontal } from "../../../components/statistics/exercises/category-counter-horizontal";
import { useTemplate } from "../../../hooks/templates/template-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { DeleteModal } from "../../../components/modals/delete-modal";
import { RenderSvg } from "../../../components/pixel-art/render-svg";

interface TemplateInfoProps {
  template: Template;
  setSelectedTemplate: (template: Template | null) => void;
}

const TemplateInfo = React.memo(
  ({ template, setSelectedTemplate }: TemplateInfoProps) => {
    const templateRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { setIsCreatingTemplate } = useExerciseState();
    const { setTemplateForUpdate } = useTemplate();
    const [, setSearchParams] = useSearchParams();

    function updateTemplate() {
      navigate("/exercises");
      setIsCreatingTemplate(true);
      setTemplateForUpdate(template);
    }

    useEffect(() => {
      if (templateRef.current) {
        templateRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [template]);

    return (
      <div className="size-full">
        <div ref={templateRef}>
          {template.name}{" "}
          <div
            onClick={() => {
              setSelectedTemplate(null);
            }}
          >
            sair
          </div>
          <div onClick={updateTemplate} className="text-white text-sm">
            update
          </div>
          <div
            onClick={() => {
              setSearchParams(
                (prev) => {
                  prev.set("templateId", template.id);
                  prev.set("templateToDeleteName", template.name);
                  return prev;
                },
                { replace: true }
              );
              const modal = document.getElementById(
                "delete_template_modal"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
          >
            delete
          </div>
        </div>
        <div className="w-full h-48 md:hidden">
          <CategoryCounterVertical
            categoryCounts={calculateCategoryCounts(template)}
            hasCount={false}
          />
        </div>
        <div className="hidden w-full h-48 md:grid grid-cols-2 pl-6">
          <CategoryCounterHorizontal
            categoryCounts={calculateCategoryCounts(template)}
          />
        </div>
        <div className="grid grid-cols-2  lg:grid-cols-3 2xl:grid-cols-4 gap-y-4 justify-items-center items-start w-full">
          {template.exercises
            .slice()
            .sort(
              (a: TemplateExercise, b: TemplateExercise) => a.order - b.order
            )
            .map((exercise: TemplateExercise) => (
              <div
                key={exercise.exercise.id}
                className="flex flex-col md:flex-row gap-2 items-center h-full"
              >
                <div className="relative">
                  <RenderSvg
                    src="exercise-cards/order-marker-32.svg"
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="absolute top-0.5 right-0 size-8 z-2 flex items-center justify-center filter brightness-80 text-xl"
                  >
                    {exercise.order}
                  </RenderSvg>
                  <ExerciseCard exercise={exercise.exercise} />
                </div>
                {!exercise.notes ? (
                  <span className="text-center md:h-full md:w-52 w-full p-2 h-max overflow-y-auto md:max-h-64 max-h-40">
                    No notes
                  </span>
                ) : (
                  <span className="text-center md:h-full md:w-52 w-full p-2 h-max overflow-y-auto no-scrollbar md:max-h-64 max-h-40">
                    {exercise.notes}
                  </span>
                )}
              </div>
            ))}
        </div>
        <DeleteModal
          type="template"
          setSelectedTemplate={setSelectedTemplate}
        />
      </div>
    );
  }
);

export default TemplateInfo;
