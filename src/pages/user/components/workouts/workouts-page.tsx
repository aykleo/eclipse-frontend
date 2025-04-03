import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../hooks/user/use-context";
import { useEffect, useState } from "react";
import { fetchTemplates } from "../../../../api/templates/fetch-templates";

export const WorkoutsPage = () => {
  const { user } = useUser() || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["templates", { user }],
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
    <div className="size-full border-8 border-red-500 self-start bg-blue-400">
      <div className="size-full flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold text-white">Workouts</h1>
      </div>
    </div>
  );
};
