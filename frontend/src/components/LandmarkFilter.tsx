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
    <div className="">
      <h4>Filter by Size:</h4>
      <select value={selectedSize} onChange={handleSizeChange} name="size">
        <option value="">All Sizes</option>
        <option value="small">Small</option>
        <option value="large">Large</option>
      </select>

      <h4>Filter by Type:</h4>
      <select value={selectedType} onChange={handleTypeChange} name="type">
        <option value="">All Types</option>
        {landmarkTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};
