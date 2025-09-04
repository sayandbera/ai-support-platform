import {
  HTML_SCRIPT,
  JAVASCRIPT_SCRIPT,
  NEXTJS_SCRIPT,
  REACT_SCRIPT,
  type IntegrationID,
} from "./constants";

export const createScript = (
  integrationID: IntegrationID,
  organizationId: string
) => {
  switch (integrationID) {
    case "html":
      return HTML_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    case "react":
      return REACT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    case "nextjs":
      return NEXTJS_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    case "javascript":
      return JAVASCRIPT_SCRIPT.replace(/{{ORGANIZATION_ID}}/g, organizationId);
    default:
      return "";
  }
};
