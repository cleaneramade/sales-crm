"use client";

import { usePathname } from "next/navigation";
import Button from "@/components/_ui/button";
import Header from "./header";
import { PIPELINE_TABS, ROUTES } from "@/lib/routes";
import ClipboardIcon from "@/public/assets/images/companies/sidebar/clipboard.svg";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export default function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  const pathname = usePathname();
  const inPipeline = PIPELINE_TABS.some((tab) => tab.href === pathname);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <Header title={title} tabs={inPipeline ? PIPELINE_TABS : undefined} />
      <div className="border-border flex flex-1 flex-col items-center justify-center gap-2 border-t px-6 py-12 text-center">
        <span className="bg-muted flex size-10 items-center justify-center rounded-full shadow-[0px_0px_0px_1px_#232323]">
          <ClipboardIcon aria-hidden className="text-soft size-4" />
        </span>
        <h2 className="mt-1">{title} is being built</h2>
        <p className="text-subtle max-w-[22em]">{description}</p>
        <Button
          variant="secondary"
          size="sm"
          href={ROUTES.companies.path}
          className="mt-3"
        >
          Back to Companies
        </Button>
      </div>
    </section>
  );
}
