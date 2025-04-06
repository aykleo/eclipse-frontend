import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { RenderSvg } from "../../../components/pixel-art/render-svg";

import { SearchInput } from "../../../components/search-input";

interface TemplatesCodexSelectorProps {
  setSearchParams: (
    params: (prev: URLSearchParams) => URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
}

export const TemplatesCodexSelector: React.FC<TemplatesCodexSelectorProps> =
  React.memo(({ setSearchParams }) => {
    const [searchTerm, setSearchTerm] = useState(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get("templateName") || "";
    });
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    useEffect(() => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (debouncedSearchTerm) {
            newParams.set("templateName", debouncedSearchTerm);
          } else {
            newParams.delete("templateName");
          }
          return newParams;
        },
        { replace: true }
      );
    }, [debouncedSearchTerm, setSearchParams]);

    return (
      <div className="relative h-12">
        <RenderSvg
          src="body/body-64.svg"
          size="48px"
          repeat="repeat"
          position="center"
          role="tablist"
          className="relative flex items-center w-full flex-row h-full rounded-none"
        >
          <SearchInput setSearchTerm={setSearchTerm} />
        </RenderSvg>
      </div>
    );
  });
