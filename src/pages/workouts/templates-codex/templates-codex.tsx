import React from "react";
import { calculateCategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { Template } from "../../../utils/types/template-types";
import { RenderPng } from "../../../components/pixel-art/render-png";
import { CategoryCounterVertical } from "../../../components/statistics/exercises/category-counter-vertical";
import { CategoryCounterHorizontal } from "../../../components/statistics/exercises/category-counter-horizontal";
import { BodyGeneral } from "../../../components/body-general";

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
            <div key={workout.id} className="px-1 py-4">
              <div className="size-full flex flex-col gap-y-2">
                <div className="flex flex-row justify-between h-max items-center">
                  <div
                    onClick={() => {
                      setSelectedTemplate(workout);
                    }}
                    className="relative w-[256px] h-[192px] cursor-pointer hover:scale-105 transition-all duration-300 z-2"
                  >
                    <RenderPng
                      src="exercise-cards/card-pocket-256.png"
                      alt="card-pocket"
                      className="absolute top-0 size-full flex items-center justify-center"
                    />
                    <span className="top-24 md:top-25 pl-4.5 pr-3.5 md:pl-5 md:pr-4 pt-1 h-8 truncate absolute text-xl font-bold text-neutral-950 w-full text-center">
                      {workout.name}
                    </span>
                  </div>
                  <BodyGeneral className="w-full mt-3 -ml-4 h-36 md:hidden bg-gradient-to-b from-red-950/50 via-red-950/35  to-red-950/50">
                    <CategoryCounterVertical
                      categoryCounts={calculateCategoryCounts(workout)}
                      hasCount={false}
                    />
                  </BodyGeneral>

                  <BodyGeneral className="pl-4 mt-3 -ml-4 hidden w-full h-36 md:grid grid-cols-2 bg-gradient-to-r from-red-950/50 via-red-950/35 to-red-950/50">
                    <CategoryCounterHorizontal
                      categoryCounts={calculateCategoryCounts(workout)}
                    />
                  </BodyGeneral>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  }
);
