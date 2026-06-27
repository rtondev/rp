"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const VLIBRAS_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";
const VLIBRAS_ROOT = "https://vlibras.gov.br/app";

export function VLibrasWidget() {
  const { vlibrasEnabled } = useAccessibility();
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
    if (!vlibrasEnabled) {
      initialized.current = false;
    }
  }, [vlibrasEnabled]);

  useEffect(() => {
    if (!vlibrasEnabled) return;
    if (window.VLibras) {
      initWidget();
    }
  }, [vlibrasEnabled]);

  if (!vlibrasEnabled) return null;

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
