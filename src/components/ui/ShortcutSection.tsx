interface ShortcutSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ShortcutSection({
  title,
  children,
  className,
}: ShortcutSectionProps) {
  return (
    <section className={className}>
      <h3 className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">
        {title}
      </h3>
      <div className="flex flex-col divide-y divide-border/60">{children}</div>
    </section>
  );
}
