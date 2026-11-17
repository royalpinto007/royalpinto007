import type { Metadata } from "next";
import { Anton, Geist } from "next/font/google";
import { PortfolioMotion } from "@/components/PortfolioMotion";
import { Header } from "@/components/Header";
import { CoffeeTicker } from "@/components/CoffeeTicker";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";
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
  metadataBase: new URL("https://royalpinto007.com"),
  title: {
    default: `${siteConfig.name} | ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.bio,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.bio,
    type: "website",
    images: [
      {
        url: "/social-sky.jpg",
        width: 1200,
        height: 630,
        alt: "Royal Simpson Pinto, software engineer, in the coastal sunset portfolio hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.bio,
    images: ["/social-sky.jpg"],
  },
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
