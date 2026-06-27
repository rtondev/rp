"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChatCircleDots,
  FileText,
  Heart,
  MapPin,
  Palette,
  ShieldCheck,
  SignOut,
  User,
  UserCircle,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { formatPhoneDisplay } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShortcutLink } from "@/components/ui/ShortcutLink";
import { ShortcutAction } from "@/components/ui/ShortcutAction";
import { ShortcutSection } from "@/components/ui/ShortcutSection";

function LegalShortcuts() {
  return (
    <ShortcutSection title="Legal">
      <ShortcutLink
        href="/termos"
        label="Termos de uso"
        icon={FileText}
        iconClassName="text-slate-500"
      />
      <ShortcutLink
        href="/privacidade"
        label="Política de privacidade"
        icon={ShieldCheck}
        iconClassName="text-green-600"
      />
    </ShortcutSection>
  );
}

export default function PerfilPage() {
  const {
    user,
    logout,
    isTurista,
    canRespondSignals,
    isAdmin,
  } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-2 py-8 text-center">
        <div className="mb-2 w-full max-w-[280px]">
          <Image
            src="/travelword.svg"
            alt="Explore o mundo com a Rota Potiguar"
            width={280}
            height={226}
            priority
            className="mx-auto h-auto w-full"
          />
        </div>

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-accent-dark">
          Sua jornada começa aqui
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
          Entre ou crie uma conta para salvar favoritos, sinalizar locais e
          personalizar sua experiência.
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Link href="/entrar" className="w-full">
            <Button fullWidth>Entrar com celular</Button>
          </Link>
          <Link href="/acesso-profissional" className="w-full">
            <Button fullWidth variant="secondary">
              Acesso gestor/admin
            </Button>
          </Link>
        </div>

        <div className="mt-10 w-full max-w-xs">
          <ShortcutSection title="Preferências">
            <ShortcutLink
              href="/perfil/aparencia"
              label="Aparência e acessibilidade"
              icon={Palette}
              iconClassName="text-violet-500"
            />
          </ShortcutSection>
          <LegalShortcuts />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Perfil" subtitle="Gerencie sua conta" />

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <User size={28} weight="duotone" />
        </div>
        <div>
          <h2 className="font-semibold text-accent-dark">{user.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {user.phone
              ? formatPhoneDisplay(user.phone)
              : user.email}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <ShortcutSection title="Conta">
          <ShortcutLink
            href="/perfil/editar"
            label="Editar perfil"
            icon={UserCircle}
            iconClassName="text-blue-500"
          />
        </ShortcutSection>

        <ShortcutSection title="Preferências">
          <ShortcutLink
            href="/perfil/aparencia"
            label="Aparência e acessibilidade"
            icon={Palette}
            iconClassName="text-violet-500"
          />
        </ShortcutSection>

        {isTurista && (
          <ShortcutSection title="Minha viagem">
            <ShortcutLink
              href="/favoritos"
              label="Meus favoritos"
              icon={Heart}
              iconClassName="text-rose-500"
            />
            <ShortcutLink
              href="/minhas-sinalizacoes"
              label="Minhas sinalizações"
              icon={ChatCircleDots}
              iconClassName="text-amber-500"
            />
          </ShortcutSection>
        )}

        {canRespondSignals && (
          <ShortcutSection title="Gestão">
            {!isAdmin && (
              <ShortcutLink
                href="/gestor/locais"
                label="Meus locais"
                icon={MapPin}
                iconClassName="text-accent"
              />
            )}
            <ShortcutLink
              href="/gestor/sinalizacoes"
              label="Sinalizações pendentes"
              icon={Bell}
              iconClassName="text-amber-500"
            />
          </ShortcutSection>
        )}

        <LegalShortcuts />

        <ShortcutSection title="Sessão">
          <ShortcutAction
            label="Sair da conta"
            icon={SignOut}
            variant="danger"
            onClick={() => {
              logout();
              router.push("/entrar");
            }}
          />
        </ShortcutSection>
      </div>
    </div>
  );
}
