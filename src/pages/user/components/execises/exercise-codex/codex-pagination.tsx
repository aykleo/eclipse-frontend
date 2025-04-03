import React from "react";
import { RenderSvg } from "../../../../../components/pixel-art/render-svg";
import { useExerciseState } from "../../../../../hooks/exercises/exercise-context";

interface CodexPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const CodexPaginationComponent: React.FC<CodexPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const { isCreatingTemplate } = useExerciseState();

  return (
    <>
      <RenderSvg
        src="url(src/assets/pixel-art/buttons/btn-32.svg)"
        size="auto"
        repeat="no-repeat"
        position="start"
        className={`sticky ${
          !isCreatingTemplate ? "left-2" : "left-2 lg:left-3"
        } z-1 top-1/2 translate-y-1/2 size-8 pb-[2px] ${
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
          src="url(src/assets/pixel-art/buttons/btn-next-32.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-full"
          transform="rotate(180deg)"
        />
      </RenderSvg>
      <RenderSvg
        src="url(src/assets/pixel-art/buttons/btn-32.svg)"
        size="auto"
        repeat="no-repeat"
        position="start"
        className={`sticky ${
          !isCreatingTemplate
            ? "left-[calc(100%-2.5rem)]"
            : "left-[calc(100%-2.5rem)] lg:left-[calc(100%-24rem)]"
        } z-1 top-1/2 translate-y-1/2 size-8 pb-[2px] ${
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
          src="url(src/assets/pixel-art/buttons/btn-next-32.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className="size-full"
        />
      </RenderSvg>
    </>
  );
};

export const CodexPagination = React.memo(CodexPaginationComponent);
