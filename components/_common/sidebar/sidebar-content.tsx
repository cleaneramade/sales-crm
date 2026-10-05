"use client";

import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { PLANS, TRIAL_DAYS_LEFT } from "@/data/workspace";
import { CURRENT_QUARTER_ID } from "@/data/forecast";
import { isOpenStage } from "@/lib/deals";
import { openDealsInQuarter } from "@/lib/forecast";
import { ROUTES } from "@/lib/routes";
import { useCompaniesStore } from "@/stores/companies-store";
import { useDealsStore } from "@/stores/deals-store";
import Logo from "@/public/assets/images/_common/logo.svg";
import BuildingIcon from "@/public/assets/images/companies/sidebar/building.svg";
import ClipboardIcon from "@/public/assets/images/companies/sidebar/clipboard.svg";
import BarChartIcon from "@/public/assets/images/companies/sidebar/bar-chart.svg";
import ListIcon from "@/public/assets/images/companies/sidebar/list.svg";
import BookClosedIcon from "@/public/assets/images/companies/sidebar/book-closed.svg";
import MailIcon from "@/public/assets/images/companies/sidebar/mail.svg";
import TargetIcon from "@/public/assets/images/companies/sidebar/target-05.svg";
import TargetAltIcon from "@/public/assets/images/companies/sidebar/target-03.svg";
import UsersIcon from "@/public/assets/images/companies/sidebar/users.svg";
import BarChartAltIcon from "@/public/assets/images/companies/sidebar/bar-chart-10.svg";
import AlertTriangleIcon from "@/public/assets/images/companies/sidebar/alert-triangle.svg";
import DotYellow from "@/public/assets/images/companies/sidebar/dot-yellow.svg";
import DotPink from "@/public/assets/images/companies/sidebar/dot-pink.svg";
import DotPurple from "@/public/assets/images/companies/sidebar/dot-purple.svg";
import UserPlusIcon from "@/public/assets/images/companies/sidebar/user-plus.svg";
import MessageQuestionIcon from "@/public/assets/images/companies/sidebar/message-question.svg";
import WalletIcon from "@/public/assets/images/companies/sidebar/wallet.svg";

const BASE_COMPANY_COUNT = 223;

export default function SidebarContent() {
  const companyCount = useCompaniesStore((state) => state.companies.length);
  const dealCount = useDealsStore(
    (state) => state.deals.filter((deal) => isOpenStage(deal.stage)).length,
  );
  const forecastCount = useDealsStore(
    (state) => openDealsInQuarter(state.deals, CURRENT_QUARTER_ID).length,
  );
  const setAppDialog = useCompaniesStore((state) => state.setAppDialog);
  const planId = useCompaniesStore((state) => state.planId);
  const plan = PLANS.find((item) => item.id === planId);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center gap-2 border-b p-3">
        <Logo aria-hidden className="size-8 shrink-0 overflow-visible" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="lead-style block truncate font-medium tracking-[-0.01em]">
            Sales CRM
          </span>
          <span className="caption-style text-subtle block truncate">
            Company pipeline
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Primary">
          <SidebarSection className="border-sidebar-border border-b">
            <SidebarNavItem
              icon={BuildingIcon}
              label="Companies"
              href={ROUTES.companies.path}
              count={BASE_COMPANY_COUNT + companyCount}
            />
            <SidebarNavItem
              icon={ClipboardIcon}
              label="Deals Board"
              href={ROUTES.deals.path}
              count={dealCount}
            />
            <SidebarNavItem
              icon={BarChartIcon}
              label="Forecast"
              href={ROUTES.forecast.path}
              count={forecastCount}
            />
            <SidebarNavItem
              icon={ListIcon}
              label="Activities"
              href={ROUTES.activities.path}
            />
            <SidebarNavItem
              icon={BookClosedIcon}
              label="Contacts"
              href={ROUTES.contacts.path}
              count={38}
            />
            <SidebarNavItem
              icon={MailIcon}
              label="Email Sequences"
              href={ROUTES.sequences.path}
            />
          </SidebarSection>

          <SidebarSection
            title="Team"
            className="border-sidebar-border border-b"
          >
            <SidebarNavItem
              icon={TargetIcon}
              label="Strategic AEs"
              href={ROUTES.strategicAes.path}
            />
            <SidebarNavItem
              icon={TargetAltIcon}
              label="Mid Market"
              href={ROUTES.midMarket.path}
            />
            <SidebarNavItem
              icon={UsersIcon}
              label="SDR Team"
              href={ROUTES.sdrTeam.path}
            />
          </SidebarSection>

          <SidebarSection
            title="Reporting"
            className="border-sidebar-border border-b"
          >
            <SidebarNavItem
              icon={BarChartAltIcon}
              label="Q1 Forecast"
              href={ROUTES.q1Forecast.path}
            />
            <SidebarNavItem
              icon={AlertTriangleIcon}
              label="Slipping Deals"
              href={ROUTES.slippingDeals.path}
            />
          </SidebarSection>

          <SidebarSection title="Pipelines">
            <SidebarNavItem
              icon={DotYellow}
              label="North America"
              href={ROUTES.northAmerica.path}
            />
            <SidebarNavItem
              icon={DotPink}
              label="EMEA Enterprise"
              href={ROUTES.emeaEnterprise.path}
            />
            <SidebarNavItem
              icon={DotPurple}
              label="APAC Expansion"
              href={ROUTES.apacExpansion.path}
            />
          </SidebarSection>
        </nav>
      </ScrollArea>

      <SidebarSection className="border-sidebar-border shrink-0 border-t border-b">
        <SidebarNavItem
          icon={UserPlusIcon}
          label="Invite teammates"
          tone="quiet"
          onClick={() => setAppDialog("invite")}
        />
        <SidebarNavItem
          icon={MessageQuestionIcon}
          label="Help"
          tone="quiet"
          onClick={() => setAppDialog("help")}
        />
      </SidebarSection>

      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center justify-between gap-2 border-b p-4">
        <div className="flex flex-col gap-2">
          <span className="lead-style block font-medium tracking-[-0.01em]">
            {plan ? `${plan.name} plan` : `${TRIAL_DAYS_LEFT} Days`}
          </span>
          <span className="caption-style text-subtle block">
            {plan ? `Starts in ${TRIAL_DAYS_LEFT} days` : "Left on trials"}
          </span>
        </div>
        <Button
          variant="muted"
          size="md"
          onClick={() => setAppDialog("billing")}
        >
          <WalletIcon aria-hidden className="size-3.5" />
          {plan ? "Billing" : "Add Billings"}
        </Button>
      </div>
    </div>
  );
}
