export const TRIAL_DAYS_LEFT = 14;

export const TEAM_ROLES = [
  "Admin",
  "Sales Manager",
  "Account Executive",
  "SDR",
  "Viewer",
];

export type Invite = {
  email: string;
  role: string;
  sent: string;
};

export const PENDING_INVITES: Invite[] = [
  {
    email: "priya.raman@crm.com",
    role: "Account Executive",
    sent: "Sent 2d ago",
  },
  { email: "tom.becker@crm.com", role: "SDR", sent: "Sent 5d ago" },
];

export type Plan = {
  id: string;
  name: string;
  seatPrice: number;
  summary: string;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    seatPrice: 29,
    summary: "Pipeline, contacts and activity for small teams.",
  },
  {
    id: "growth",
    name: "Growth",
    seatPrice: 59,
    summary: "Forecasting, sequences and team reporting.",
  },
  {
    id: "scale",
    name: "Scale",
    seatPrice: 99,
    summary: "Multiple pipelines, roles and advanced reports.",
  },
];

export const ANNUAL_DISCOUNT = 0.2;

export const SHORTCUTS = [
  { keys: ["Ctrl", "K"], label: "Search companies" },
  { keys: ["↑", "↓"], label: "Move through results" },
  { keys: ["↵"], label: "Open the selected result" },
  { keys: ["Esc"], label: "Close a panel or dialog" },
];

export const HELP_TOPICS = [
  {
    question: "How do I add a company?",
    answer:
      "Use New Company in the toolbar, or search with Ctrl K and pick New Company.",
  },
  {
    question: "How do I see one rep's accounts?",
    answer:
      "Click an owner's name, then Filter table by owner in their profile.",
  },
  {
    question: "Can I export what I see?",
    answer:
      "Export downloads the companies that match your current filters as a CSV.",
  },
];

export const SUPPORT_EMAIL = "support@crm.com";
