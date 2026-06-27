import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AppShell } from "@/components/layout/AppShell";
import { VLibrasWidget } from "@/components/accessibility/VLibrasWidget";
import { Toaster } from "@/components/ui/Toaster";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rota Potiguar",
  description: "Descubra o melhor do Rio Grande do Norte",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme-preference="system"
      suppressHydrationWarning
    >
      <head>
        <script id="theme-init">{themeInitScript}</script>
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
              <Toaster />
            </AuthProvider>
            <VLibrasWidget />
          </AccessibilityProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
