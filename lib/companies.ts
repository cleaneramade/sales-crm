import type { Company, SortKey } from "@/data/companies";

export type CompanyFilters = {
  sortBy: SortKey;
  owner: string;
  stage: string;
  activityWindow: number;
};

export const TODAY = "2026-09-14";

export const ALL_OWNERS = "all";
export const ANY_STAGE = "any";

export const DEFAULT_FILTERS: CompanyFilters = {
  sortBy: "pipelineValue",
  owner: ALL_OWNERS,
  stage: ANY_STAGE,
  activityWindow: 90,
};

export function activeFilterCount({
  owner,
  stage,
  activityWindow,
}: CompanyFilters) {
  return [
    owner !== DEFAULT_FILTERS.owner,
    stage !== DEFAULT_FILTERS.stage,
    activityWindow !== DEFAULT_FILTERS.activityWindow,
  ].filter(Boolean).length;
}

const TAG_CHAR_BUDGET = 20;

export type CompanyWins = ReadonlyMap<string, number>;

export function filterCompanies(
  companies: Company[],
  { sortBy, owner, stage, activityWindow }: CompanyFilters,
  wins: CompanyWins,
): Company[] {
  const filtered = companies.filter((company) => {
    if (owner !== ALL_OWNERS && company.owner !== owner) return false;
    if (stage !== ANY_STAGE && !company.tags.some((tag) => tag === stage)) {
      return false;
    }
    return company.activityDays <= activityWindow;
  });

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "lastInteraction":
        return b.lastInteraction.date.localeCompare(a.lastInteraction.date);
      case "openDeals":
        return b.openDeals - a.openDeals;
      case "winProbability": {
        const winA = wins.get(a.id);
        const winB = wins.get(b.id);
        if (winA === undefined || winB === undefined) {
          return Number(winA === undefined) - Number(winB === undefined);
        }
        return winB - winA;
      }
      default:
        return b.pipelineValue - a.pipelineValue;
    }
  });
}

export function companiesCsvRows(companies: Company[], wins: CompanyWins) {
  return [
    [
      "Company",
      "Segment & Stage",
      "Account Owner",
      "Open Deals",
      "Pipeline Value",
      "Win Probability (%)",
      "Last Interaction Date",
      "Last Interaction",
    ],
    ...companies.map((company) => [
      company.name,
      company.tags.join("; "),
      company.owner,
      company.openDeals,
      company.pipelineValue,
      wins.get(company.id) ?? "",
      company.lastInteraction.date,
      company.lastInteraction.label,
    ]),
  ];
}

export function splitTags(tags: Company["tags"]) {
  let used = 0;
  const visible: Company["tags"] = [];

  for (const tag of tags) {
    if (visible.length === 2 || used + tag.length > TAG_CHAR_BUDGET) break;
    visible.push(tag);
    used += tag.length;
  }

  if (visible.length === 0 && tags.length > 0) visible.push(tags[0]);

  return { visible, hidden: tags.length - visible.length };
}

export function companyHealth(win: number | null) {
  const value = win ?? 0;
  return {
    discovery: Math.round(value * 0.372),
    evaluation: Math.round(value * 0.651),
    procurement: Math.round(value * 0.372),
  };
}

export const NO_CALCULATION = "none";

export const CALCULATIONS = [
  { value: "sumPipeline", label: "Sum of pipeline" },
  { value: "avgPipeline", label: "Avg pipeline value" },
  { value: "maxPipeline", label: "Largest pipeline" },
  { value: "sumDeals", label: "Total open deals" },
  { value: "avgWin", label: "Avg win probability" },
];

export function averageWin(companies: Company[], wins: CompanyWins) {
  const values = companies.flatMap((item) => wins.get(item.id) ?? []);
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : null;
}

export function calculate(
  kind: string,
  companies: Company[],
  wins: CompanyWins,
) {
  const count = companies.length;
  const pipeline = companies.reduce((sum, item) => sum + item.pipelineValue, 0);
  const deals = companies.reduce((sum, item) => sum + item.openDeals, 0);

  switch (kind) {
    case "sumPipeline":
      return `$${formatMoney(pipeline)}`;
    case "avgPipeline":
      return `$${formatMoney(count ? Math.round(pipeline / count) : 0)}`;
    case "maxPipeline":
      return `$${formatMoney(Math.max(0, ...companies.map((item) => item.pipelineValue)))}`;
    case "sumDeals":
      return formatMoney(deals);
    case "avgWin": {
      const avg = averageWin(companies, wins);
      return avg === null ? "—" : `${avg}%`;
    }
    default:
      return "";
  }
}

const WINDOW_SCALE: Record<string, number> = {
  "Last 7 Days": 0.25,
  "Last 30 Days": 1,
  "Last 90 Days": 2.75,
};

export function companyActivity(company: Company, range = "Last 30 Days") {
  const deals = company.openDeals;
  const scale = WINDOW_SCALE[range] ?? 1;
  const scaled = (value: number) => Math.max(0, Math.round(value * scale));
  return {
    total: scaled(deals * 15),
    touches: scaled(deals * 4),
    emails: scaled(deals + 4),
    meetings: scaled(Math.ceil(deals / 2)),
    calls: scaled(deals + 1),
  };
}

export function formatDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${names[month - 1]} ${day}`;
}

export function formatMoney(value: number) {
  return value.toLocaleString("en-US");
}

export function daysSince(iso: string) {
  const day = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((Date.parse(TODAY) - Date.parse(iso)) / day));
}
