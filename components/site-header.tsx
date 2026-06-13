import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/#calendar", label: "Calendar" },
  { href: "/organisers", label: "Organisers" },
  { href: "/touring-comics", label: "Touring Comics" },
  { href: "/#map", label: "Map" },
  { href: "/#venues", label: "Venues" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-violet-500/25 bg-zinc-950/85 shadow-[0_0_24px_-8px_rgba(139,92,246,0.35)] backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/75">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 pt-6 pb-4 sm:px-5 sm:pt-8">
        <Link
          href="/"
          className="flex flex-col items-center gap-3 text-center transition-opacity hover:opacity-95"
        >
          <Image
            src="/krakow-comedy-logo.png"
            alt=""
            aria-hidden
            width={1200}
            height={1200}
            className="h-72 w-72 max-w-[min(95vw,42rem)] object-contain sm:h-[24rem] sm:w-[24rem] md:h-[28rem] md:w-[28rem]"
            priority
          />
        </Link>
        <nav className="mx-auto flex w-full flex-wrap items-center justify-center gap-1 border-t border-violet-500/20 pt-4 text-[0.92rem] sm:gap-2 sm:text-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-violet-500/30 bg-zinc-900/70 px-2 py-1 sm:px-3.5 sm:py-2 font-semibold tracking-[0.01em] text-cyan-100 transition-all hover:-translate-y-0.5 hover:border-cyan-400/45 hover:bg-violet-950/80 hover:text-white hover:shadow-[0_0_16px_-3px_rgba(34,211,238,0.4)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
