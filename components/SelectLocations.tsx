// components/SelectLocations.tsx
import React, { useState } from "react";
import { useLocation } from "@/app/store";

const SelectLocations: React.FC = () => {
  const {
    predefinedLocations,
    selectedLocations,
    selectLocation,
    unselectLocation,
  } = useLocation();

  const [checkedLocations, setCheckedLocations] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    if (checkedLocations.includes(id)) {
      setCheckedLocations(checkedLocations.filter((loc) => loc !== id));
      unselectLocation(id);
    } else {
      setCheckedLocations([...checkedLocations, id]);
      const location = predefinedLocations.find((loc) => loc.locationId === id);
      if (location) {
        selectLocation(location);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected locations:", selectedLocations);
  };

  return (
    <div>
      <h2>Predefined Locations:</h2>
      {predefinedLocations.map((location) => (
        <div key={location.locationId}>
          <label>
            <input
              type="checkbox"
              value={location.locationId}
              checked={checkedLocations.includes(location.locationId)}
              onChange={() => handleCheckboxChange(location.locationId)}
            />
            {location.name} (Stock: {location.stock})
          </label>
        </div>
      ))}
    </div>
  );
};

export default SelectLocations;
