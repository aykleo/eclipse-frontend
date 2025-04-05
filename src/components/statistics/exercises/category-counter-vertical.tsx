import {
  getColorBackgroundForTagCategory,
  getColorClassForTagCategory,
} from "../../../utils/tag-colors";
import { TagCategory } from "../../../utils/types/exercise-types";
import { RenderSvg } from "../../pixel-art/render-svg";
import { CategoryCounts } from "./category-counts-type";

interface CategoryCounterVerticalProps {
  categoryCounts: CategoryCounts;
  hasCount?: boolean;
}

export const CategoryCounterVertical = ({
  categoryCounts,
  hasCount = true,
}: CategoryCounterVerticalProps) => {
  return (
    <div className="flex flex-col size-full">
      <div className="flex flex-col size-full items-center gap-4 p-4">
        {hasCount && (
          <div className="flex text-lg font-bold flex-row items-center justify-between w-full">
            <span>Exercises in the workout</span>
            <div>{categoryCounts[""]}</div>
          </div>
        )}
        <div className="flex gap-4 flex-row w-full h-full justify-between">
          {Object.entries(categoryCounts).map(
            ([category, count]) =>
              category !== "" && (
                <div
                  key={category}
                  className="flex flex-col items-center w-full"
                >
                  <div className="w-8 bg-neutral-950 h-[calc(100%-16px)] mb-2 flex flex-col justify-end px-1 pb-0.5 relative">
                    {count > 0 && (
                      <div
                        className={`${getColorClassForTagCategory(
                          category as TagCategory
                        )} text-lg font-bold w-full text-center mb-2`}
                      >
                        {count}
                      </div>
                    )}
                    <RenderSvg
                      src={`body/body-chart-top-8.svg`}
                      size="auto"
                      repeat="no-repeat"
                      position="center"
                      className="h-2 w-8 absolute top-[-8px] left-0"
                    />
                    <RenderSvg
                      src={`body/body-chart-top-8.svg`}
                      size="auto"
                      repeat="no-repeat"
                      position="center"
                      className="h-2 w-8 absolute bottom-[-8px] left-0"
                      transform="rotate(180deg)"
                    />
                    <div
                      className={`${getColorBackgroundForTagCategory(
                        category as TagCategory
                      )} h-full w-full text-black relative`}
                      style={{
                        height:
                          count > 0
                            ? `${(count / categoryCounts[""]) * 100}%`
                            : "5px",
                      }}
                    >
                      <RenderSvg
                        src={`body/body-chart-top-${category}-8.svg`}
                        size="28px"
                        repeat="no-repeat"
                        position="center"
                        className="h-2 w-7 absolute top-[-7px] left-[-2px]"
                      />
                      <RenderSvg
                        src={`body/body-chart-top-${category}-8.svg`}
                        size="28px"
                        repeat="no-repeat"
                        position="center"
                        className="h-2 w-7 absolute bottom-[-7px] left-[-2px]"
                        transform="rotate(180deg)"
                      />
                    </div>
                  </div>
                  <RenderSvg
                    src={`buttons/btn-${category.toLowerCase()}.svg`}
                    size="auto"
                    repeat="no-repeat"
                    position="center"
                    className="h-8 w-8"
                  />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};
