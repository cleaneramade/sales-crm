"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
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
import FormSection from "@/components/companies/new-company/form-section";
import { DEAL_ACTIVITY_TYPES, type DealActivityType } from "@/data/deals";
import { formatDelta } from "@/lib/activities";
import { TODAY } from "@/lib/companies";
import { ACTIVITY_EFFECTS, CLOSE_PUSH_DAYS, isOpenStage } from "@/lib/deals";
import { useActivitiesStore } from "@/stores/activities-store";
import { useCompaniesStore } from "@/stores/companies-store";
import { useDealsStore } from "@/stores/deals-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

type FormState = {
  companyId: string;
  dealId: string;
  type: DealActivityType;
  date: string;
  note: string;
};

type Errors = {
  company?: string;
  deal?: string;
  date?: string;
};

const NOTE_LIMIT = 140;

export default function LogActivityDialog() {
  const open = useActivitiesStore((state) => state.logOpen);
  const setOpen = useActivitiesStore((state) => state.setLogOpen);
  const logDealId = useActivitiesStore((state) => state.logDealId);
  const deals = useDealsStore((state) => state.deals);
  const logActivity = useDealsStore((state) => state.logActivity);
  const companies = useCompaniesStore((state) => state.companies);
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const companyRef = useRef<HTMLButtonElement>(null);
  const dealRef = useRef<HTMLButtonElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const openDeals = useMemo(
    () => deals.filter((deal) => isOpenStage(deal.stage)),
    [deals],
  );
  const companyOptions = useMemo(() => {
    const withOpen = new Set(openDeals.map((deal) => deal.companyId));
    return companies
      .filter((company) => withOpen.has(company.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [companies, openDeals]);

  const preset = openDeals.find((deal) => deal.id === logDealId);
  const current: FormState = form ?? {
    companyId: preset?.companyId ?? "",
    dealId: preset?.id ?? "",
    type: DEAL_ACTIVITY_TYPES[0],
    date: TODAY,
    note: "",
  };
  const companyDeals = openDeals.filter(
    (deal) => deal.companyId === current.companyId,
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm({ ...current, [key]: value });
  }

  function selectCompany(companyId: string) {
    const matches = openDeals.filter((deal) => deal.companyId === companyId);
    setForm({
      ...current,
      companyId,
      dealId: matches.length === 1 ? matches[0].id : "",
    });
    setErrors((existing) => ({
      ...existing,
      company: undefined,
      deal: undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!current.companyId) next.company = "Choose a company.";
    else if (!current.dealId) next.deal = "Choose a deal.";
    if (!current.date) next.date = "Pick a date.";
    else if (current.date > TODAY)
      next.date = "The date can't be in the future.";
    setErrors(next);
    if (next.company) return companyRef.current?.focus();
    if (next.deal) return dealRef.current?.focus();
    if (next.date) return dateRef.current?.focus();

    logActivity(current.dealId, current.type, {
      date: current.date,
      note: current.note.trim(),
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[560px]"
        onCloseAutoFocus={() => {
          setForm(null);
          setErrors({});
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Log activity</DialogTitle>
            <DialogDescription>
              Record what happened on an open deal. It updates the deal&apos;s
              win chance right away.
            </DialogDescription>
          </DialogHeader>

          <FormSection title="Deal">
            <Field
              label="Company"
              htmlFor="activity-company"
              required
              error={errors.company}
            >
              <Select value={current.companyId} onValueChange={selectCompany}>
                <SelectTrigger
                  ref={companyRef}
                  id="activity-company"
                  aria-invalid={errors.company ? true : undefined}
                  aria-describedby={
                    errors.company ? "activity-company-error" : undefined
                  }
                  className="aria-invalid:border-danger"
                >
                  <SelectValue placeholder="Choose a company" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Deal"
              htmlFor="activity-deal"
              required
              error={errors.deal}
            >
              <Select
                value={current.dealId}
                onValueChange={(value) => {
                  update("dealId", value);
                  setErrors((existing) => ({ ...existing, deal: undefined }));
                }}
                disabled={!current.companyId}
              >
                <SelectTrigger
                  ref={dealRef}
                  id="activity-deal"
                  aria-invalid={errors.deal ? true : undefined}
                  aria-describedby={
                    errors.deal ? "activity-deal-error" : undefined
                  }
                  className="aria-invalid:border-danger"
                >
                  <SelectValue
                    placeholder={
                      current.companyId
                        ? "Choose a deal"
                        : "Choose a company first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {companyDeals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FormSection>

          <FormSection title="Activity">
            <Field
              label="Type"
              htmlFor="activity-type"
              hint={
                current.type === "closePushed"
                  ? `Moves the close date out ${CLOSE_PUSH_DAYS} days.`
                  : undefined
              }
            >
              <Select
                value={current.type}
                onValueChange={(value) =>
                  update("type", value as DealActivityType)
                }
              >
                <SelectTrigger id="activity-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {ACTIVITY_EFFECTS[type].label} ·{" "}
                      {formatDelta(ACTIVITY_EFFECTS[type].delta)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Date"
              htmlFor="activity-date"
              required
              error={errors.date}
            >
              <Input
                ref={dateRef}
                id="activity-date"
                type="date"
                max={TODAY}
                value={current.date}
                onChange={(event) => {
                  update("date", event.target.value);
                  setErrors((existing) => ({ ...existing, date: undefined }));
                }}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={
                  errors.date ? "activity-date-error" : undefined
                }
                className="aria-invalid:border-danger tabular-nums"
              />
            </Field>

            <Field label="Note" htmlFor="activity-note">
              <Input
                id="activity-note"
                value={current.note}
                onChange={(event) => update("note", event.target.value)}
                maxLength={NOTE_LIMIT}
                placeholder="What happened?"
                autoComplete="off"
              />
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
              Log activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
