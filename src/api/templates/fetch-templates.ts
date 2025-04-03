import { Template } from "../../utils/types/template-types";
import { User } from "../../utils/types/user-types";

export async function fetchTemplates(
  currentPage: number,
  pageSize: number,
  user: User
): Promise<{ templates: Template[]; totalPages: number }> {
  const controller = new AbortController();
  const signal = controller.signal;

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    pageSize: pageSize.toString(),
  });

  try {
    const response = await fetch(
      `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/${
        user?.id
      }/exercises?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        credentials: "include",
      }
    );

    const data = await response.json();

    return { templates: data.templates, totalPages: data.totalPages };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { templates: [], totalPages: 0 };
  } finally {
    controller.abort();
  }
}
