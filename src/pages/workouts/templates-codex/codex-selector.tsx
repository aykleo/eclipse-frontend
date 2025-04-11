import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { SearchInput } from "../../../components/search-input";
import { Template } from "../../../utils/types/template-types";
import { SmallLoadingGif } from "../../../components/small-loading-gif";
import { Selector } from "../../../components/ui/selector";
interface TemplatesCodexSelectorProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearchParams: (
    params: (prev: URLSearchParams) => URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
  selectedTemplate: Template | null;
}

export const TemplatesCodexSelector: React.FC<TemplatesCodexSelectorProps> =
  React.memo(
    ({
      setSearchParams,
      currentPage,
      totalPages,
      setCurrentPage,
      selectedTemplate,
    }) => {
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
          <Selector className="backdrop-blur-3xl z-99 bg-gradient-to-r from-transparent via-dark-neutral to-transparent relative flex items-center w-full flex-row h-full ">
            {!selectedTemplate ? (
              <>
                <SearchInput
                  width="w-1/2 md:w-[75%]"
                  setSearchTerm={setSearchTerm}
                />
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
                <span className="text-xs md:text-md lg:text-lg xl:text-xl">
                  You are in page {currentPage} of {totalPages}
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
              </>
            ) : (
              //TODO: Add a gif here
              <div className="w-full flex items-center justify-center">
                <SmallLoadingGif />
              </div>
            )}
          </Selector>
        </div>
      );
    }
  );
