"use client";

import { useState } from "react";
import type { Category, Link, OpeningHours } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  OpeningHoursEditor,
  openingHoursFromUnknown,
} from "@/components/places/OpeningHoursEditor";
import { createEmptyWeeklyHours } from "@/lib/opening-hours";
import { toastError } from "@/lib/toast";
import { getErrorMessage, required } from "@/lib/validate";

type PlaceFormErrors = Partial<Record<"title" | "description" | "latitude" | "longitude", string>>;

export interface PlaceFormData {
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  address: string;
  imageUrl: string;
  available: boolean;
  categoryId: string;
  links: Link[];
  openingHours: OpeningHours;
}

interface PlaceFormProps {
  categories: Category[];
  initial?: Partial<PlaceFormData>;
  onSubmit: (data: PlaceFormData) => Promise<void>;
  submitLabel?: string;
}

export function PlaceForm({
  categories,
  initial,
  onSubmit,
  submitLabel = "Salvar",
}: PlaceFormProps) {
  const [form, setForm] = useState<PlaceFormData>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    latitude: initial?.latitude ?? "",
    longitude: initial?.longitude ?? "",
    address: initial?.address ?? "",
    imageUrl: initial?.imageUrl ?? "",
    available: initial?.available ?? true,
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    links: initial?.links ?? [{ label: "", url: "" }],
    openingHours: initial?.openingHours
      ? openingHoursFromUnknown(initial.openingHours)
      : createEmptyWeeklyHours(),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<PlaceFormErrors>({});

  function clearError(field: keyof PlaceFormErrors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next: PlaceFormErrors = {
      title: required(form.title, "Informe o título do local"),
      description: required(form.description, "Informe a descrição do local"),
      latitude: required(form.latitude, "Informe a latitude"),
      longitude: required(form.longitude, "Informe a longitude"),
    };

    const filtered = Object.fromEntries(
      Object.entries(next).filter(([, value]) => value),
    ) as PlaceFormErrors;

    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  }

  function updateLink(index: number, field: keyof Link, value: string) {
    const links = [...form.links];
    links[index] = { ...links[index], [field]: value };
    setForm({ ...form, links });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toastError("Verifique os campos destacados");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...form,
        links: form.links.filter((l) => l.label && l.url),
        openingHours: form.openingHours,
      });
    } catch (err) {
      const message = getErrorMessage(err, "Erro ao salvar");
      toastError(message);
      setErrors({ title: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Título do local"
        value={form.title}
        error={errors.title}
        onChange={(e) => {
          setForm({ ...form, title: e.target.value });
          clearError("title");
        }}
        required
      />
      <Textarea
        label="Descrição do local"
        value={form.description}
        error={errors.description}
        onChange={(e) => {
          setForm({ ...form, description: e.target.value });
          clearError("description");
        }}
        required
      />
      <Select
        label="Categoria"
        hint="Selecione a categoria do local"
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Latitude"
          type="number"
          step="any"
          placeholder="Digite aqui a latitude"
          value={form.latitude}
          error={errors.latitude}
          onChange={(e) => {
            setForm({ ...form, latitude: e.target.value });
            clearError("latitude");
          }}
          required
        />
        <Input
          label="Longitude"
          type="number"
          step="any"
          placeholder="Digite aqui a longitude"
          value={form.longitude}
          error={errors.longitude}
          onChange={(e) => {
            setForm({ ...form, longitude: e.target.value });
            clearError("longitude");
          }}
          required
        />
      </div>
      <Input
        label="Endereço"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <ImageUpload
        label="Imagem do local"
        value={form.imageUrl}
        onChange={(imageUrl) => setForm({ ...form, imageUrl })}
      />
      <label className="flex items-center gap-2 text-sm text-accent-dark">
        <input
          type="checkbox"
          checked={form.available}
          onChange={(e) => setForm({ ...form, available: e.target.checked })}
          className="rounded-[4px]"
        />
        Disponível para visitação
      </label>

      <OpeningHoursEditor
        value={form.openingHours}
        onChange={(openingHours) => setForm({ ...form, openingHours })}
      />

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-accent-dark">Links úteis</span>
        {form.links.map((link, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Input
              label="Rótulo do link"
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
            />
            <Input
              label="URL do link"
              type="url"
              value={link.url}
              onChange={(e) => updateLink(i, "url", e.target.value)}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            setForm({ ...form, links: [...form.links, { label: "", url: "" }] })
          }
        >
          + Adicionar link
        </Button>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
