import { memo, useLayoutEffect, useRef } from "react";
import { ExerciseByTagData } from "../exercise-page";
import * as echarts from "echarts";

export const ExerciseByTagPie = memo(
  ({ data, isLoading }: { data: ExerciseByTagData; isLoading: boolean }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    const exerciseByTagData = data as ExerciseByTagData;

    const initializePieChart = () => {
      if (!chartRef.current || !exerciseByTagData) return;

      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
      }

      const sourceData = Object.entries(
        exerciseByTagData.exerciseCountsByCategory
      )
        .filter(([, { count }]) => count > 0)
        .map(([category, { count }]) => ({
          value: count,
          name: category,
        }));

      const option = {
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "Exercise Distribution",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: "#00000000",
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{d}%",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "orbitron",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "orbitron",
              },
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 5,
            },
            data: sourceData.map((item) => ({
              ...item,
              itemStyle: {
                color:
                  {
                    TOTAL: "#ebf1ed",
                    ENDURANCE: "#3888f1",
                    MOVEMENT: "#31e771",
                    PLYOMETRICS: "#dfeb39",
                    STRENGTH: "#f13a3a",
                  }[item.name] || "#aaaaaa",
              },
            })),
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

      initializePieChart();
      window.addEventListener("resize", resizeChart);

      return () => {
        chartInstanceRef.current?.dispose();
        chartInstanceRef.current = null;
        window.removeEventListener("resize", resizeChart);
      };
    }, [exerciseByTagData]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div className="flex pt-2.5 w-1/2 h-32 items-center justify-center overflow-x-hidden bg-zinc-950 rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <span className="loading loading-dots loading-xl"></span>
          </div>
        ) : (
          <div ref={chartRef} className="size-full"></div>
        )}
      </div>
    );
  }
);

// ... existing code ...
