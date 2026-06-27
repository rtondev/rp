import Link from "next/link";
import { SpinScreen } from "@/components/splash/SpinScreen";

export default function SpinPage() {
  return (
    <SpinScreen>
      <p className="mt-6 text-center text-sm text-muted">
        Splash de teste com a logo animada
      </p>
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-accent-dark underline-offset-2 hover:underline"
      >
        Ir para o início
      </Link>
    </SpinScreen>
  );
}
