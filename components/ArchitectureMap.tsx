import type { CSSProperties } from "react";

type GraphNode = {
  id: string;
  x: number;
  y: number;
  title: string;
  sub: string;
  tone?: string;
};
type GraphEdge = {
  path: string;
  label?: string;
  x?: number;
  y?: number;
  dashed?: boolean;
};
const graphs: Record<
  string,
  { description: string; nodes: GraphNode[]; edges: GraphEdge[] }
> = {
  aashinyra: {
    description:
      "Scheduled ingestion reads retailer catalogs into PostgreSQL. An explicit publication job copies the catalog to D1. The browser uses Next.js on Workers, which reads D1 and uses R2 for media and cache. Supabase provides authentication and row-level security. Publication and request serving are separate paths.",
    nodes: [
      {
        id: "retailers",
        x: 20,
        y: 48,
        title: "Retailer catalogs",
        sub: "External sources",
      },
      {
        id: "ingest",
        x: 260,
        y: 48,
        title: "Scheduled ingestion",
        sub: "GitHub Actions",
        tone: "blue",
      },
      {
        id: "postgres",
        x: 500,
        y: 48,
        title: "PostgreSQL",
        sub: "Catalog source of truth",
        tone: "violet",
      },
      {
        id: "publish",
        x: 760,
        y: 48,
        title: "Catalog publication",
        sub: "Explicit sync job",
        tone: "pink",
      },
      {
        id: "browser",
        x: 20,
        y: 225,
        title: "Browser",
        sub: "Browse · filter · discover",
      },
      {
        id: "app",
        x: 260,
        y: 225,
        title: "Next.js / Workers",
        sub: "Live application",
        tone: "blue",
      },
      {
        id: "d1",
        x: 760,
        y: 225,
        title: "D1 read model",
        sub: "Published catalog",
        tone: "pink",
      },
      {
        id: "auth",
        x: 20,
        y: 402,
        title: "Supabase Auth",
        sub: "Identity + PostgreSQL RLS",
        tone: "violet",
      },
      {
        id: "r2",
        x: 500,
        y: 402,
        title: "R2",
        sub: "Media + incremental cache",
        tone: "peach",
      },
    ],
    edges: [
      { path: "M210 90 H260" },
      { path: "M450 90 H500" },
      { path: "M690 90 H760" },
      { path: "M855 132 V225", label: "publish", x: 868, y: 182 },
      { path: "M210 267 H260", label: "request", x: 215, y: 251 },
      { path: "M760 267 H450", label: "catalog reads", x: 560, y: 250 },
      { path: "M355 309 V444 H500", label: "media / cache", x: 365, y: 382 },
      { path: "M115 309 V402", label: "sign in", x: 130, y: 365, dashed: true },
    ],
  },
  signalizeai: {
    description:
      "The current page is extracted in the browser and sent through the extension UI to the Workers API for research. Separately, browser alarms trigger watched-page extraction; structured snapshots are compared and genuine changes become alerts. Supabase stores authentication, saved prospects, and snapshots. Site fetching happens in the browser, not a backend crawler.",
    nodes: [
      {
        id: "page",
        x: 20,
        y: 48,
        title: "Current page",
        sub: "Browser content extraction",
      },
      {
        id: "ui",
        x: 260,
        y: 48,
        title: "Extension UI",
        sub: "Manifest V3 side panel",
        tone: "blue",
      },
      {
        id: "api",
        x: 500,
        y: 48,
        title: "Workers API",
        sub: "Research + change summary",
        tone: "violet",
      },
      {
        id: "brief",
        x: 760,
        y: 48,
        title: "Research brief",
        sub: "Grounded outreach context",
        tone: "peach",
      },
      {
        id: "alarm",
        x: 20,
        y: 225,
        title: "Browser alarms",
        sub: "Scheduled watch sweep",
        tone: "blue",
      },
      {
        id: "snapshots",
        x: 260,
        y: 225,
        title: "Page snapshots",
        sub: "Home · pricing · careers",
        tone: "pink",
      },
      {
        id: "diff",
        x: 500,
        y: 225,
        title: "Structured diff",
        sub: "Suppress extraction noise",
        tone: "violet",
      },
      {
        id: "alerts",
        x: 760,
        y: 225,
        title: "Change alerts",
        sub: "Before / after + badge",
        tone: "peach",
      },
      {
        id: "supabase",
        x: 260,
        y: 402,
        title: "Supabase",
        sub: "Auth · prospects · snapshots",
        tone: "pink",
      },
    ],
    edges: [
      { path: "M210 90 H260" },
      { path: "M450 90 H500" },
      { path: "M690 90 H760" },
      { path: "M210 267 H260" },
      { path: "M450 267 H500" },
      { path: "M690 267 H760" },
      { path: "M595 225 V132", label: "summary", x: 610, y: 182, dashed: true },
      { path: "M355 309 V402", label: "store", x: 365, y: 365 },
      {
        path: "M450 444 H715 V330 H595 V309",
        label: "previous snapshot",
        x: 540,
        y: 428,
        dashed: true,
      },
      {
        path: "M355 132 V225",
        label: "save & watch",
        x: 365,
        y: 182,
        dashed: true,
      },
    ],
  },
  agentpostmortem: {
    description:
      "A YAML scenario declares the task, the faults and the checks. The runner seeds deterministic simulated services and fires each fault at its chosen call while the agent under test works through its tools. Every real effect is written to a side-effect ledger. Oracles judge the ledger and the agent's final claim, a validity check confirms the declared faults actually fired, and the results land in results.json and report.html, which can gate CI.",
    nodes: [
      { id: "scenario", x: 20, y: 48, title: "YAML scenario", sub: "Task · faults · checks" },
      { id: "runner", x: 260, y: 48, title: "Runner", sub: "Seeds sims, fires faults", tone: "blue" },
      { id: "agent", x: 500, y: 48, title: "Agent under test", sub: "Reference, framework, MCP", tone: "violet" },
      { id: "sims", x: 760, y: 48, title: "Simulated services", sub: "Payments, email, orders…", tone: "pink" },
      { id: "ledger", x: 760, y: 225, title: "Side-effect ledger", sub: "Applied + deduplicated", tone: "pink" },
      { id: "oracles", x: 500, y: 225, title: "Oracles", sub: "no_duplicate_effects …", tone: "violet" },
      { id: "validity", x: 260, y: 225, title: "Validity check", sub: "Did the faults fire?", tone: "blue" },
      { id: "report", x: 20, y: 225, title: "Results + report", sub: "results.json · report.html", tone: "peach" },
      { id: "ci", x: 20, y: 402, title: "CI gate", sub: "--fail-on-fail" },
    ],
    edges: [
      { path: "M210 90 H260" },
      { path: "M450 90 H500" },
      { path: "M690 90 H760" },
      { path: "M855 132 V225", label: "effects", x: 866, y: 182 },
      { path: "M760 267 H690" },
      { path: "M595 132 V225", label: "final claim", x: 606, y: 182 },
      { path: "M500 267 H450" },
      { path: "M260 267 H210" },
      { path: "M115 309 V402", label: "gate", x: 126, y: 360, dashed: true },
    ],
  },
  boardeject: {
    description:
      "A copied Freeform selection passes through the local Mac helper into a versioned capture. A browser worker parses it with libfreeform and normalizes it into a shared board model. The Excalidraw converter creates editable output; preview and fidelity reports expose unsupported items before download. Board data stays on the device. This map covers editable export, not the separate archive flow.",
    nodes: [
      {
        id: "selection",
        x: 20,
        y: 48,
        title: "Freeform selection",
        sub: "Copied objects on the Mac",
      },
      {
        id: "helper",
        x: 260,
        y: 48,
        title: "Mac helper",
        sub: "Local clipboard snapshot",
        tone: "blue",
      },
      {
        id: "capture",
        x: 500,
        y: 48,
        title: "Versioned capture",
        sub: ".boardeject envelope",
        tone: "violet",
      },
      {
        id: "worker",
        x: 760,
        y: 48,
        title: "Browser worker",
        sub: "Parse with libfreeform",
        tone: "pink",
      },
      {
        id: "download",
        x: 20,
        y: 225,
        title: "Local download",
        sub: ".excalidraw file",
        tone: "peach",
      },
      {
        id: "preview",
        x: 260,
        y: 225,
        title: "Editable preview",
        sub: "Review before exporting",
        tone: "blue",
      },
      {
        id: "converter",
        x: 500,
        y: 225,
        title: "Excalidraw converter",
        sub: "Supported board elements",
        tone: "violet",
      },
      {
        id: "model",
        x: 760,
        y: 225,
        title: "Shared board model",
        sub: "Normalized shapes + assets",
        tone: "pink",
      },
      {
        id: "report",
        x: 500,
        y: 402,
        title: "Fidelity report",
        sub: "Partial + unsupported items",
        tone: "peach",
      },
    ],
    edges: [
      { path: "M210 90 H260" },
      { path: "M450 90 H500" },
      { path: "M690 90 H760" },
      { path: "M855 132 V225", label: "normalize", x: 866, y: 182 },
      { path: "M760 267 H690" },
      { path: "M500 267 H450" },
      { path: "M260 267 H210" },
      {
        path: "M855 309 V444 H690",
        label: "report",
        x: 866,
        y: 374,
        dashed: true,
      },
      { path: "M500 444 H355 V309", dashed: true },
    ],
  },
  kabootar: {
    description:
      "A message gets a uuid, is sealed to the recipient's key and signed, and is saved to SQLite as sending. The mesh engine marks the id as seen, keeps a carry copy and floods it through Nearby Connections over Bluetooth and Wi-Fi. Relay phones de-duplicate by id, lower the TTL from 8 and carry up to 500 envelopes for 24 hours. The recipient verifies, decrypts and stores the message, then floods an acknowledgement back that clears carried copies and marks the sender's row delivered. There is no server.",
    nodes: [
      {
        id: "compose",
        x: 20,
        y: 48,
        title: "Compose",
        sub: "uuid id · ChatService",
      },
      {
        id: "seal",
        x: 260,
        y: 48,
        title: "Seal & sign",
        sub: "X25519 · AES-GCM · Ed25519",
        tone: "violet",
      },
      {
        id: "mesh",
        x: 500,
        y: 48,
        title: "Mesh engine",
        sub: "Mark seen · carry · flood",
        tone: "blue",
      },
      {
        id: "nearby",
        x: 760,
        y: 48,
        title: "Nearby transport",
        sub: "Bluetooth + Wi-Fi P2P",
        tone: "pink",
      },
      {
        id: "relay",
        x: 760,
        y: 225,
        title: "Relay phones",
        sub: "Dedup · TTL 8 · 24h carry",
        tone: "pink",
      },
      {
        id: "recipient",
        x: 500,
        y: 225,
        title: "Recipient phone",
        sub: "Verify · decrypt · store",
        tone: "blue",
      },
      {
        id: "ack",
        x: 260,
        y: 225,
        title: "End-to-end ack",
        sub: "Floods back, clears copies",
        tone: "peach",
      },
      {
        id: "messages",
        x: 20,
        y: 402,
        title: "SQLite messages",
        sub: "sending → delivered → read",
        tone: "violet",
      },
      {
        id: "seen",
        x: 500,
        y: 402,
        title: "SQLite seen set",
        sub: "Dedup ids · kept 48h",
        tone: "peach",
      },
    ],
    edges: [
      { path: "M210 90 H260" },
      { path: "M450 90 H500" },
      { path: "M690 90 H760" },
      { path: "M855 132 V225", label: "hop", x: 866, y: 182 },
      { path: "M760 267 H690", label: "flood", x: 702, y: 252 },
      { path: "M500 267 H450" },
      { path: "M355 309 V444 H210", label: "delivered", x: 365, y: 382 },
      { path: "M115 132 V402", label: "persist", x: 128, y: 270 },
      { path: "M595 309 V402", label: "dedup", x: 607, y: 360, dashed: true },
    ],
  },
};

