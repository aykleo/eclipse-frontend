import { z } from "zod";
import {
  TemplateFormData,
  createOrUpdateTemplate,
} from "./fetch-create-update-template";

import { templateSchema } from "../../lib/validation/template-schema";

export const handleTemplateCreation = async (
  formData: TemplateFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);

  try {
    templateSchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessage = e.errors.map((error) => error.message).join(", ");
      throw new Error(errorMessage);
    }
  } finally {
    setIsLoading(false);
  }

  await createOrUpdateTemplate(formData)
    .then((template) => {
      return template;
    })
    .catch(() => {
      throw new Error("Server error. Please try again later.");
    })
    .finally(() => {
      setIsLoading(false);
    });
};
