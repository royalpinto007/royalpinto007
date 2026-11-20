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
            {study.live && (
              <a className="hero-cta hero-cta-primary" href={study.live} target="_blank" rel="noopener noreferrer">
                Open {study.name} <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}
            {study.source && (
              <a className="hero-cta" href={study.source} target="_blank" rel="noopener noreferrer">
                Read the source <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="case-study-body">
        <aside className="case-study-aside" aria-label={`${study.name} at a glance`}>
          <dl>
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          {study.links && (
            <div className="case-study-aside-links">
              <h2>Links</h2>
              {study.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
          <nav aria-label="On this page">
            {study.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="case-study-article">
          {study.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
              {section.flow && (
                <figure className="case-study-flow">
                  <ol>
                    {section.flow.steps.map((step, i) => (
                      <li key={step.title}>
                        <span className="case-study-flow-n">{i + 1}</span>
                        <strong>{step.title}</strong>
                        <span>{step.detail}</span>
                      </li>
                    ))}
                  </ol>
                  <figcaption>{section.flow.caption}</figcaption>
                </figure>
              )}
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <Point key={point} text={point} />
                  ))}
                </ul>
              )}
            </section>
          ))}
          <section id="skills">
            <h2>Skills it shows</h2>
            <ul className="case-study-skills">
              {study.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
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
