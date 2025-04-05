import {
  getColorBackgroundForTagCategory,
  getColorClassForTagCategory,
} from "../../../utils/tag-colors";
import { TagCategory } from "../../../utils/types/exercise-types";
import { RenderSvg } from "../../pixel-art/render-svg";
import { CategoryCounts } from "./category-counts-type";

interface CategoryCounterHorizontalProps {
  categoryCounts: CategoryCounts;
}

export const CategoryCounterHorizontal = ({
  categoryCounts,
}: CategoryCounterHorizontalProps) => {
  return (
    <>
      {Object.entries(categoryCounts).map(
        ([category, count]) =>
          category !== "" && (
            <div key={category} className="flex flex-row items-center w-full">
              <RenderSvg
                src={`buttons/btn-${category.toLowerCase()}.svg`}
                size="auto"
                repeat="no-repeat"
                position="center"
                className="h-8 w-8"
              />
              <div className="w-[calc(80%-16px)] bg-neutral-950 h-6 ml-2 flex flex-row items-center py-[4px] justify-start pl-0.5 relative">
                <RenderSvg
                  src={`body/body-chart-top-8.svg`}
                  size="24px"
                  repeat="no-repeat"
                  position="center"
                  className="h-2 w-6 absolute top-[8px] right-[-15px]"
                  transform="rotate(90deg)"
                />
                <RenderSvg
                  src={`body/body-chart-top-8.svg`}
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
                    src={`body/body-chart-top-${category}-8.svg`}
                    size="18px"
                    repeat="no-repeat"
                    position="center"
                    className="h-2 w-5 absolute top-[4px] left-[-13px]"
                    transform="rotate(270deg)"
                  />
                  <RenderSvg
                    src={`body/body-chart-top-${category}-8.svg`}
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
    </>
  );
};
