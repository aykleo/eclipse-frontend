import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/use-context";
import { useEffect } from "react";
import { useState } from "react";
import { fetchTemplates } from "../../api/templates/fetch-templates";
import { TemplatesCodex } from "./templates-codex/templates-codex";
import { useSearchParams } from "react-router-dom";
import { TemplatesCodexSelector } from "./templates-codex/codex-selector";

export const WorkoutsPage = () => {
  const { user } = useUser() || {};
  const [currentPage] = useState(1);
  const [, setTotalPages] = useState(0);
  const pageSize = 10;
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

  return (
    <div className="size-full mt-16">
      <div className="w-full fixed z-49">
        <TemplatesCodexSelector setSearchParams={setSearchParams} />
      </div>

      <div className="size-screen flex flex-col lg:grid lg:grid-cols-2 pt-12 bg-neutral-950/50 py-1">
        <TemplatesCodex templatesData={templatesData} />
      </div>
    </div>
  );
};
