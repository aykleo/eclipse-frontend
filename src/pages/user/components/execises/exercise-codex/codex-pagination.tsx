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
        className="absolute -left-1 -bottom-2.5 size-max p-2 rounded-full bg-neutral-950 shadow-sm shadow-red-500 text-white flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="size-4 text-red-300" />
      </button>
      <span
        style={{
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
        className="bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-950 text-white flex items-center justify-center size-8 cursor-default absolute -bottom-2.5"
      >
        {currentPage}
      </span>
      <button
        className="absolute -right-1 -bottom-2.5 size-max p-2 rounded-full bg-neutral-950 shadow-sm shadow-red-500 text-white flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="size-4 text-red-300" />
      </button>
    </>
  );
};

export const CodexPagination = CodexPaginationComponent;
