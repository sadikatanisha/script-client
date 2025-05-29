import React from "react";
import { FaStar } from "react-icons/fa";

const FilterSection = ({
  title,
  options = [],
  selected,
  onChange,
  type,
  min,
  max,
  value,
}) => {
  if (type === "range") {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-2">{title}</label>
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="w-full"
        />
        <p className="text-sm text-gray-600">Up to ${value[1]}</p>
      </div>
    );
  }

  if (type === "rating") {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-2">{title}</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`text-yellow-500 ${
                star <= selected ? "opacity-100" : "opacity-40"
              }`}
              onClick={() => onChange(star)}
              type="button"
            >
              <FaStar />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">{title}</label>
      <select
        className="w-full p-2 border border-gray-200 rounded"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSection;
