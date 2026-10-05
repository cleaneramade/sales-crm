import type { Region } from "@/data/deals";
import type { RouteKey } from "@/lib/routes";

export type Pipeline = {
  id: string;
  routeKey: Extract<
    RouteKey,
    "northAmerica" | "emeaEnterprise" | "apacExpansion"
  >;
  title: string;
  region: Region;
  description: string;
};

export const PIPELINES: Pipeline[] = [
  {
    id: "north-america",
    routeKey: "northAmerica",
    title: "North America",
    region: "North America",
    description: "Every deal in the North America region, by stage.",
  },
  {
    id: "emea-enterprise",
    routeKey: "emeaEnterprise",
    title: "EMEA Enterprise",
    region: "EMEA",
    description: "Every deal in the EMEA region, by stage.",
  },
  {
    id: "apac-expansion",
    routeKey: "apacExpansion",
    title: "APAC Expansion",
    region: "APAC",
    description: "Every deal in the APAC region, by stage.",
  },
];

export function pipelineByRegion(region: Region) {
  return PIPELINES.find((pipeline) => pipeline.region === region);
}
