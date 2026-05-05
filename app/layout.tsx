import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krakow Comedy",
  description: "Discover stand-up, open mics, and story slams in Krakow.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(88,28,135,0.35),transparent_55%),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(34,211,238,0.08),transparent_45%),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(217,70,239,0.12),transparent_50%)] text-zinc-100 selection:bg-fuchsia-500/35 selection:text-white">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-5 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
