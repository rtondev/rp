"use client";

import { useEffect, useId, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrCodeScannerProps {
  active: boolean;
  onScan: (text: string) => void;
  onError?: (message: string) => void;
}

export function QrCodeScanner({
  active,
  onScan,
  onError,
}: QrCodeScannerProps) {
  const elementId = useId().replace(/:/g, "");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    handledRef.current = false;

    if (!active) {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
      return;
    }

    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          if (handledRef.current) return;
          handledRef.current = true;
          onScan(decoded);
        },
        () => {},
      )
      .catch((err) => {
        onError?.(String(err));
      });

    return () => {
      scanner.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [active, elementId, onScan, onError]);

  if (!active) return null;

  return (
    <div
      id={elementId}
      className="overflow-hidden rounded-2xl border border-border bg-black/[0.03]"
    />
  );
}
