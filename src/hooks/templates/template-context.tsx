import { createContext, useContext } from "react";

import { Template } from "../../utils/types/template-types";

export interface TemplateContextType {
  templateForUpdate: Template | null;
  setTemplateForUpdate: (template: Template | null) => void;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
}

export const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error(
      "useTemplateContext must be used within an TemplateProvider"
    );
  }
  return context;
};
