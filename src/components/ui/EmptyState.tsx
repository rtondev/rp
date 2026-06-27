import { CategoryIcon } from "@/lib/category-icons";

export function EmptyState({
  icon = "MapPin",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-empty-state px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
        <CategoryIcon name={icon} size={28} weight="duotone" className="text-accent" />
      </div>
      <p className="text-base font-medium text-accent-dark">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
