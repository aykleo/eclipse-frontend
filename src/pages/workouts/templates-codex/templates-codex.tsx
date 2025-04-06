import React from "react";
import { calculateCategoryCounts } from "../../../components/statistics/exercises/category-counts-type";

import { Template } from "../../../utils/types/template-types";
import { RenderPng } from "../../../components/pixel-art/render-png";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { CategoryCounterVertical } from "../../../components/statistics/exercises/category-counter-vertical";
import { CategoryCounterHorizontal } from "../../../components/statistics/exercises/category-counter-horizontal";

interface TemplateData {
  templates: Template[];
  totalPages: number;
}

interface TemplatesCodexProps {
  templatesData: TemplateData | undefined;
  setSelectedTemplate: (template: Template) => void;
}

export const TemplatesCodex = React.memo(
  ({ templatesData, setSelectedTemplate }: TemplatesCodexProps) => {
    return (
      <>
        {templatesData &&
          templatesData.templates.map((workout: Template) => (
            <div key={workout.id} className="px-1 py-4 relative">
              <RenderSvg
                src="body/body-bot-4.svg"
                size="auto"
                repeat="repeat-x"
                position="center"
                className="absolute left-0 bottom-0 h-1 w-full"
              />

              <RenderSvg
                src="body/body-bot-4.svg"
                size="auto"
                repeat="repeat-x"
                position="center"
                className="absolute left-0 top-0 h-1 w-full"
                transform="rotate(180deg)"
              />
              <div className="size-full hover:bg-neutral-950/60 flex flex-col gap-y-2">
                <span className="text-2xl font-bold text-white w-full text-center">
                  {workout.name}
                </span>
                <div className="flex flex-row justify-between h-max">
                  <div
                    onClick={() => {
                      setSelectedTemplate(workout);
                      console.log(workout);
                    }}
                    className="relative w-[192px] md:h-[256px] cursor-pointer hover:scale-105 transition-all duration-300"
                  >
                    <RenderPng
                      src="exercise-cards/card-backs/exercise-card-back-1.png"
                      alt="card-bg"
                      className="-mt-2 absolute top-0 md:top-6"
                    />
                    <RenderPng
                      src="exercise-cards/card-backs/exercise-card-back-1.png"
                      alt="card-bg"
                      className="-mt-2 absolute -top-1 md:top-4.5"
                    />
                    <RenderPng
                      src="exercise-cards/card-backs/exercise-card-back-1.png"
                      alt="card-bg"
                      className="-mt-2 absolute -top-2 md:top-3"
                    />
                  </div>
                  <div className="w-full h-48 md:hidden">
                    <CategoryCounterVertical
                      categoryCounts={calculateCategoryCounts(workout)}
                      hasCount={false}
                    />
                  </div>
                  <div className="hidden w-full md:grid grid-cols-2">
                    <CategoryCounterHorizontal
                      categoryCounts={calculateCategoryCounts(workout)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  }
);
