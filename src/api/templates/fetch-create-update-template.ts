import { TemplateExercise } from "../../utils/types/exercise-types";

export type TemplateFormData = {
  templateId?: string;
  name: string;
  exercises: {
    exerciseId: string;
    notes: string;
  }[];
};

export const createOrUpdateTemplate = async (
  formData: TemplateFormData,
  setIsLoading: (isLoading: boolean) => void,
  setTemplateExercises: (templateExercises: TemplateExercise[]) => void,
  templateForUpdateId?: string
): Promise<string> => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    setIsLoading(true);

    await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/workout/${
        !templateForUpdateId
          ? "create-template"
          : `update-template/${formData.templateId!}`
      }`,
      {
        method: !templateForUpdateId ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal,
        body: JSON.stringify(formData),
      }
    );

    setTemplateExercises([]);
    return templateForUpdateId ? "Template updated" : "Template created";
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Server error. Please try again later.");
  } finally {
    controller.abort();
    setIsLoading(false);
  }
};
