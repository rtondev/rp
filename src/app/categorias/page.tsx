"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconPicker } from "@/components/ui/IconPicker";
import { CategoryIcon } from "@/lib/category-icons";

export default function CategoriasPage() {
  const { canManageCategories } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canManageCategories) router.replace("/");
    load();
  }, [canManageCategories, router]);

  async function load() {
    setCategories(await api.categories.list());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.categories.create({
        name,
        description: description || undefined,
        icon,
      });
      setName("");
      setDescription("");
      setIcon("Tag");
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria?")) return;
    await api.categories.remove(id);
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Categorias"
        subtitle="Gerencie as categorias de locais"
        backHref="/perfil"
      />

      <div className="mb-8">
        <h3 className="mb-4 font-medium text-accent-dark">Nova categoria</h3>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Nome da categoria"
            placeholder="Digite aqui o nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Descrição da categoria"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <IconPicker value={icon} onChange={setIcon} />
          <Button type="submit" disabled={loading}>
            Adicionar
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-0"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CategoryIcon name={cat.icon} size={20} weight="duotone" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-accent-dark">{cat.name}</h3>
                  {cat._count && (
                    <Badge>{cat._count.places} locais</Badge>
                  )}
                </div>
                {cat.description && (
                  <p className="mt-1 text-sm text-muted">{cat.description}</p>
                )}
              </div>
            </div>
            <Button
              variant="danger"
              onClick={() => handleDelete(cat.id)}
              className="shrink-0 px-3"
            >
              Excluir
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
