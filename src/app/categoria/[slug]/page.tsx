import { redirect } from "next/navigation";

export default async function CategoriaRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/locais/categoria/${slug}`);
}
