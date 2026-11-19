import type { Metadata } from "next";
import { profile } from "@/data/profile";

export const siteUrl = "https://royalpinto007.com";

const socialImage = {
  url: "https://assets.royalpinto007.com/social-sky.jpg",
  width: 1200,
  height: 630,
  alt: "Royal Simpson Pinto, software engineer, in the coastal sunset portfolio hero",
};

/**
 * Per-page metadata. Next.js does not merge nested openGraph/twitter objects,
 * so every page sets its own title, description, canonical URL and cards.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title
    ? `${title} | ${profile.name}`
    : `${profile.name} | ${profile.role}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: path === "/" ? "profile" : "website",
      url: path,
      siteName: profile.name,
      locale: "en_US",
      title: fullTitle,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@royalpinto007",
      creator: "@royalpinto007",
      title: fullTitle,
      description,
      images: [socialImage.url],
    },
  };
}

/** Structured data for the person behind the site. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        alternateName: "Royal Pinto",
        jobTitle: profile.role,
        description: profile.bio,
        url: siteUrl,
        image: profile.avatar,
        email: `mailto:${profile.email}`,
        sameAs: [profile.github, profile.twitter],
        knowsAbout: [
          "AI agents",
          "Full-stack development",
          "Backend systems",
          "Automation",
          "Web3",
          "Solana",
          "Open source",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: profile.name,
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
    ],
  };
}

/** JSON-LD is serialised with "<" escaped so it can never close the script tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
