import Header from "@/components/_common/header";
import CompaniesToolbar from "./toolbar/toolbar";
import CompaniesTable from "./table/companies-table";
import { PIPELINE_TABS } from "@/lib/routes";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

export default function Companies() {
  return (
    <section id="companies" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <Header
        title="Companies"
        tabs={PIPELINE_TABS}
        status={
          <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
            <ActiveDot aria-hidden className="size-3" />
            Active
          </span>
        }
      />
      <CompaniesToolbar />
      <CompaniesTable />
    </section>
  );
}
