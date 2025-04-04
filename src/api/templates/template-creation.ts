import { z } from "zod";
import {
  TemplateFormData,
  createOrUpdateTemplate,
} from "./fetch-create-update-template";

import { templateSchema } from "../../lib/validation/template-schema";

export type TemplateCreationResult = {
  success: boolean;
  data?: ReturnType<typeof createOrUpdateTemplate> extends Promise<infer T>
    ? T
    : never;
  error?: string;
};

export const handleTemplateCreation = async (
  formData: TemplateFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<TemplateCreationResult> => {
  setIsLoading(true);

  try {
    templateSchema.parse(formData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessage = e.errors.map((error) => error.message).join(", ");
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }

    setIsLoading(false);
    return {
      success: false,
      error: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }

  try {
    const template = await createOrUpdateTemplate(formData);
    setIsLoading(false);
    return {
      success: true,
      data: template,
    };
  } catch (error) {
    setIsLoading(false);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create template",
    };
  }
};
