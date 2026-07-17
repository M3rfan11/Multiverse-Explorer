import type { Metadata } from "next";
import { Chakra_Petch, Inter, Luckiest_Guy, Space_Mono } from "next/font/google";
import { AuroraBlobs } from "@/components/layout/aurora-blobs";
import { CursorCompanion } from "@/components/layout/cursor-companion";
import { Header } from "@/components/layout/header";
import { Particles } from "@/components/layout/particles";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Wordmark only — a properly licensed font with the show's cartoon energy.
const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Multiverse Explorer",
  description:
    "Explore characters and episodes from the Rick and Morty universe.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${chakraPetch.variable} ${spaceMono.variable} ${luckiestGuy.variable}`}
    >
      <body>
        <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
          <div className="bg-portal-glow absolute inset-0" />
          <div className="bg-grid absolute inset-0" />
          <div className="bg-stars absolute inset-0" />
          <AuroraBlobs />
          <Particles />
        </div>
        <CursorCompanion />
        <Providers>
          <Header />
          {children}
        </Providers>
        <footer className="mx-auto max-w-7xl px-4 pb-8 md:px-8 lg:px-12">
          <div className="border-t border-white/5 pt-6 text-xs text-slate-500">
            Built by Mahmoud Irfan for the Tempo take-home · Data from{" "}
            <a
              href="https://rickandmortyapi.com"
              className="underline-offset-2 hover:text-portal-300 hover:underline"
            >
              rickandmortyapi.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
