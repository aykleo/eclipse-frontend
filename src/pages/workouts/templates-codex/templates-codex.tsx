import { CategoryCounts } from "../../../components/statistics/exercises/category-counts-type";
import { TemplateExercise } from "../../../utils/types/exercise-types";
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
}

export const TemplatesCodex = ({ templatesData }: TemplatesCodexProps) => {
  const defaultCounts: CategoryCounts = {
    "": 0,
    ENDURANCE: 0,
    MOVEMENT: 0,
    PLYOMETRICS: 0,
    STRENGTH: 0,
  };

  const calculateCategoryCounts = (workout: Template): CategoryCounts => {
    const counts = { ...defaultCounts };

    if (!workout.exercises) return counts;

    counts[""] = workout.exercises.length;

    workout.exercises.forEach((exerciseItem: TemplateExercise) => {
      if (
        exerciseItem.exercise &&
        exerciseItem.exercise.tag &&
        exerciseItem.exercise.tag.category
      ) {
        const category = exerciseItem.exercise.tag.category;
        if (category in counts) {
          counts[category as keyof CategoryCounts] += 1;
        }
      }
    });

    return counts;
  };

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
                <div className="relative w-[192px] md:h-[256px]">
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
                {/* {workout.exercises
              .slice()
              .sort(
                (a: TemplateExercise, b: TemplateExercise) =>
                  a.order - b.order
              )
              .map((exercise: TemplateExercise) => (
                <div key={exercise.exerciseId}>
                  {exercise.notes}
                  <ExerciseCard exercise={exercise.exercise} />
                </div>
              ))} */}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
