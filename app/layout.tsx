import type { Metadata } from "next";
import { Barlow, Open_Sans } from "next/font/google";
import "./atalian.css";
import "./pilote.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pilote Data — Atalian",
  description: "Cockpit chef de projet data Atalian",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${barlow.variable} ${openSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
