import React from "react";

interface ExercisePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const ExercisePaginationComponent: React.FC<ExercisePaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="join w-full px-2 flex items-center text-lg absolute bottom-1.5 opacity-100 backdrop-blur-3xl">
      <button
        className="join-item btn w-1/5"
        onClick={() => {
          if (currentPage > 5) {
            setCurrentPage(currentPage - 5);
          }
        }}
        disabled={currentPage <= 5}
      >
        ««
      </button>
      <button
        className="join-item btn w-1/5"
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
        disabled={currentPage === 1}
      >
        «
      </button>
      <span className="join-item btn w-1/5 cursor-default">{currentPage}</span>
      <button
        className="join-item btn w-1/5"
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        disabled={currentPage === totalPages}
      >
        »
      </button>
      <button
        className="join-item btn w-1/5"
        onClick={() => {
          if (currentPage <= totalPages - 5) {
            setCurrentPage(currentPage + 5);
          }
        }}
        disabled={currentPage >= totalPages - 5}
      >
        »»
      </button>
    </div>
  );
};

export const ExercisePagination = ExercisePaginationComponent;
