"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { SignalType } from "@/lib/types";
import type { PriorityValue } from "@/lib/priorities";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { PriorityPicker } from "@/components/ui/PriorityPicker";
import { toastError } from "@/lib/toast";
import { collectSubmitContext, getGeoErrorMessage } from "@/lib/device-context";
import { getErrorMessage, required } from "@/lib/validate";

interface SignalPlaceFormProps {
  type: SignalType;
  title: string;
  subtitle: string;
  emoji: string;
  showPriority?: boolean;
  showRating?: boolean;
  placeholder?: string;
}

export function SignalPlaceForm({
  type,
  title,
  subtitle,
  emoji,
  showPriority = type === "SINALIZACAO",
  showRating = type === "ELOGIO",
  placeholder = "Escreva sua mensagem...",
}: SignalPlaceFormProps) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [priority, setPriority] = useState<PriorityValue>(3);
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState<string>();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) router.replace("/entrar");
  }, [user, router]);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (showRating && rating < 1) {
      setRatingError("Selecione de 1 a 5 estrelas");
      toastError("Selecione uma nota em estrelas");
      return;
    }

    const validation = required(message, "Escreva sua mensagem");
    if (validation) {
      setMessageError(validation);
      toastError("Verifique os campos destacados");
      return;
    }

    setLoading(true);
    try {
      const submitContext = await collectSubmitContext();
      await api.places.signal(id, {
        type,
        priority: showPriority ? priority : 0,
        message,
        submitContext,
        ...(showRating ? { rating } : {}),
      });
      router.push(`/locais/${id}`);
    } catch (err) {
      const msg = getErrorMessage(err, getGeoErrorMessage(err));
      toastError(msg);
      setMessageError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} backHref={`/locais/${id}`} />

      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <span className="text-3xl" aria-hidden>
          {emoji}
        </span>
        <p className="text-sm text-muted">
          {type === "SINALIZACAO"
            ? "Descreva o problema e escolha o nível de urgência. Você precisa estar a até 100m do local."
            : "Dê uma nota em estrelas e conte o que você mais gostou. Você precisa estar a até 100m do local."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {showRating && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <StarRating
              label="Sua nota"
              value={rating}
              onChange={(value) => {
                setRating(value);
                if (ratingError) setRatingError(undefined);
              }}
              size={36}
            />
            {ratingError && (
              <p className="mt-2 text-sm text-red-500">{ratingError}</p>
            )}
            {rating > 0 && (
              <p className="mt-2 text-sm text-muted">
                {rating === 5
                  ? "Excelente! ⭐"
                  : rating >= 4
                    ? "Muito bom!"
                    : rating >= 3
                      ? "Bom"
                      : rating >= 2
                        ? "Regular"
                        : "Precisa melhorar"}
              </p>
            )}
          </div>
        )}
        {showPriority && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <PriorityPicker value={priority} onChange={setPriority} />
          </div>
        )}
        <Textarea
          label="Sua mensagem"
          placeholder={placeholder}
          value={message}
          error={messageError}
          onChange={(e) => {
            setMessage(e.target.value);
            if (messageError) setMessageError(undefined);
          }}
          required
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Enviando..." : showRating ? "Enviar elogio ⭐" : "Enviar sinalização 🚩"}
        </Button>
      </form>
    </div>
  );
}
