import { WorldScene } from "./WorldScene";
import { SceneEnvironment } from "./SceneEnvironment";
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
  Bell,
  Clipboard,
  Download,
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
    id: "signalizeai",
    name: "SignalizeAI",
    icons: [Monitor, ScanSearch, Workflow, Bell],
    title: "Research once. Watch what changes.",
    description:
      "A Manifest V3 extension with a browser-side watch loop, structured page snapshots, and a Cloudflare Workers backend for research and change summaries.",
    flow: [
      { title: "Read the page", detail: "Browser-side extraction" },
      { title: "Build the brief", detail: "Extension + Workers API" },
      { title: "Watch & compare", detail: "Alarms · snapshots · diff" },
      { title: "Surface changes", detail: "Alerts + outreach context" },
    ],
    decisions: [
      {
        title: "Keep fetching in the browser",
        text: "The extension reads watched pages while the browser is running. The backend does not run a crawler.",
      },
      {
        title: "Separate noise from change",
        text: "Structured snapshot comparison suppresses whitespace, reordered navigation, tracking parameters, and failed price extraction.",
      },
      {
        title: "Keep state across checks",
        text: "Supabase handles authentication, saved prospects, and stored snapshots; the extension handles scheduling and extraction.",
      },
    ],
    href: "https://github.com/SignalizeAI/SignalizeAI#how-change-detection-works",
    link: "Read the architecture",
    scope:
      "Research and watch paths, simplified. Watch checks require the browser to be running.",
  },
  {
    id: "boardeject",
    name: "BoardEject",
    icons: [Clipboard, Braces, Layers, Download],
    title: "Your board. A new format. All local.",
    description:
      "A local-first Freeform-to-Excalidraw pipeline: a Mac helper captures a copied selection, a browser worker parses it, and a normalized board model feeds the converter and fidelity report.",
    flow: [
      { title: "Capture selection", detail: "Mac clipboard helper" },
      { title: "Parse & normalize", detail: "Browser worker · libfreeform" },
      { title: "Preview & report", detail: "Editable + unsupported items" },
      { title: "Export locally", detail: ".excalidraw download" },
    ],
    decisions: [
      {
        title: "Keep boards on the device",
        text: "Capture and conversion happen locally. There is no board-upload service or account requirement.",
      },
      {
        title: "Normalize before converting",
        text: "A shared board model separates Freeform decoding from Excalidraw output and preview.",
      },
      {
        title: "Make fidelity visible",
        text: "The conversion report identifies supported, partial, and unsupported items. Keep the original board; arbitrary Freeform versions are not supported.",
      },
    ],
    href: "https://github.com/royalpinto007/boardeject#how-it-works",
    link: "Read how it works",
    scope:
      "Editable-export path for the verified Freeform 4.5 subset. No board uploads.",
  },
];

/** Native radio controls keep architecture exploration usable without JavaScript. */
export function SystemsShowcase() {
  return (
    <section
      className="systems-showcase immersive-chapter"
      id="systems"
      aria-labelledby="systems-title"
    >
      <SceneEnvironment scene="atrium" />
      <p className="section-marker">
        <span>02 / Under the hood</span>
        <span>Follow the decisions, not just the arrows</span>
      </p>
      <div className="systems-heading section-intro world-heading">
        <h2 id="systems-title">
          Beyond
          <br />
          <span>the interface.</span>
        </h2>
        <WorldScene kind="engine" />
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
            <span>
              <small aria-hidden="true">0{i + 1}</small>
              {system.name}
            </span>
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
            <fieldset className="architecture-walkthrough">
              <legend>Follow the data</legend>
              <label>
                <input
                  type="radio"
                  name={`walk-${system.id}`}
                  value="all"
                  defaultChecked
                />
                <span>Full system</span>
              </label>
              {system.flow.map((step, i) => (
                <label key={step.title}>
                  <input type="radio" name={`walk-${system.id}`} value={i} />
                  <span>
                    <b>{i + 1}</b>
                    {step.title}
                  </span>
                </label>
              ))}
            </fieldset>
            <ArchitectureMap system={system.id} />
            <ol
              className="system-flow"
              aria-label={`${system.name} simplified data flow`}
            >
              {system.flow.map((node, i) => {
                const Icon = system.icons[i];
                return (
                  <li key={node.title} data-stage={i}>
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
