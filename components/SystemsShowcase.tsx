import { ArchitectureMap } from "./ArchitectureMap";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Database,
  Workflow,
  Monitor,
  ScanSearch,
  Layers,
  ShieldCheck,
  Users,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

const systems = [
  {
    id: "aashinyra",
    name: "AashiNyra",
    icons: [Workflow, Database, Layers, Monitor],
    title: "One source. Fast reads.",
    description:
      "A commerce platform with scheduled catalog updates, a PostgreSQL source of truth, and a D1 read model for the live site.",
    flow: [
      { title: "Scheduled jobs", detail: "Catalog & price updates" },
      { title: "Source of truth", detail: "Supabase / PostgreSQL" },
      { title: "Read model", detail: "Cloudflare D1" },
      { title: "Live application", detail: "Next.js / Workers" },
    ],
    decisions: [
      {
        title: "Separate reads from writes",
        text: "Scheduled ingestion updates the source catalog; a published read model serves the storefront.",
      },
      {
        title: "Keep access explicit",
        text: "Authentication and row-level security live with the PostgreSQL source of truth.",
      },
      {
        title: "Give media its own home",
        text: "R2 stores media and the application’s incremental cache.",
      },
    ],
    href: "https://aashinyra.com",
    link: "Open the product",
    scope: "Simplified catalog publication and serving flow. Live product.",
  },
  {
    id: "tenantq",
    name: "Tenantq",
    icons: [Braces, ScanSearch, Layers, ShieldCheck],
    title: "Shared engine. Separate tenants.",
    description:
      "A reproducible Qdrant reference deployment that pairs tenant isolation with hybrid retrieval and measured recall and tail latency.",
    flow: [
      { title: "Query + tenant", detail: "Explicit tenant context" },
      { title: "Filtered retrieval", detail: "Qdrant / dense + sparse" },
      { title: "Rank fusion", detail: "Reciprocal rank fusion" },
      { title: "Scoped results", detail: "Hits for this tenant" },
    ],
    decisions: [
      {
        title: "Scope every retrieval branch",
        text: "Dense and sparse searches both carry the tenant filter before their results are fused.",
      },
      {
        title: "Measure the trade-off",
        text: "A benchmark reports Recall@K alongside p50, p95, and p99 latency when tuning the index.",
      },
      {
        title: "Test the boundary",
        text: "Cross-tenant leak tests and Prometheus metrics make isolation and behavior inspectable.",
      },
    ],
    href: "https://github.com/AgentPostmortem/Tenantq#architecture",
    link: "Read the architecture",
    scope: "Simplified query path. Open-source reference deployment.",
  },
  {
    id: "vaultrag",
    name: "VaultRAG",
    icons: [MessageSquare, Users, Database, ShieldCheck],
    title: "Permission first. Answers second.",
    description:
      "A FastAPI and PostgreSQL retrieval system that applies access control before documents can enter the answer context.",
    flow: [
      { title: "Question + user", detail: "Caller identity context" },
      { title: "Resolve access", detail: "Groups from the database" },
      { title: "Scoped retrieval", detail: "SQL ACL / pgvector + text" },
      { title: "Cited answer", detail: "Verified source references" },
    ],
    decisions: [
      {
        title: "Filter before fetching",
        text: "The ACL predicate is part of retrieval, so unauthorized chunks never enter the context.",
      },
      {
        title: "Make revocation immediate",
        text: "Permissions are evaluated on each query rather than waiting for an index rebuild.",
      },
      {
        title: "Check safety and usefulness",
        text: "The evaluation pairs leak rate with recall; returning nothing cannot count as success.",
      },
    ],
    href: "https://github.com/AgentPostmortem/VaultRAG#design-decisions",
    link: "Read the design decisions",
    scope: "Simplified retrieval flow. Open-source engineering project.",
  },
];

/** Native radio controls keep architecture exploration usable without JavaScript. */
export function SystemsShowcase() {
  return (
    <section
      className="systems-showcase"
      id="systems"
      aria-labelledby="systems-title"
    >
      <div className="systems-heading section-intro">
        <h2 id="systems-title">
          System design. <span>In motion.</span>
        </h2>
      </div>
      <fieldset className="system-picker">
        <legend className="sr-only">Choose a system to explore</legend>
        {systems.map((system, i) => (
          <label key={system.id}>
            <input
              type="radio"
              name="system-design"
              id={`system-${system.id}`}
              value={system.id}
              defaultChecked={i === 0}
            />
            <span>{system.name}</span>
          </label>
        ))}
      </fieldset>
      <div className="system-cases">
        {systems.map((system) => (
          <article
            className="system-case"
            key={system.id}
            data-system={system.id}
            aria-labelledby={`title-${system.id}`}
          >
            <div className="system-case-intro">
              <div>
                <h3 id={`title-${system.id}`}>{system.title}</h3>
              </div>
              <a
                className="quiet-link"
                href={system.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {system.link}
                <ArrowUpRight size={17} />
              </a>
            </div>
            <ArchitectureMap system={system.id} />
            <ol
              className="system-flow"
              aria-label={`${system.name} simplified data flow`}
            >
              {system.flow.map((node, i) => {
                const Icon = system.icons[i];
                return (
                  <li key={node.title}>
                    <div className="system-node">
                      <span className="system-step" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <Icon
                        className="system-glyph"
                        size={48}
                        strokeWidth={1.25}
                        aria-hidden="true"
                      />
                      <strong>{node.title}</strong>
                      <span className="system-node-detail">{node.detail}</span>
                    </div>
                    {i < system.flow.length - 1 && (
                      <span className="system-connector" aria-hidden="true">
                        <i />
                        <ArrowRight size={18} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            <details className="system-full-map">
              <summary>
                Explore the full architecture{" "}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <div
                className="architecture-scroll"
                role="region"
                aria-label={`${system.name} full architecture, scroll horizontally`}
                tabIndex={0}
              >
                <ArchitectureMap system={system.id} instance="-mobile" />
              </div>
            </details>
            <p className="system-scope">{system.scope}</p>
            <details className="system-notes">
              <summary>
                Design notes <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <p className="system-description">{system.description}</p>
              <div className="system-decisions">
                {system.decisions.map((decision) => (
                  <div key={decision.title}>
                    <h4>{decision.title}</h4>
                    <p>{decision.text}</p>
                  </div>
                ))}
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
