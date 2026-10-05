import {
  LOST_STAGE,
  OPEN_STAGES,
  STALE_AFTER_DAYS,
  WON_STAGE,
  type CloseWindow,
  type Deal,
  type DealSortKey,
  type DealStage,
} from "@/data/deals";
import { TODAY, formatMoney } from "@/lib/companies";

export type DealFilters = {
  sortBy: DealSortKey;
  owner: string;
  motion: string;
  closeWindow: CloseWindow;
};

export const ALL_DEAL_OWNERS = "all";
export const ANY_MOTION = "any";

export const DEFAULT_DEAL_FILTERS: DealFilters = {
  sortBy: "value",
  owner: ALL_DEAL_OWNERS,
  motion: ANY_MOTION,
  closeWindow: "any",
};

export function dealActiveFilterCount({
  owner,
  motion,
  closeWindow,
}: DealFilters) {
  return [
    owner !== DEFAULT_DEAL_FILTERS.owner,
    motion !== DEFAULT_DEAL_FILTERS.motion,
    closeWindow !== DEFAULT_DEAL_FILTERS.closeWindow,
  ].filter(Boolean).length;
}

export function isOpenStage(stage: DealStage) {
  return OPEN_STAGES.includes(stage);
}

export function isStale(deal: Deal) {
  return isOpenStage(deal.stage) && deal.lastActivityDays > STALE_AFTER_DAYS;
}

export function dealWin(deal: Deal) {
  if (deal.stage === WON_STAGE) return 100;
  if (deal.stage === LOST_STAGE) return 0;
  return deal.winProbability;
}

function inWindow(closeDate: string, closeWindow: CloseWindow) {
  if (closeWindow === "any") return true;
  const [year, month] = closeDate.split("-").map(Number);
  const [todayYear, todayMonth] = TODAY.split("-").map(Number);
  const quarter = Math.floor((month - 1) / 3);
  const todayQuarter = Math.floor((todayMonth - 1) / 3);
  if (closeWindow === "month") {
    return year === todayYear && month === todayMonth;
  }
  if (closeWindow === "quarter") {
    return year === todayYear && quarter === todayQuarter;
  }
  const nextIndex = todayQuarter + 1;
  return (
    year === todayYear + Math.floor(nextIndex / 4) && quarter === nextIndex % 4
  );
}

export function filterDeals(
  deals: Deal[],
  { owner, motion, closeWindow }: DealFilters,
) {
  return deals.filter(
    (deal) =>
      (owner === ALL_DEAL_OWNERS || deal.owner === owner) &&
      (motion === ANY_MOTION || deal.motion === motion) &&
      inWindow(deal.closeDate, closeWindow),
  );
}

export function sortDeals(deals: Deal[], sortBy: DealSortKey) {
  return [...deals].sort((a, b) => {
    switch (sortBy) {
      case "closeDate":
        return a.closeDate.localeCompare(b.closeDate);
      case "winProbability":
        return dealWin(b) - dealWin(a);
      default:
        return b.value - a.value;
    }
  });
}

export function visibleDeals(deals: Deal[], filters: DealFilters) {
  return sortDeals(filterDeals(deals, filters), filters.sortBy);
}

export function dealsInStage(deals: Deal[], stage: DealStage) {
  return deals.filter((deal) => deal.stage === stage);
}

export function stageTotal(deals: Deal[], stage: DealStage) {
  return dealsInStage(deals, stage).reduce((sum, deal) => sum + deal.value, 0);
}

export function weightedValue(deals: Deal[]) {
  return Math.round(
    deals.reduce((sum, deal) => sum + (deal.value * dealWin(deal)) / 100, 0),
  );
}

export function openDeals(deals: Deal[]) {
  return deals.filter((deal) => isOpenStage(deal.stage));
}

export function dealsCsvRows(
  deals: Deal[],
  companyName: (companyId: string) => string,
) {
  return [
    [
      "Deal",
      "Company",
      "Stage",
      "Owner",
      "Value",
      "Win Probability (%)",
      "Close Date",
      "Motion",
      "Next Step",
      "Days Since Activity",
    ],
    ...deals.map((deal) => [
      deal.name,
      companyName(deal.companyId),
      deal.stage,
      deal.owner,
      deal.value,
      dealWin(deal),
      deal.closeDate,
      deal.motion,
      deal.nextStep,
      deal.lastActivityDays,
    ]),
  ];
}

export const DEAL_CALCULATIONS = [
  { value: "totalValue", label: "Total value" },
  { value: "weightedValue", label: "Weighted value" },
  { value: "avgWin", label: "Avg win probability" },
  { value: "avgValue", label: "Avg deal value" },
  { value: "largest", label: "Largest deal" },
  { value: "count", label: "Open deals" },
];

export function calculateDeals(kind: string, deals: Deal[]) {
  const open = openDeals(deals);
  const count = open.length;
  const total = open.reduce((sum, deal) => sum + deal.value, 0);
  const win = open.reduce((sum, deal) => sum + deal.winProbability, 0);

  switch (kind) {
    case "totalValue":
      return `$${formatMoney(total)}`;
    case "weightedValue":
      return `$${formatMoney(weightedValue(open))}`;
    case "avgWin":
      return `${count ? Math.round(win / count) : 0}%`;
    case "avgValue":
      return `$${formatMoney(count ? Math.round(total / count) : 0)}`;
    case "largest":
      return `$${formatMoney(Math.max(0, ...open.map((deal) => deal.value)))}`;
    case "count":
      return formatMoney(count);
    default:
      return "";
  }
}
