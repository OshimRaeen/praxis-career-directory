import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Praxis Career Atlas — Global Job Directory & Outcomes",
  description:
    "Explore real-world career tracks, salary ranges, equity benchmarks, live listings, and personalized roadmaps for Praxis apprentices and mentees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${ibmMono.variable}`}>
      <body className="min-h-screen bg-surface-paper font-sans text-ink-primary antialiased">
        {children}
      </body>
    </html>
  );
}