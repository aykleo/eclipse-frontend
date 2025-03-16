import { z } from "zod";
import { exerciseSchema } from "../../lib/validation/exercise-schema";
import {
  TemplateFormData,
  createOrUpdateTemplate,
} from "./fetch-create-update-template";
import { TemplateExercise } from "../../utils/types/exercise-types";

export const handleTemplateCreation = async (
  formData: TemplateFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTemplateExercises: React.Dispatch<
    React.SetStateAction<TemplateExercise[]>
  >,
  setIsCreatingTemplate?: (isCreatingTemplate: boolean) => void
) => {
  setIsLoading(true);

  try {
    exerciseSchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessage = e.errors.map((error) => error.message).join(", ");
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }

  const createdTemplate = await createOrUpdateTemplate(
    formData,
    setIsLoading,
    setTemplateExercises
  );

  if (createdTemplate) {
    if (setIsCreatingTemplate) {
      setIsCreatingTemplate(false);
    }
  }
  setIsLoading(false);
  return createdTemplate;
};
