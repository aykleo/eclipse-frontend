export const handleTemplateDeletion = async (templateId: string) => {
  try {
    await fetch(
      `${
        import.meta.env.VITE_ECLIPSE_DEV_API_URL
      }/workout/delete/${templateId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Failed to delete template:", error);
  }
};
