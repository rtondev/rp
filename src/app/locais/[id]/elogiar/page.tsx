"use client";

import { SignalPlaceForm } from "@/components/places/SignalPlaceForm";

export default function ElogiarLocalPage() {
  return (
    <SignalPlaceForm
      type="ELOGIO"
      title="Elogiar local"
      subtitle="Conte o que tornou este lugar especial"
      emoji="⭐"
      showPriority={false}
      placeholder="Ex.: vista incrível, atendimento excelente, comida deliciosa..."
    />
  );
}
