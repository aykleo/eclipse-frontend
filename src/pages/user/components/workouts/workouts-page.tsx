import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../hooks/user/use-context";
import { useEffect, useState } from "react";
import { fetchTemplates } from "../../../../api/templates/fetch-templates";
import { Template } from "../../../../utils/types/template-types";
import { TemplateExercise } from "../../../../utils/types/exercise-types";
import { ExerciseCard } from "../../../../components/exercise/exercise-card";

export const WorkoutsPage = () => {
  const { user } = useUser() || {};
  const [currentPage] = useState(1);
  const [, setTotalPages] = useState(0);
  const pageSize = 10;
  const { data: templatesData } = useQuery({
    queryKey: ["templates", { user, currentPage, pageSize }],
    queryFn: () => {
      if (user) {
        return fetchTemplates(currentPage, pageSize, user);
      }
      return Promise.resolve({ templates: [], totalPages: 0 });
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (templatesData) {
      setTotalPages(templatesData.totalPages);
    }
  }, [templatesData]);

  return (
    <div className="size-full pt-16">
      <div className="size-screen flex flex-col gap-y-4 border-8 border-red-500 self-start bg-neutral-800 ">
        <h1 className="text-2xl font-bold text-white">
          {templatesData &&
            templatesData.templates.map((workout: Template) => (
              <div key={workout.id} className="flex flex-col gap-y-4">
                {workout.name}
                <div className="flex flex-wrap gap-x-4">
                  {workout.exercises
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
                    ))}
                </div>
              </div>
            ))}
        </h1>
      </div>
    </div>
  );
};
