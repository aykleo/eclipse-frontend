import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { SearchInput } from "../../../components/search-input";

interface TemplatesCodexSelectorProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearchParams: (
    params: (prev: URLSearchParams) => URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
}

export const TemplatesCodexSelector: React.FC<TemplatesCodexSelectorProps> =
  React.memo(({ setSearchParams, currentPage, totalPages, setCurrentPage }) => {
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
          className="relative flex items-center w-full flex-row h-full justify-between px-2"
        >
          <SearchInput width="w-1/2 md:w-[75%]" setSearchTerm={setSearchTerm} />
          <RenderSvg
            src="buttons/btn-32.svg"
            size="auto"
            repeat="no-repeat"
            position="start"
            className={`size-8 pb-[2px] ${
              currentPage === 1
                ? "brightness-50 cursor-default"
                : "cursor-pointer brightness-100 hover:brightness-125"
            } filter  duration-200`}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            <RenderSvg
              src="buttons/btn-next-32.svg"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-full"
              transform="rotate(180deg)"
            />
          </RenderSvg>
          <span className="text-xs md:text-md lg:text-xl">
            Current page {currentPage}
          </span>
          <RenderSvg
            src="buttons/btn-32.svg"
            size="auto"
            repeat="no-repeat"
            position="start"
            className={`size-8 pb-[2px] ${
              currentPage === totalPages
                ? "brightness-50 cursor-default"
                : "cursor-pointer brightness-100 hover:brightness-125"
            } filter duration-200`}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            <RenderSvg
              src="buttons/btn-next-32.svg"
              size="auto"
              repeat="no-repeat"
              position="center"
              className="size-full"
            />
          </RenderSvg>
        </RenderSvg>
      </div>
    );
  });
