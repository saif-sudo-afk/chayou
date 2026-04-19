import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SessionAppProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chayou-jewels.vercel.app"),
  title: {
    default: "CHAYOU JEWELS",
    template: "%s | CHAYOU JEWELS",
  },
  description: "Modern, minimal & durable jewelry shipping across Morocco.",
  applicationName: "CHAYOU JEWELS",
  keywords: [
    "Moroccan jewelry",
    "luxury jewelry",
    "minimal jewelry",
    "CHAYOU JEWELS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${manrope.variable} antialiased`}>
        <SessionAppProvider>
          {children}
          <Toaster />
        </SessionAppProvider>
      </body>
    </html>
  );
}
