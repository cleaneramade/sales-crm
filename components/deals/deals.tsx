import Header from "@/components/_common/header";
import DealsToolbar from "./toolbar/toolbar";
import DealsBoard from "./board/deals-board";
import DealDetail from "./detail/deal-detail";
import NewDealDialog from "./new-deal/new-deal-dialog";
import { PIPELINE_TABS } from "@/lib/routes";

export default function Deals() {
  return (
    <section id="deals" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <Header title="Deals Board" tabs={PIPELINE_TABS} />
      <DealsToolbar />
      <DealsBoard />
      <DealDetail />
      <NewDealDialog />
    </section>
  );
}
