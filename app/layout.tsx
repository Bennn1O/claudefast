import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ClaudeFast — Configure Claude Code en 2 minutes",
  description:
    "3 questions. Ton CLAUDE.md personnalisé, les skills et MCPs adaptés à ton profil — prêts à coller dans ton terminal.",
  metadataBase: new URL("https://claudefast.vercel.app"),
  openGraph: {
    title: "ClaudeFast — Configure Claude Code en 2 minutes",
    description:
      "3 questions. Ton CLAUDE.md personnalisé, les skills et MCPs adaptés à ton profil.",
    type: "website",
    url: "https://claudefast.vercel.app",
    siteName: "ClaudeFast",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaudeFast",
    description: "CLAUDE.md personnalisé + skills + MCPs en 2 minutes.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${dmSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
