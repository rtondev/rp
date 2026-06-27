"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Trash, UploadSimple } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { fieldLabelClass } from "@/lib/field";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  folder?: string;
}

export function ImageUpload({
  label = "Imagem",
  value,
  onChange,
  error,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.uploads.image(file);
      onChange(result.url);
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao enviar imagem"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span id={`${inputId}-label`} className={fieldLabelClass()}>
          {label}
        </span>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-labelledby={label ? `${inputId}-label` : undefined}
      />

      {value ? (
        <div className="overflow-hidden rounded-[6px] border border-border">
          <div className="relative h-40 w-full media-placeholder">
            <Image
              src={value}
              alt="Pré-visualização da imagem"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <UploadSimple size={18} className="mr-2" />
              {uploading ? "Enviando..." : "Trocar imagem"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={uploading}
              onClick={() => onChange("")}
              aria-label="Remover imagem"
            >
              <Trash size={18} />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-[6px] border border-dashed border-border bg-input-bg text-sm text-muted transition hover:border-accent hover:text-accent-dark disabled:opacity-60"
        >
          <ImageIcon size={28} weight="duotone" className="text-accent" />
          <span>{uploading ? "Enviando imagem..." : "Enviar imagem"}</span>
          <span className="text-xs">PNG, JPG ou WEBP até 5 MB</span>
        </button>
      )}

      {error && <FieldError message={error} />}
    </div>
  );
}
