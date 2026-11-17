import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projectCollections } from "@/data/project-collections";
import { collectionAliases } from "@/data/project-categories";
import { ProjectCollage } from "@/components/ProjectCollage";
import { ProjectsScenery } from "@/components/ProjectsScenery";
import "../projects.css";

type Props = { params: Promise<{ collection: string }> };
export const dynamicParams = false;
const collections = projectCollections.filter((c) => !c.external);

export function generateStaticParams() {
  return [
    ...collections.map((c) => ({ collection: c.id })),
    ...Object.keys(collectionAliases).map((collection) => ({ collection })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const details = collections.find(
    (c) => c.id === (collectionAliases[collection] ?? collection),
  );
  if (!details) notFound();
  return {
    title: details.title,
    description: details.description,
    alternates: { canonical: `/projects/${details.id}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const details = collections.find(
    (c) => c.id === (collectionAliases[collection] ?? collection),
  );
  if (!details) notFound();
  return (
    <div className="portfolio-shell projects-page collection-page">
      <header className="collection-page-heading">
        <ProjectsScenery
          scene={details.id === "open-source" ? "pavilion" : "marina"}
          priority
        />
        <a
          className="collection-back go-link"
          data-direction="back"
          href={`/projects#${details.id}`}
        >
          <span className="go-link-icon" aria-hidden="true">
            <ArrowLeft />
          </span>
          <span className="go-link-label">All collections</span>
        </a>
        <p className="collection-page-count">{details.count} projects</p>
        <h1>{details.title}</h1>
        <p>{details.description}</p>
      </header>
      {details.groups.length > 1 && (
        <nav className="collection-group-jumps" aria-label="Project groups">
          {details.groups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              {group.title}
              <span>{group.items.length}</span>
            </a>
          ))}
        </nav>
      )}
      <div className="collection-full-groups">
        {details.groups.map((group) => (
          <ProjectCollage key={group.id} group={group} full single />
        ))}
      </div>
    </div>
  );
}
