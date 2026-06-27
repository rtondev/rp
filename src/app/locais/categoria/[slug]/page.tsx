import { ExploreContent } from "@/components/explore/ExploreContent";

export default async function LocaisCategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExploreContent categorySlug={slug} />;
}
