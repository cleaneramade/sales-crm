"use client";

import { useMemo, useState, type DragEvent } from "react";
import { ScrollArea } from "@/components/_ui/scroll-area";
import BoardFooter from "./board-footer";
import DealColumn from "./deal-column";
import { DEAL_STAGES, type DealStage } from "@/data/deals";
import { dealsInStage, visibleDeals } from "@/lib/deals";
import { useCompaniesStore } from "@/stores/companies-store";
import { useDealsStore } from "@/stores/deals-store";

export default function DealsBoard() {
  const deals = useDealsStore((state) => state.deals);
  const sortBy = useDealsStore((state) => state.sortBy);
  const owner = useDealsStore((state) => state.owner);
  const motion = useDealsStore((state) => state.motion);
  const closeWindow = useDealsStore((state) => state.closeWindow);
  const moveDeal = useDealsStore((state) => state.moveDeal);
  const companies = useCompaniesStore((state) => state.companies);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<DealStage | null>(null);

  const visible = useMemo(
    () => visibleDeals(deals, { sortBy, owner, motion, closeWindow }),
    [deals, sortBy, owner, motion, closeWindow],
  );

  function handleDragStart(event: DragEvent<HTMLElement>, id: string) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setOverStage(null);
  }

  function handleDragOver(event: DragEvent<HTMLElement>, stage: DealStage) {
    if (!draggingId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOverStage(stage);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOverStage(null);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>, stage: DealStage) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") || draggingId;
    if (id) moveDeal(id, stage);
    handleDragEnd();
  }

  return (
    <div className="border-border flex min-h-0 flex-1 flex-col border-t">
      <ScrollArea
        fade
        orientation="horizontal"
        className="min-h-0 flex-1"
        viewportClassName="[&>div]:h-full"
      >
        <div className="flex h-full w-max gap-3 p-4">
          {DEAL_STAGES.map((stage) => (
            <DealColumn
              key={stage}
              stage={stage}
              deals={dealsInStage(visible, stage)}
              companies={companies}
              draggingId={draggingId}
              isOver={overStage === stage}
              onDragStartCard={handleDragStart}
              onDragEndCard={handleDragEnd}
              onDragOverColumn={handleDragOver}
              onDragLeaveColumn={handleDragLeave}
              onDropColumn={handleDrop}
            />
          ))}
        </div>
      </ScrollArea>
      <BoardFooter deals={visible} />
    </div>
  );
}
