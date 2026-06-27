import { PageHeader } from "@/components/ui/PageHeader";

interface LegalSection {
  title: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSection[];
}

export function LegalPage({
  title,
  subtitle,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} backHref="/perfil" />
      <div>
        <p className="mb-6 text-xs text-muted">Última atualização: {updatedAt}</p>
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-base font-semibold text-accent-dark">
                {section.title}
              </h2>
              <div className="flex flex-col gap-2">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
