import type { ComponentProps } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { caseStudies, caseStudyFor } from "@/lib/data/case-studies";
import { ProjectsScenery } from "@/components/scenery/ProjectsScenery";
import "./case-study.css";

/** "Lead. The rest" becomes a bold lead, when the first sentence is short. */
function Point({ text }: { text: string }) {
  const end = text.search(/[.:] /);
  if (end < 0 || end > 60) return <li>{text}</li>;
  return (
    <li>
      <strong>{text.slice(0, end + 1)}</strong>
      {text.slice(end + 1)}
    </li>
  );
}

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = caseStudyFor((await params).slug);
  if (!study) notFound();
  return pageMetadata({
    title: `${study.name} case study`,
    description: study.summary,
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const study = caseStudyFor((await params).slug);
  if (!study) notFound();
  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];
  return (
    <div className="portfolio-shell case-study-page">
      <header className="case-study-heading">
        <ProjectsScenery
          scene={study.scene as ComponentProps<typeof ProjectsScenery>["scene"]}
          priority
        />
        <Link className="go-link" data-direction="back" href="/#work">
          <span className="go-link-icon" aria-hidden="true">
            <ArrowLeft />
          </span>
          <span className="go-link-label">Selected projects</span>
        </Link>
        <div className="case-study-card">
          <p className="case-study-kind">Case study · {study.kind}</p>
          <h1>{study.name}</h1>
          <p className="case-study-headline">{study.headline}</p>
          <p className="case-study-summary">{study.summary}</p>
          <div className="case-study-links">
            {study.links?.map((link, i) => (
              <a
                key={link.href}
                className={i === 0 ? "hero-cta hero-cta-primary" : "hero-cta"}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="case-study-body">
        <dl className="case-study-facts">
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <article className="case-study-article">
          {study.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <Point key={point} text={point} />
                  ))}
                </ul>
              )}
            </section>
          ))}
          {next.slug !== study.slug && (
            <Link className="case-study-next" href={`/case-studies/${next.slug}`}>
              <span>Next case study</span>
              <strong>{next.name}</strong>
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </article>
      </div>
    </div>
  );
}
