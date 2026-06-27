"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";

function EntrarPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const placeId = searchParams.get("placeId");

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    }
  }, [loading, user, router, nextPath]);

  if (loading || user) return null;

  return (
    <PhoneAuthForm
      nextPath={nextPath}
      proximityTarget={placeId ? { placeId } : undefined}
    />
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <EntrarPageContent />
    </Suspense>
  );
}
