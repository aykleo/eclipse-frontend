import { Exercise } from "./exercise-types";

export type Template = {
  id: string;
  name: string;
  exercise: Exercise[];
};
