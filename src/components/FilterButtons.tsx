import React from "react";
import { Filter } from "../redux/todoSlice";

interface FilterButtonsProps {
  currentFilter: Filter;
  onFilterChange: (newFilter: Filter) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex justify-start my-4 space-x-4">
      <button
        onClick={() => onFilterChange("all")}
        className={`px-4 py-2 ${
          currentFilter === "all"
            ? "border-2 border-blue-600 text-blue-600 bg-white rounded-full"
            : "text-slate-500 bg-white"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange("pending")}
        className={`px-4 py-2 ${
          currentFilter === "pending"
            ? "border-2 border-blue-600 text-blue-600 bg-white rounded-full"
            : "text-slate-500 bg-white"
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => onFilterChange("completed")}
        className={`px-4 py-2 ${
          currentFilter === "completed"
            ? "border-2 border-blue-500 text-blue-500 bg-white rounded-full"
            : "text-slate-500 bg-white"
        }`}
      >
        Completed
      </button>
    </div>
  );
};

export default FilterButtons;
