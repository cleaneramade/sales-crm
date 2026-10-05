import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PagePlaceholder from "@/components/_common/page-placeholder";
import { ROUTES, routeByPath, type RouteKey } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const BUILT: RouteKey[] = ["companies"];

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return (Object.keys(ROUTES) as RouteKey[])
    .filter((key) => !BUILT.includes(key))
    .map((key) => ({ slug: ROUTES[key].path.slice(1).split("/") }));
}

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
  return <PagePlaceholder title={route.title} description={route.description} />;
}
