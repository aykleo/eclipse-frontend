import { useRef, useLayoutEffect, memo } from "react";
import * as echarts from "echarts";
import { ExerciseByTagData } from "../../../utils/exercise-by-tag-data";
import { SmallLoadingGif } from "../../../components/small-loading-gif";

export const ExerciseByTagBar = memo(
  ({ data, isLoading }: { data: ExerciseByTagData; isLoading: boolean }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    const exerciseByTagData = data as ExerciseByTagData;

    const initializeChart = () => {
      if (!chartRef.current || !exerciseByTagData) return;

      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
      }

      const sourceData = Object.entries(
        exerciseByTagData.exerciseCountsByCategory
      ).map(([category, { count, percentage }]) => [
        percentage,
        count,
        category,
      ]);

      sourceData.push([100, exerciseByTagData.numberOfExercises, "TOTAL"]);

      const option = {
        dataset: {
          source: [["percentage", "count", "category"], ...sourceData],
        },
        grid: {
          left: "2%",
          right: "8%",
          bottom: "3%",
          top: "3%",
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
                STRENGTH: "#f13a3a",
              };
              return colors[value] || "#aaaaaa";
            },
            formatter: (value: string) => {
              const abbreviations: Record<string, string> = {
                TOTAL: "TOT",
                ENDURANCE: "END",
                MOVEMENT: "MOV",
                PLYOMETRICS: "PLY",
                STRENGTH: "STR",
              };
              const isSmallScreen = window.innerWidth <= 768;
              return isSmallScreen ? abbreviations[value] || value : value;
            },
            fontFamily: "orbitron",
            fontSize: 8,
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
                  STRENGTH: "#f13a3a",
                };
                return colors[params.value[2]] || "#aaaaaa";
              },
            },
            label: {
              show: true,
              position: "right",
              fontFamily: "orbitron",
              fontSize: 8,
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
      const resizeChart = () => {
        chartInstanceRef.current?.resize();
      };

      initializeChart();
      window.addEventListener("resize", resizeChart);

      return () => {
        chartInstanceRef.current?.dispose();
        chartInstanceRef.current = null;
        window.removeEventListener("resize", resizeChart);
      };
    }, [exerciseByTagData]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div className="flex py-3 w-full h-40 lg:h-36 px-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <SmallLoadingGif />
          </div>
        ) : (
          <div
            ref={chartRef}
            className="h-full w-full flex items-center justify-center"
          ></div>
        )}
      </div>
    );
  }
);
