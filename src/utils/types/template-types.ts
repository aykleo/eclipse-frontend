import { TemplateExercise } from "./exercise-types";

export type Template = {
  id: string;
  name: string;
  exercises: TemplateExercise[];
};

export type TemplateItem = {
  exerciseId: string;
  notes: string;
  name: string;
  order?: number;
};
