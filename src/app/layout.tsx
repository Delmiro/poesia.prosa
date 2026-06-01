import type { Metadata, Viewport } from "next";
import { Inter, Lora, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Prosa & Poesia";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Portal Literário`,
    template: `%s | ${siteName}`,
  },
  description:
    "Portal de poesias, crônicas, contos, artigos e revistas digitais. Literatura, cultura e inspiração para leitores apaixonados.",
  keywords: ["poesia", "literatura", "crônicas", "contos", "revista digital", "cultura"],
  authors: [{ name: siteName }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: `${siteName} — Portal Literário`,
    description: "Literatura, poesia e prosa em um só lugar.",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Portal literário com poesias, crônicas e revistas digitais.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1612" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
