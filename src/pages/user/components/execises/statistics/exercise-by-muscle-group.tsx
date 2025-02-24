import { useQuery } from "@tanstack/react-query";
import { handleExerciseByMuscleGroup } from "../../../../../api/statistics/exercises/exercise-by-msucle-group";
import { useLayoutEffect, useRef } from "react";
import * as echarts from "echarts";

export default function ExerciseByMuscleGroup() {
  const { data: exerciseByMuscleGroupData, isLoading } = useQuery({
    queryKey: ["exerciseByMuscleGroup"],
    queryFn: () => handleExerciseByMuscleGroup(100),
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

    const option = {
      color: ["#FF917C"],
      // title: {
      //   text: "Exercise by Muscle Group",
      //   textStyle: {
      //     color: "#F4F4F5",
      //     fontSize: 14,
      //     fontWeight: "bold",
      //     fontFamily: "orbitron",
      //   },
      // },
      legend: { show: false },
      radar: [
        {
          indicator: sourceData.map((item) => ({
            text: item.name,
            max: maxCount,
          })),
          center: ["52%", "55%"],
          radius: 140,
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

              return `${truncatedName}\n${value}`;
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
    <div className="flex items-center p-2 justify-center bg-zinc-950 rounded-lg h-full w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <div ref={chartRef} className="size-full" />
      )}
    </div>
  );
}
