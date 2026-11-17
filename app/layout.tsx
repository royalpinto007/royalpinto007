import type { Metadata, Viewport } from "next";
import { Anton, Geist } from "next/font/google";
import { PortfolioMotion } from "@/components/PortfolioMotion";
import { Header } from "@/components/Header";
import { CoffeeTicker } from "@/components/CoffeeTicker";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";
import { pageMetadata, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./coastal-theme.css";
import "./interface-polish.css";
import "./links.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-coastal-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  keywords: [
    "Royal Simpson Pinto",
    "Royal Pinto",
    "software engineer",
    "indie developer",
    "freelance developer",
    "AI agents",
    "full-stack developer",
    "Solana developer",
    "open source",
  ],
  formatDetection: { telephone: false, email: false, address: false },
  ...pageMetadata({ description: siteConfig.bio, path: "/" }),
};

export const viewport: Viewport = {
  themeColor: "#f5f6f1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} ${geist.variable} ${display.variable} bg-bg text-ink antialiased`}
      >
        <PortfolioMotion />
        <div className="sunset-atmosphere" aria-hidden="true">
          <div className="sky-current" />
          <div className="sunset-current" />
          <div className="horizon-lines" />
        </div>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <CoffeeTicker />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
