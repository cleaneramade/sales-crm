"use client";

import SegmentBar from "@/components/_common/segment-bar";
import type { Team } from "@/data/team";
import { formatMoney } from "@/lib/companies";
import { quarterById } from "@/lib/forecast";
import {
  formatAttainment,
  formatTeamCoverage,
  isSdrTeam,
  teamSummary,
  type TeamMember,
} from "@/lib/team";
import { cn } from "@/lib/utils";
import { useTeamStore } from "@/stores/team-store";

type SummaryProps = {
  team: Team;
  members: TeamMember[];
};

type Tile = {
  key: string;
  label: string;
  value: string;
  note?: string;
  percent?: number;
  percentLabel?: string;
};

export default function Summary({ team, members }: SummaryProps) {
  const period = useTeamStore((state) => state.period);
  const summary = teamSummary(members);
  const quarter = quarterById(period).label;
  const sdr = isSdrTeam(team);

  const tiles: Tile[] = sdr
    ? [
        {
          key: "meetings",
          label: "Meetings booked",
          value: String(summary.meetings),
          note: quarter,
        },
        {
          key: "target",
          label: "Target",
          value: String(summary.target),
          note: `${members.length} reps`,
        },
        {
          key: "attainment",
          label: "Attainment",
          value: formatAttainment(summary.meetingAttainment),
          percent: summary.meetingAttainment,
        },
        {
          key: "pipeline",
          label: "All open pipeline",
          value: `$${formatMoney(summary.openPipeline)}`,
          note: `All quarters, ${summary.openDeals} deals`,
        },
      ]
    : [
        {
          key: "quota",
          label: "Team quota",
          value: `$${formatMoney(summary.rollup.quota)}`,
          note: quarter,
        },
        {
          key: "closed",
          label: "Closed Won",
          value: `$${formatMoney(summary.rollup.closed)}`,
          note: "Won this quarter",
        },
        {
          key: "attainment",
          label: "Attainment",
          value: formatAttainment(summary.attainment),
          percent: summary.attainment ?? 0,
        },
        {
          key: "pipeline",
          label: "All open pipeline",
          value: `$${formatMoney(summary.openPipeline)}`,
          note: `All quarters, ${summary.openDeals} deals`,
        },
        {
          key: "coverage",
          label: "Coverage",
          value: formatTeamCoverage(summary),
          note: `${quarter} pipeline vs. remaining`,
        },
      ];

  return (
    <div
      className={cn(
        "sticky left-0 grid shrink-0 grid-cols-2 gap-2 px-4 pb-4",
        sdr ? "sm:grid-cols-4" : "sm:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="border-line-strong flex min-w-0 flex-col gap-3 rounded-lg border p-[11px]"
        >
          <span className="caption-style text-soft block">{tile.label}</span>
          <span className="lead-style block truncate tabular-nums">
            {tile.value}
          </span>
          {tile.percent !== undefined ? (
            <SegmentBar
              percent={Math.min(100, tile.percent)}
              segments={12}
              className="w-full"
            />
          ) : (
            <span className="caption-style text-soft block truncate">
              {tile.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
