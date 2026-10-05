"use client";

import { useContactsStore } from "@/stores/contacts-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

export default function ContactsStatus() {
  const count = useContactsStore(
    (state) =>
      state.contacts.filter((contact) => contact.role === "Decision maker")
        .length,
  );

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      <ActiveDot aria-hidden className="size-3" />
      {count} decision {count === 1 ? "maker" : "makers"}
    </span>
  );
}
