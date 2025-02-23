import { useQuery } from "@tanstack/react-query";
import { handleExerciseByTag } from "../../../../../api/statistics/exercises/exercise-by-tag";
import { useRef, useLayoutEffect, memo } from "react";
import * as echarts from "echarts";

type ExerciseByTagData = {
  exerciseCountsByCategory: Record<
    string,
    { count: number; percentage: number }
  >;
  numberOfExercises: number;
};

export const ExerciseByTag = memo(() => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["exerciseByTag"],
    queryFn: () => handleExerciseByTag(),
  });

  const exerciseByTagData = data as ExerciseByTagData;

  const initializeChart = () => {
    if (!chartRef.current || !exerciseByTagData) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const sourceData = Object.entries(
      exerciseByTagData.exerciseCountsByCategory
    ).map(([category, { count, percentage }]) => [percentage, count, category]);

    sourceData.push([100, exerciseByTagData.numberOfExercises, "TOTAL"]);

    const option = {
      dataset: {
        source: [["percentage", "count", "category"], ...sourceData],
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "10%",
        top: "10%",
        containLabel: true,
      },
      xAxis: { type: "value", show: false },
      yAxis: {
        type: "category",
        axisLabel: {
          color: (value: string) => {
            const colors: Record<string, string> = {
              TOTAL: "#ebf1ed",
              ENDURANCE: "#3888f1",
              MOVEMENT: "#31e771",
              PLYOMETRICS: "#dfeb39",
              STRENGTH: "#f13a77",
            };
            return colors[value] || "#aaaaaa";
          },
          fontFamily: "orbitron",
          fontSize: 10,
          fontWeight: "bold",
        },
      },
      series: [
        {
          type: "bar",
          encode: { x: "count", y: "category" },
          itemStyle: {
            color: (params: { value: [number, number, string] }) => {
              const colors: Record<string, string> = {
                TOTAL: "#ebf1ed",
                ENDURANCE: "#3888f1",
                MOVEMENT: "#31e771",
                PLYOMETRICS: "#dfeb39",
                STRENGTH: "#f13a77",
              };
              return colors[params.value[2]] || "#aaaaaa";
            },
          },
          label: {
            show: true,
            position: "insideRight",
            fontFamily: "orbitron",
            fontSize: 12,
            fontWeight: "bold",
          },
          barWidth: "80%",
        },
      ],
    };

    chartInstanceRef.current.setOption(option);
    chartInstanceRef.current.resize();
  };

  useLayoutEffect(() => {
    initializeChart();
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [exerciseByTagData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="chart-container w-full h-36 overflow-x-hidden">
      <div ref={chartRef} className="h-full max-w-full"></div>
    </div>
  );
});
