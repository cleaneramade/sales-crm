import type { ReactNode } from "react";
import Sidebar from "@/components/_common/sidebar/sidebar";
import CompanyDetail from "@/components/companies/detail/company-detail";
import DealDetail from "@/components/deals/detail/deal-detail";
import NewDealDialog from "@/components/deals/new-deal/new-deal-dialog";
import Profile from "@/components/companies/profile/profile";
import NewCompanyDialog from "@/components/companies/new-company/new-company-dialog";
import CommandMenu from "@/components/companies/command-menu/command-menu";
import InviteDialog from "@/components/_common/dialogs/invite-dialog";
import HelpDialog from "@/components/_common/dialogs/help-dialog";
import BillingDialog from "@/components/_common/dialogs/billing-dialog";

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-dvh max-w-full overflow-hidden">
      <Sidebar />
      {children}
      <CompanyDetail />
      <DealDetail />
      <NewDealDialog />
      <Profile />
      <NewCompanyDialog />
      <CommandMenu />
      <InviteDialog />
      <HelpDialog />
      <BillingDialog />
    </main>
  );
}
