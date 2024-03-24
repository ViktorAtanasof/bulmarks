import { useState } from "react";

export const LandmarkSort = ({
  onSortChange,
}: {
  onSortChange: (sortBy: string) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onSortChange(selectedValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-secondary-color text-lg font-medium">Sort by:</h4>
      <select
        className="rounded-md border border-gray-300 dark:bg-primary-color pl-3 pr-9 text-secondary-color
        focus:ring-2 focus:ring-accent-color"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        <option value="">Select an option</option>
        <option value="size-asc">Size (Small to Large)</option>
        <option value="size-desc">Size (Large to Small)</option>
        <option value="likes-desc">Likes (Most Liked)</option>
      </select>
    </div>
  );
};
