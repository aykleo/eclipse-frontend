import React, { useEffect, useRef } from "react";
import { Template } from "../../../utils/types/template-types";
import { TemplateExercise } from "../../../utils/types/exercise-types";
import { ExerciseCard } from "../../../components/exercise/exercise-card";
import { CategoryCounterVertical } from "../../../components/statistics/exercises/category-counter-vertical";
import { calculateCategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { CategoryCounterHorizontal } from "../../../components/statistics/exercises/category-counter-horizontal";
import { useTemplate } from "../../../hooks/templates/template-context";
import { useNavigate } from "react-router-dom";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";

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
      <div className="border size-full">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-4 justify-items-center items-start w-full">
          {template.exercises
            .slice()
            .sort(
              (a: TemplateExercise, b: TemplateExercise) => a.order - b.order
            )
            .map((exercise: TemplateExercise) => (
              <div key={exercise.exercise.id}>
                {exercise.order}
                <ExerciseCard exercise={exercise.exercise} />
                {!exercise.notes ? (
                  <span>No notes</span>
                ) : (
                  <span>{exercise.notes}</span>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  }
);

export default TemplateInfo;
