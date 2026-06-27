"use client";

import { useCallback, useState } from "react";
import { LogoAnimada } from "./LogoAnimada";

interface SpinScreenProps {
  children?: React.ReactNode;
}

export function SpinScreen({ children }: SpinScreenProps) {
  const [replayKey, setReplayKey] = useState(0);

  const replay = useCallback(() => {
    setReplayKey((key) => key + 1);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      <LogoAnimada
        replayKey={replayKey}
        className="max-w-[240px]"
      />
      {children}
      <button
        type="button"
        onClick={replay}
        className="mt-10 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition active:opacity-90"
      >
        Repetir animação
      </button>
    </div>
  );
}
