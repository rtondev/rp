import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface AuthLogoProps {
  className?: string;
}

export function AuthLogo({ className }: AuthLogoProps) {
  return (
    <Link href="/" className={cn("inline-block shrink-0", className)}>
      <Image
        src="/logo.svg"
        alt="Rota Potiguar"
        width={180}
        height={40}
        priority
        className="h-auto w-[180px] max-w-full"
      />
    </Link>
  );
}
