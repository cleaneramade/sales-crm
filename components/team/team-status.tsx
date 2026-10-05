import type { Team } from "@/data/team";
import { teamRoster } from "@/lib/team";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

type TeamStatusProps = {
  team: Team;
};

export default function TeamStatus({ team }: TeamStatusProps) {
  const count = teamRoster(team).length;

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      <ActiveDot aria-hidden className="size-3" />
      {count} {count === 1 ? "rep" : "reps"}
    </span>
  );
}
