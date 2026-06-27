"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";
import { Spin } from "@/components/ui/Spin";

function EntrarPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const placeId = searchParams.get("placeId");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setRedirecting(true);
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    }
  }, [loading, user, router, nextPath]);

  if (loading || redirecting || user) {
    return <Spin fullScreen loop={false} label="Entrando..." />;
  }

  return (
    <PhoneAuthForm
      nextPath={nextPath}
      proximityTarget={placeId ? { placeId } : undefined}
    />
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={<Spin fullScreen loop={false} label="Carregando..." />}>
      <EntrarPageContent />
    </Suspense>
  );
}
