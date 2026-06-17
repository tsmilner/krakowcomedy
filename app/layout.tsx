import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { SiteHeader } from "@/components/site-header";
import { editorialNote } from "@/lib/editorial";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Krakow Comedy Calendar — English stand-up & comedy nights in Kraków",
    template: "%s | Krakow Comedy Calendar",
  },
  description:
    "Curated listings for English-language stand-up, open mics, improv, and story nights in Kraków — dates, venues, organisers, and official event links in one place.",
  keywords: [
    "Kraków comedy",
    "Krakow comedy",
    "English comedy Kraków",
    "stand-up Kraków",
    "open mic Kraków",
    "comedy calendar Kraków",
  ],
  applicationName: "Krakow Comedy Calendar",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Krakow Comedy Calendar",
    title: "Krakow Comedy Calendar — English comedy in Kraków",
    description:
      "Discover curated English-language comedy nights in Kraków: stand-up, open mics, improv, and stories — with venues, organisers, and calendar.",
    images: [
      {
        url: "/krakow-comedy-logo.png",
        width: 1200,
        height: 1200,
        alt: "Krakow Comedy Calendar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krakow Comedy Calendar — English comedy in Kraków",
    description:
      "Curated listings for English-language comedy nights in Kraków — dates, venues, and official links.",
    images: ["/krakow-comedy-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Krakow Comedy Calendar",
        description:
          "Curated guide to English-language comedy nights in Kraków — stand-up, open mics, improv, and story events.",
        inLanguage: "en-GB",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Krakow Comedy Calendar",
        url: siteUrl,
        logo: `${siteUrl}/krakow-comedy-logo.png`,
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(88,28,135,0.35),transparent_55%),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(34,211,238,0.08),transparent_45%),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(217,70,239,0.12),transparent_50%)] text-zinc-100 selection:bg-fuchsia-500/35 selection:text-white">
        <SeoJsonLd data={jsonLd} />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-5 sm:py-12">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-5">
          <nav className="flex flex-wrap items-center justify-center gap-4 border-t border-violet-500/20 pt-5 text-sm text-zinc-300">
            <Link href="/about" className="underline decoration-violet-500/40 underline-offset-2 hover:text-cyan-200">
              About
            </Link>
            <Link
              href="/contact"
              className="underline decoration-violet-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Contact / Submit
            </Link>
            <Link
              href="/organisers"
              className="underline decoration-violet-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Organisers
            </Link>
            <Link
              href="/venues"
              className="underline decoration-violet-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Venues
            </Link>
            <Link
              href="/calendar"
              className="underline decoration-violet-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Calendar
            </Link>
            <Link
              href="/how-this-site-works"
              className="underline decoration-violet-500/40 underline-offset-2 hover:text-cyan-200"
            >
              How this site works
            </Link>
          </nav>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-5 text-zinc-500">
            {editorialNote} Always verify event details with the organiser before attending.
          </p>
        </footer>
      </body>
    </html>
  );
}
