import { z } from "zod";
import {
  TemplateFormData,
  createOrUpdateTemplate,
} from "./fetch-create-update-template";
import { TemplateExercise } from "../../utils/types/exercise-types";
import { templateSchema } from "../../lib/validation/template-schema";

export const handleTemplateCreation = async (
  formData: TemplateFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTemplateExercises: React.Dispatch<React.SetStateAction<TemplateExercise[]>>
) => {
  setIsLoading(true);

  try {
    templateSchema.parse(formData);
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

  setIsLoading(false);
  return createdTemplate;
};
