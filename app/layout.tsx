import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Geist — loaded as a fallback / code utility font.
 * Sets --font-geist-sans CSS variable on <html>.
 * Referenced in globals.css @theme as var(--font-geist-sans).
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Sora ExtraBold — used exclusively for the DOBAR logotype in the Footer.
 * Sets --font-sora CSS variable on <html>.
 * Referenced in globals.css @theme as var(--font-sora) → font-dobar utility.
 */
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["800"],
});

export const metadata: Metadata = {
  title: "bee's care — AI Skin Advisor",
  description: "Your personal AI-powered skincare advisor by bee's care.",
};

/** Prevents iOS from auto-zooming on input focus */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${geistSans.variable} ${sora.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
