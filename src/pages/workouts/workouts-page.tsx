import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/use-context";
import { useEffect } from "react";
import { useState } from "react";
import { fetchTemplates } from "../../api/templates/fetch-templates";
import { TemplatesCodex } from "./templates-codex/templates-codex";

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
      <div className="size-screen flex flex-col gap-y-1 bg-black py-1">
        <TemplatesCodex templatesData={templatesData} />
      </div>
    </div>
  );
};
