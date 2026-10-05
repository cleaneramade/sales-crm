"use client";

import { useRef, useState, type FormEvent } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import { Slider } from "@/components/_ui/slider";
import SegmentBar from "@/components/_common/segment-bar";
import FormSection from "@/components/companies/new-company/form-section";
import { OWNERS, STAGES, type Stage } from "@/data/companies";
import {
  DEAL_STAGES,
  OPEN_STAGES,
  type Deal,
  type DealStage,
} from "@/data/deals";
import { TODAY } from "@/lib/companies";
import { slugify } from "@/lib/utils";
import { useCompaniesStore } from "@/stores/companies-store";
import { useDealsStore } from "@/stores/deals-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

type FormState = {
  companyId: string;
  name: string;
  value: string;
  stage: DealStage;
  owner: string;
  closeDate: string;
  motion: Stage;
  winProbability: number;
};

export default function NewDealDialog() {
  const open = useDealsStore((state) => state.newDealOpen);
  const setOpen = useDealsStore((state) => state.setNewDealOpen);
  const addDeal = useDealsStore((state) => state.addDeal);
  const companies = useCompaniesStore((state) => state.companies);
  const [form, setForm] = useState<FormState | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const fallback = companies[0];
  const current: FormState = form ?? {
    companyId: fallback?.id ?? "",
    name: "",
    value: "",
    stage: OPEN_STAGES[0],
    owner: fallback?.owner ?? OWNERS[0].name,
    closeDate: TODAY,
    motion: STAGES[0],
    winProbability: 25,
  };

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm({ ...current, [key]: value });
  }

  function selectCompany(companyId: string) {
    const company = companies.find((item) => item.id === companyId);
    setForm({
      ...current,
      companyId,
      owner: company?.owner ?? current.owner,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = current.name.trim();
    if (!name) {
      setNameError("Enter a deal name.");
      nameRef.current?.focus();
      return;
    }

    const deal: Deal = {
      id: `${slugify(name)}-${Date.now()}`,
      name,
      companyId: current.companyId,
      owner: current.owner,
      value: Math.max(0, Math.round(Number(current.value) || 0)),
      stage: current.stage,
      winProbability: current.winProbability,
      closeDate: current.closeDate || TODAY,
      motion: current.motion,
      nextStep: "Schedule the first call.",
      lastActivityDays: 0,
    };

    addDeal(deal);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[560px]"
        onCloseAutoFocus={() => {
          setForm(null);
          setNameError(null);
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <DialogHeader>
            <DialogTitle>New Deal</DialogTitle>
            <DialogDescription>
              Add a deal to the board. It appears in its stage right away.
            </DialogDescription>
          </DialogHeader>

          <FormSection title="Deal">
            <Field label="Company" htmlFor="deal-company">
              <Select value={current.companyId} onValueChange={selectCompany}>
                <SelectTrigger id="deal-company">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Deal name"
              htmlFor="deal-name"
              required
              error={nameError ?? undefined}
            >
              <Input
                ref={nameRef}
                id="deal-name"
                value={current.name}
                onChange={(event) => {
                  update("name", event.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="Acme — Platform expansion"
                autoComplete="off"
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? "deal-name-error" : undefined}
                className="aria-invalid:border-danger"
                autoFocus
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Deal value" htmlFor="deal-value">
                <div className="relative">
                  <span
                    aria-hidden
                    className="text-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] leading-none"
                  >
                    $
                  </span>
                  <Input
                    id="deal-value"
                    type="number"
                    min={0}
                    step={1000}
                    inputMode="numeric"
                    value={current.value}
                    onChange={(event) => update("value", event.target.value)}
                    placeholder="120000"
                    className="pl-6 tabular-nums"
                  />
                </div>
              </Field>
              <Field label="Stage" htmlFor="deal-stage">
                <Select
                  value={current.stage}
                  onValueChange={(value) => update("stage", value as DealStage)}
                >
                  <SelectTrigger id="deal-stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Ownership & timing">
            <Field label="Deal owner" htmlFor="deal-owner">
              <Select
                value={current.owner}
                onValueChange={(value) => update("owner", value)}
              >
                <SelectTrigger id="deal-owner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OWNERS.map((owner) => (
                    <SelectItem key={owner.name} value={owner.name}>
                      <span className="flex items-center gap-2">
                        <Avatar src={owner.avatar} alt="" />
                        {owner.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Close date" htmlFor="deal-close-date">
                <Input
                  id="deal-close-date"
                  type="date"
                  value={current.closeDate}
                  onChange={(event) => update("closeDate", event.target.value)}
                  className="tabular-nums"
                />
              </Field>
              <Field label="Motion" htmlFor="deal-motion">
                <Select
                  value={current.motion}
                  onValueChange={(value) => update("motion", value as Stage)}
                >
                  <SelectTrigger id="deal-motion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((motion) => (
                      <SelectItem key={motion} value={motion}>
                        {motion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field
              label="Win probability"
              htmlFor="deal-win"
              trailing={
                <span className="caption-style text-foreground tabular-nums">
                  {current.winProbability}%
                </span>
              }
            >
              <div className="flex flex-col gap-3">
                <Slider
                  id="deal-win"
                  aria-label="Win probability"
                  min={0}
                  max={100}
                  step={1}
                  value={[current.winProbability]}
                  onValueChange={([value]) => update("winProbability", value)}
                />
                <SegmentBar
                  percent={current.winProbability}
                  segments={40}
                  className="h-3 w-full border border-white/4 px-px"
                  segmentClassName="h-2"
                  trackClassName="bg-white/8"
                />
              </div>
            </Field>
          </FormSection>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="subtle" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" size="sm" type="submit">
              <PlusIcon aria-hidden className="size-3" />
              Create Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
