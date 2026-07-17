import type { Metadata } from "next";
import { Chakra_Petch, Inter, Luckiest_Guy, Space_Mono } from "next/font/google";
import { CursorCompanion } from "@/components/layout/cursor-companion";
import { Header } from "@/components/layout/header";
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
        <CursorCompanion />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
