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
  templateForUpdateId?: string
): Promise<string> => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
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

    return templateForUpdateId ? "Template updated" : "Template created";
  } finally {
    controller.abort();
  }
};
