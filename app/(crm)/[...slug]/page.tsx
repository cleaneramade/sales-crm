import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PagePlaceholder from "@/components/_common/page-placeholder";
import { routeByPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string[] }> };

async function routeFor(params: PageProps["params"]) {
  const { slug } = await params;
  return routeByPath(`/${slug.join("/")}`);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const route = await routeFor(params);
  return route ? pageMetadata(route) : {};
}

export default async function Page({ params }: PageProps) {
  const route = await routeFor(params);
  if (!route) notFound();
  return (
    <PagePlaceholder title={route.title} description={route.description} />
  );
}
