import { useState } from "react";
import { LandmarkFilterProps } from "../types/landmarkTypes";

export const LandmarkFilter = ({
  landmarks,
  landmarkTypes,
  onFilterChange,
}: LandmarkFilterProps) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedSize(selectedValue);

    let filteredLandmarks = applyFilters(selectedValue, selectedType);
    onFilterChange(filteredLandmarks);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedType(selectedValue);

    let filteredLandmarks = applyFilters(selectedSize, selectedValue);
    onFilterChange(filteredLandmarks);
  };

  const applyFilters = (size: string, type: string) => {
    let filteredLandmarks = landmarks;

    if (size !== "") {
      filteredLandmarks = filteredLandmarks.filter(
        (landmark) => landmark.data.size === size
      );
    }

    if (type !== "") {
      filteredLandmarks = filteredLandmarks.filter(
        (landmark) => landmark.data.type === type
      );
    }

    return filteredLandmarks;
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex flex-col gap-2">
        <h4 className="text-secondary-color text-lg font-medium">Filter by Size:</h4>
        <select
          name="size"
          className="rounded-md border border-gray-300 pl-3 pr-9 dark:bg-primary-color text-secondary-color
          focus:ring-2 focus:ring-accent-color"
          value={selectedSize}
          onChange={handleSizeChange}
        >
          <option value="">All Sizes</option>
          <option value="small">Small</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-secondary-color text-lg font-medium">Filter by Type:</h4>
        <select
          name="type"
          className="rounded-md border border-gray-300 pl-3 pr-9 dark:bg-primary-color text-secondary-color
          focus:ring-2 focus:ring-accent-color"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">All Types</option>
          {landmarkTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
