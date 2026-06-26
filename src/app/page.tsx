import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#f7f8f9] px-6 py-16">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <Image
          src="/logo.svg"
          alt="Rota Potiguar"
          width={280}
          height={61}
          priority
          className="h-auto w-72 max-w-full"
        />

        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium tracking-tight text-[#1B2D3A]">
            Em breve, tudo muda por aqui.
          </p>
          <p className="text-sm leading-relaxed text-[#1B2D3A]/55">
            A plataforma está sendo preparada nos bastidores.
          </p>
        </div>

        <div className="h-1 w-12 rounded-full bg-[#E17B21]" />
      </main>
    </div>
  );
}
