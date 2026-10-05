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

export type HelpTopic = { question: string; answer: string };

export const HELP_SECTIONS: { title: string; topics: HelpTopic[] }[] = [
  {
    title: "Win chance",
    topics: [
      {
        question: "How is a deal's win chance worked out?",
        answer:
          "Every stage starts at a set number: Discovery 10%, Evaluation 25%, Proposal 50% and Procurement 75%. What happens on the deal then moves it up or down. Nobody types it in.",
      },
      {
        question: "What raises it?",
        answer:
          "A meeting booked adds 10%, a decision-maker joining adds 10%, a reply adds 5% and the proposal being opened adds 5%.",
      },
      {
        question: "What lowers it?",
        answer:
          "A pushed close date takes off 10%, an unanswered email 5% and the main contact leaving 20%. Two weeks with no activity takes off 15% and marks the deal Stale.",
      },
      {
        question: "Does logging the same thing again keep raising it?",
        answer:
          "No. Each kind of activity counts twice at most in a stage, so a third reply is recorded but doesn't move the number.",
      },
      {
        question: "Why did a number change on its own?",
        answer:
          "Something was logged on the deal, or two weeks passed with no activity. Open the deal and read Why this number to see each reason.",
      },
      {
        question: "Why did it reset when I moved the deal?",
        answer:
          "Each stage starts fresh. Only activity since the deal reached its current stage counts, so old wins and warnings don't follow it forever.",
      },
      {
        question: "Can I set the number myself?",
        answer:
          "Yes. Open the deal and use Override. It shows a Manual mark so everyone knows it's a judgment call, and goes back to automatic when the stage changes.",
      },
      {
        question: "How is a company's win chance worked out?",
        answer:
          "It's the average of its open deals, with bigger deals counting more. A company with no open deals shows a dash.",
      },
      {
        question: "What about won and lost deals?",
        answer:
          "Won deals count as 100% and lost deals as 0%. They no longer move.",
      },
      {
        question: "How does Forecast use it?",
        answer:
          "Deals in Procurement or at 70% and up count as Commit. Deals in Proposal or at 40% and up count as Best Case. The rest are Pipeline. You can change a deal's category on the Forecast page.",
      },
    ],
  },
  {
    title: "Getting around",
    topics: [
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
          "Export downloads what matches your current filters as a spreadsheet file.",
      },
      {
        question: "Where do a company's numbers come from?",
        answer:
          "Open deals, pipeline, win chance, last interaction and the activity trend all come from its deals on the Deals Board. Nothing is typed in.",
      },
    ],
  },
];

export const SUPPORT_EMAIL = "support@crm.com";
