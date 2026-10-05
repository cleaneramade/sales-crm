import { useMemo } from "react";
import { create } from "zustand";
import {
  DEFAULT_ACTIVITY_FILTERS,
  filterActivities,
  flattenActivities,
  type ActivityFilters,
} from "@/lib/activities";
import { useDealsStore } from "@/stores/deals-store";

type ActivitiesState = ActivityFilters & {
  logOpen: boolean;
  logDealId: string | null;
  setType: (type: string) => void;
  setOwner: (owner: string) => void;
  setCompany: (company: string) => void;
  setWindow: (window: string) => void;
  resetFilters: () => void;
  openLog: (dealId?: string) => void;
  setLogOpen: (open: boolean) => void;
};

export const useActivitiesStore = create<ActivitiesState>((set) => ({
  ...DEFAULT_ACTIVITY_FILTERS,
  logOpen: false,
  logDealId: null,
  setType: (type) => set({ type }),
  setOwner: (owner) => set({ owner }),
  setCompany: (company) => set({ company }),
  setWindow: (window) => set({ window }),
  resetFilters: () => set({ ...DEFAULT_ACTIVITY_FILTERS }),
  openLog: (dealId) => set({ logOpen: true, logDealId: dealId ?? null }),
  setLogOpen: (logOpen) => set({ logOpen }),
}));

export function useAllActivities() {
  const deals = useDealsStore((state) => state.deals);
  return useMemo(() => flattenActivities(deals), [deals]);
}

export function useVisibleActivities() {
  const all = useAllActivities();
  const type = useActivitiesStore((state) => state.type);
  const owner = useActivitiesStore((state) => state.owner);
  const company = useActivitiesStore((state) => state.company);
  const window = useActivitiesStore((state) => state.window);
  return useMemo(
    () => filterActivities(all, { type, owner, company, window }),
    [all, type, owner, company, window],
  );
}
