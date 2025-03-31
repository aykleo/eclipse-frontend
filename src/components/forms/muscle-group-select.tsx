import type { ChangeEvent } from "react";
import { Select } from "./select";

interface MuscleGroupData {
  id: string;
  name: string;
}

interface MuscleGroupSelectProps {
  label: string;
  muscleGroupData: MuscleGroupData[];
  defaultValue: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  required?: boolean;
}

export const MuscleGroupSelect = ({
  label,
  muscleGroupData,
  defaultValue,
  onChange,
  name,
  required,
}: MuscleGroupSelectProps) => {
  const formattedOptions = muscleGroupData.map((muscle) => (
    <option key={muscle.id} value={muscle.id}>
      {muscle.name
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())}
    </option>
  ));

  return (
    <Select
      label={label}
      options={formattedOptions}
      defaultValue={defaultValue}
      onChange={onChange}
      name={name}
      hasLabel={true}
      required={required}
      placeholder="Primary mover"
    />
  );
};
