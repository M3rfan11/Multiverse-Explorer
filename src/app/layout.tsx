import type { Metadata } from "next";
import { Chakra_Petch, Inter, Space_Mono } from "next/font/google";
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
      className={`${inter.variable} ${chakraPetch.variable} ${spaceMono.variable}`}
    >
      <body>
        <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
          <div className="bg-portal-glow absolute inset-0" />
          <div className="bg-grid absolute inset-0" />
          <div className="bg-stars absolute inset-0" />
          <div className="absolute -top-40 left-1/4 size-[480px] animate-aurora rounded-full bg-portal-500/10 blur-3xl" />
          <div className="absolute right-1/5 top-32 size-[420px] animate-aurora-slow rounded-full bg-rick-blue/10 blur-3xl" />
          <Particles />
        </div>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
