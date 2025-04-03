import { TemplateExercise } from "./exercise-types";

export type Template = {
  id: string;
  name: string;
  exercises: TemplateExercise[];
};
