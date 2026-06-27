"use client";

import { SignalPlaceForm } from "@/components/places/SignalPlaceForm";

export default function SinalizarLocalPage() {
  return (
    <SignalPlaceForm
      type="SINALIZACAO"
      title="Sinalizar local"
      subtitle="Reporte um problema ou situação"
      emoji="🚩"
      placeholder="Ex.: banheiro fechado, lixo acumulado, acesso difícil..."
    />
  );
}
