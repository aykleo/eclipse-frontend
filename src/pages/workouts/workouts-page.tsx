import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/use-context";
import { useState, lazy, useEffect } from "react";
import { fetchTemplates } from "../../api/templates/fetch-templates";
import { TemplatesCodex } from "./templates-codex/templates-codex";
import { useSearchParams } from "react-router-dom";
import { TemplatesCodexSelector } from "./templates-codex/codex-selector";
import { useExerciseState } from "../../hooks/exercises/exercise-context";
import { Template } from "../../utils/types/template-types";

const TemplateInfo = lazy(() => import("./templates-codex/template-info"));

export const WorkoutsPage = () => {
  const { showExerciseInfo } = useExerciseState();
  const { user } = useUser() || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const templateName = searchParams.get("templateName") || "";
  const { data: templatesData } = useQuery({
    queryKey: ["templates", { user, currentPage, pageSize, templateName }],
    queryFn: () => {
      if (user) {
        return fetchTemplates(currentPage, pageSize, user, templateName);
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

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  return (
    <div className={`${showExerciseInfo ? "hidden" : ""} size-full mt-16`}>
      <div className="w-full fixed z-49">
        <TemplatesCodexSelector
          setSearchParams={setSearchParams}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {!selectedTemplate ? (
        <div className="size-screen flex flex-col lg:grid lg:grid-cols-2 mt-10 bg-neutral-950/50 py-1">
          <TemplatesCodex
            templatesData={templatesData}
            setSelectedTemplate={setSelectedTemplate}
          />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col mt-10 bg-neutral-950/50 py-1">
          <TemplateInfo
            template={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        </div>
      )}
    </div>
  );
};
