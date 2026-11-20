import studies from "@/content/case-studies.json";

export type CaseStudySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  points?: string[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  kind: string;
  headline: string;
  summary: string;
  scene: string;
  links?: { label: string; href: string }[];
  facts: { label: string; value: string }[];
  sections: CaseStudySection[];
};

/** Case studies, in page order. Content lives in R2 (content/case-studies.json). */
export const caseStudies: CaseStudy[] = studies;

export const caseStudyFor = (slug: string) => caseStudies.find((s) => s.slug === slug);
