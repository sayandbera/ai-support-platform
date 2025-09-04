const INTEGRATIONS = [
  {
    id: "html",
    title: "HTML",
    icon: "/languages/html5.svg",
  },
  {
    id: "react",
    title: "React",
    icon: "/languages/react.svg",
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "/languages/nextjs.svg",
  },
  {
    id: "javascript",
    title: "JavaScript",
    icon: "/languages/javascript.svg",
  },
];

type IntegrationID = (typeof INTEGRATIONS)[number]["id"];

const HTML_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
const REACT_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
const NEXTJS_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
const JAVASCRIPT_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;

export {
  INTEGRATIONS,
  type IntegrationID,
  HTML_SCRIPT,
  REACT_SCRIPT,
  NEXTJS_SCRIPT,
  JAVASCRIPT_SCRIPT,
};
