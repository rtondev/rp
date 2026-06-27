"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const VLIBRAS_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";
const VLIBRAS_ROOT = "https://vlibras.gov.br/app";

/**
 * Widget oficial VLibras — carregado uma vez, fora do fluxo de rota.
 * Script com strategy afterInteractive; init idempotente.
 */
export function VLibrasWidget() {
  const initialized = useRef(false);

  const initWidget = () => {
    if (initialized.current || !window.VLibras) return;
    initialized.current = true;
    new window.VLibras.Widget(VLIBRAS_ROOT);
    if (typeof window.onload === "function") {
      window.onload();
    }
  };

  useEffect(() => {
    if (window.VLibras) {
      initWidget();
    }
  }, []);

  return (
    <>
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active" />
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        id="vlibras-plugin"
        src={VLIBRAS_SRC}
        strategy="afterInteractive"
        onLoad={initWidget}
      />
    </>
  );
}
