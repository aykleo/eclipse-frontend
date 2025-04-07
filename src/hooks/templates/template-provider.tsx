import React, { useState, ReactNode } from "react";
import { Template } from "../../utils/types/template-types";
import { TemplateContext, TemplateContextType } from "./template-context";

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  children,
}) => {
  const [templateForUpdate, setTemplateForUpdate] = useState<Template | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const value: TemplateContextType = {
    templateForUpdate,
    setTemplateForUpdate,
    selectedTemplate,
    setSelectedTemplate,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};
