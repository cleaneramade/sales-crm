"use client";

import { useMemo } from "react";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import ContactInitials from "@/components/contacts/contact-initials";
import { CONTACT_ROLE_TONES } from "@/lib/contacts";
import { useCompaniesStore } from "@/stores/companies-store";
import { useContactsStore } from "@/stores/contacts-store";

type CompanyPeopleProps = {
  companyId: string;
};

export default function CompanyPeople({ companyId }: CompanyPeopleProps) {
  const contacts = useContactsStore((state) => state.contacts);
  const openContact = useContactsStore((state) => state.openDetail);
  const closeDetail = useCompaniesStore((state) => state.closeDetail);
  const people = useMemo(
    () => contacts.filter((contact) => contact.companyId === companyId),
    [contacts, companyId],
  );

  function open(contactId: string) {
    closeDetail();
    openContact(contactId);
  }

  if (people.length === 0) {
    return (
      <span className="caption-style text-subtle block">No contacts yet.</span>
    );
  }

  return (
    <ul className="divide-line-strong flex flex-col divide-y">
      {people.map((contact) => (
        <li key={contact.id}>
          <Button
            variant="item"
            size="none"
            onClick={() => open(contact.id)}
            className="items-center justify-between gap-3 rounded-none py-2"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <ContactInitials name={contact.name} className="size-6" />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-foreground truncate">{contact.name}</span>
                <span className="caption-style text-subtle truncate">
                  {contact.title}
                </span>
              </span>
            </span>
            <Tag tone={CONTACT_ROLE_TONES[contact.role]} size="sm">
              {contact.role}
            </Tag>
          </Button>
        </li>
      ))}
    </ul>
  );
}
