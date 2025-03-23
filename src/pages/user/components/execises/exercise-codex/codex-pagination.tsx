import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

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
  return (
    <>
      <button
        className="absolute left-2 md:-left-0 lg:left-1 top-4 lg:top-16 size-max p-2 rounded-full bg-neutral-950 border-b border-b-neutral-600/50 text-white flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="size-4 " />
      </button>
      <span
        style={{
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
        className="absolute bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-950 text-white flex items-center justify-center size-8 cursor-default -bottom-2.5"
      >
        {currentPage}
      </span>
      <button
        className="absolute right-2 md:-right-0 lg:-right-4 top-4 lg:top-16 size-max p-2 rounded-full bg-neutral-950 border-b border-b-neutral-600/50 text-white flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="size-4 " />
      </button>
    </>
  );
};

export const CodexPagination = React.memo(CodexPaginationComponent);