export function ArchitectureMap({
  system,
  instance = "",
}: {
  system: string;
  instance?: string;
}) {
  const phases: Record<string, string[][]> = {
    aashinyra: [
      ["retailers", "ingest"],
      ["postgres", "auth"],
      ["publish", "d1"],
      ["browser", "app", "r2"],
    ],
    signalizeai: [
      ["page", "ui"],
      ["api", "brief"],
      ["alarm", "snapshots", "diff", "supabase"],
      ["alerts", "brief"],
    ],
    agentpostmortem: [
      ["scenario", "runner"],
      ["runner", "agent", "sims"],
      ["sims", "ledger"],
      ["oracles", "validity", "report", "ci"],
    ],
    boardeject: [
      ["selection", "helper", "capture"],
      ["worker", "model"],
      ["converter", "preview", "report"],
      ["download"],
    ],
    kabootar: [
      ["compose", "seal", "messages"],
      ["mesh", "nearby"],
      ["relay", "recipient", "seen"],
      ["recipient", "ack", "messages"],
    ],
  };
  const wirePhases: Record<string, number[][]> = {
    aashinyra: [[0], [1, 7], [2, 3], [4, 5, 6]],
    signalizeai: [[0], [1, 2], [3, 4, 6, 7, 8, 9], [5, 6]],
    agentpostmortem: [[0], [1, 2], [3], [4, 5, 6, 7, 8]],
    boardeject: [[0, 1], [2, 3], [4, 5, 7, 8], [6]],
    kabootar: [
      [0, 7],
      [1, 2],
      [3, 4, 8],
      [5, 6],
    ],
  };
  const names: Record<string, string> = {
    aashinyra: "AashiNyra",
    signalizeai: "SignalizeAI",
    boardeject: "BoardEject",
    agentpostmortem: "AgentPostmortem",
    kabootar: "Kabootar",
  };
  const mapId = `${system}${instance}`;
  const graph = graphs[system];
  return (
    <svg
      className="architecture-map"
      viewBox="0 0 970 520"
      role="img"
      aria-labelledby={`${mapId}-map-title ${mapId}-map-desc`}
    >
      <title id={`${mapId}-map-title`}>{`${names[system]} architecture`}</title>
      <desc id={`${mapId}-map-desc`}>{graph.description}</desc>
      <defs>
        <marker
          id={`${mapId}-arrow`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            d="M1 1 L9 5 L1 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </marker>
      </defs>
      <g className="architecture-wires" aria-hidden="true">
        {graph.edges.map((edge, i) => (
          <g
            key={i}
            data-stages={wirePhases[system]
              .flatMap((indices, stage) => (indices.includes(i) ? [stage] : []))
              .join(" ")}
            style={
              {
                // Full-system view staggers packets by the wire's first stage.
                "--stage": Math.max(
                  0,
                  wirePhases[system].findIndex((indices) =>
                    indices.includes(i),
                  ),
                ),
              } as CSSProperties
            }
          >
            <path
              className={edge.dashed ? "map-wire map-wire-dashed" : "map-wire"}
              d={edge.path}
              pathLength={edge.dashed ? undefined : 1}
              markerEnd={`url(#${mapId}-arrow)`}
            />
            {!edge.dashed && (
              <path className="map-packet" d={edge.path} pathLength="100" />
            )}
            {edge.label && (
              <text x={edge.x} y={edge.y}>
                {edge.label}
              </text>
            )}
          </g>
        ))}
      </g>
      <g aria-hidden="true">
        {graph.nodes.map((node, i) => (
          <g
            className={`map-node map-node-${node.tone || "neutral"}`}
            key={node.id}
            data-stages={phases[system]
              .flatMap((nodes, stage) =>
                nodes.includes(node.id) ? [stage] : [],
              )
              .join(" ")}
            transform={`translate(${node.x} ${node.y})`}
          >
            <rect width="190" height="84" rx="9" />
            <text className="map-step" x="15" y="20">
              0{i + 1}
            </text>
            <text className="map-title" x="15" y="43">
              {node.title}
            </text>
            <text className="map-sub" x="15" y="64">
              {node.sub}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
