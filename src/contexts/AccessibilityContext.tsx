"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getStoredVLibrasEnabled,
  setStoredVLibrasEnabled,
} from "@/lib/vlibras";

type AccessibilityContextValue = {
  vlibrasEnabled: boolean;
  setVLibrasEnabled: (enabled: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vlibrasEnabled, setVLibrasEnabledState] = useState(false);

  useEffect(() => {
    setVLibrasEnabledState(getStoredVLibrasEnabled());
  }, []);

  const setVLibrasEnabled = useCallback((enabled: boolean) => {
    setVLibrasEnabledState(enabled);
    setStoredVLibrasEnabled(enabled);
  }, []);

  const value = useMemo(
    () => ({ vlibrasEnabled, setVLibrasEnabled }),
    [vlibrasEnabled, setVLibrasEnabled],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useAccessibility deve ser usado dentro de AccessibilityProvider",
    );
  }
  return ctx;
}
