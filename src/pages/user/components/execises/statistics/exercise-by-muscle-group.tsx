import { useQuery } from "@tanstack/react-query";
import { handleExerciseByMuscleGroup } from "../../../../../api/statistics/exercises/exercise-by-msucle-group";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router-dom";
import { MessageCircleQuestionIcon } from "lucide-react";
import { useUser } from "../../../../../hooks/user/use-context";

export default function ExerciseByMuscleGroup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const weightParam = searchParams.get("weight") || "0";
  const { user } = useUser() || {};
  const [sliderValue, setSliderValue] = useState(parseInt(weightParam, 10));

  const [debouncedWeight] = useDebounce(sliderValue, 500);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("weight", debouncedWeight.toString());
    setSearchParams(newParams, { replace: true });
  }, [debouncedWeight, setSearchParams, searchParams]);

  useEffect(() => {
    const urlWeight = parseInt(weightParam, 10);
    if (urlWeight !== sliderValue) {
      setSliderValue(urlWeight);
    }
  }, [weightParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: exerciseByMuscleGroupData, isLoading } = useQuery({
    queryKey: ["exerciseByMuscleGroup", { weight: debouncedWeight }],
    queryFn: () => handleExerciseByMuscleGroup(debouncedWeight),
    enabled: !!user,
  });

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const initializeRadarChart = () => {
    if (!chartRef.current || !exerciseByMuscleGroupData) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const sourceData = Object.entries(
      exerciseByMuscleGroupData.exerciseCountsByMuscleGroup
    )
      //@ts-expect-error - count is not defined
      .filter(([, { count }]) => count > 0)
      //@ts-expect-error - count is not defined
      .map(([category, { count }]) => ({
        value: count,
        name: category,
      }));

    const maxCount = Math.max(...sourceData.map((item) => item.value)) || 1;

    const screenWidth = window.innerWidth;
    const radius =
      screenWidth < 768
        ? 100
        : screenWidth > 1600
        ? 180
        : screenWidth > 1200
        ? 160
        : 120;

    const option = {
      color: ["#FF917C"],
      legend: {
        show: false,

        bottom: 0,
        left: 0,
        textStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      },
      radar: [
        {
          indicator: sourceData.map((item) => ({
            name: item.name,
            max: maxCount,
          })),
          center: ["52%", "55%"],
          radius: radius,
          startAngle: 90,
          splitNumber: 4,
          shape: "polygon",
          axisName: {
            formatter: (name: string) => {
              const MAX_LENGTH = 10;
              const formattedName = name
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char: string) => char.toUpperCase());

              const truncatedName =
                formattedName.length > MAX_LENGTH
                  ? `${formattedName.substring(0, MAX_LENGTH)}...`
                  : formattedName;

              const item = sourceData.find((data) => data.name === name);
              const value = item ? item.value : 0;

              return `${truncatedName}\n${value.toFixed(2)}`;
            },
            color: "#f7afd0",
            fontSize: 12,
            fontWeight: "bold",
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(236, 236, 193, 0.05)"],
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
      ],
      series: [
        {
          type: "radar",
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },
          data: [
            {
              value: sourceData.map((item) => item.value),
              name: "Exercise Count",
              areaStyle: {
                color: "rgba(241, 38, 116, 0.459)",
              },
            },
          ],
        },
      ],
    };

    chartInstanceRef.current.setOption(option);
    chartInstanceRef.current.resize();
  };

  useLayoutEffect(() => {
    const resizeChart = () => {
      chartInstanceRef.current?.resize();
    };

    initializeRadarChart();
    window.addEventListener("resize", resizeChart);

    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
      window.removeEventListener("resize", resizeChart);
    };
  }, [exerciseByMuscleGroupData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center p-2 justify-center h-96 lg:h-108">
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <div className="relative size-full flex">
          <div className="absolute right-0 top-0 px-2 z-2 gap-y-2 py-0.5 w-full sm:w-1/2 items-end text-xs text-red-300 gap-x-2 flex flex-col">
            <div className="flex items-center gap-x-2 w-full">
              <span>0</span>
              <input
                type="range"
                min={0}
                max="100"
                value={sliderValue}
                onChange={(e) => {
                  setSliderValue(Number(e.target.value));
                }}
                className="range range-error range-xs w-full"
              />
              <span>100</span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>Weight</span>
              <span>{sliderValue}</span>
              <div
                className="tooltip tooltip-left cursor-help"
                data-tip="This determines how the secondary muscles of each exercise will be counted. 0 means that only the primary muscle will be counted, 100 means that all muscles will be counted fully."
              >
                <MessageCircleQuestionIcon className="size-5 text-gray-400 hover:text-white" />
              </div>
            </div>
          </div>
          <div ref={chartRef} className="size-full" />
        </div>
      )}
    </div>
  );
}
