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
  tenantq: {
    description:
      "Tenant context is mandatory before retrieval. Both dense and sparse Qdrant searches apply the tenant filter independently. Reciprocal rank fusion combines the results and returns tenant-scoped hits. Cross-tenant tests validate isolation; benchmarks measure recall and tail latency, with Prometheus instrumentation.",
    nodes: [
      {
        id: "request",
        x: 10,
        y: 210,
        title: "Query + tenant",
        sub: "Required tenant context",
      },
      {
        id: "filter",
        x: 240,
        y: 210,
        title: "Tenant filter",
        sub: "Applied to both branches",
        tone: "violet",
      },
      {
        id: "dense",
        x: 500,
        y: 58,
        title: "Dense search",
        sub: "Qdrant · tenant filter",
        tone: "blue",
      },
      {
        id: "sparse",
        x: 500,
        y: 350,
        title: "Sparse search",
        sub: "Qdrant · tenant filter",
        tone: "pink",
      },
      {
        id: "fusion",
        x: 760,
        y: 210,
        title: "Rank fusion",
        sub: "RRF → scoped results",
        tone: "peach",
      },
      {
        id: "tests",
        x: 240,
        y: 402,
        title: "Isolation tests",
        sub: "Cross-tenant leak checks",
        tone: "violet",
      },
      {
        id: "measure",
        x: 760,
        y: 402,
        title: "Measure + observe",
        sub: "Recall · p95/p99 · metrics",
        tone: "peach",
      },
    ],
    edges: [
      { path: "M200 252 H240" },
      { path: "M430 252 H465 V100 H500", label: "parallel", x: 455, y: 183 },
      { path: "M430 252 H465 V392 H500" },
      { path: "M690 100 H725 V252 H760" },
      { path: "M690 392 H725 V252 H760" },
      { path: "M335 402 V294", dashed: true },
      { path: "M855 294 V402", dashed: true },
    ],
  },
  vaultrag: {
    description:
      "A question arrives with user identity. Database group membership supplies query-time authorization. The ACL predicate restricts retrieval before the vector and text results enter rank fusion and the cited answer. Unauthorized chunks never enter the context. Evaluation checks both recall and leak rate.",
    nodes: [
      {
        id: "question",
        x: 10,
        y: 58,
        title: "Question + user",
        sub: "FastAPI request",
      },
      {
        id: "groups",
        x: 250,
        y: 58,
        title: "Resolve groups",
        sub: "Database permissions",
        tone: "violet",
      },
      {
        id: "acl",
        x: 490,
        y: 58,
        title: "ACL predicate",
        sub: "Applied inside retrieval",
        tone: "pink",
      },
      {
        id: "vector",
        x: 750,
        y: 58,
        title: "Vector search",
        sub: "pgvector + ACL",
        tone: "blue",
      },
      {
        id: "text",
        x: 750,
        y: 245,
        title: "Text search",
        sub: "PostgreSQL + ACL",
        tone: "blue",
      },
      {
        id: "fusion",
        x: 490,
        y: 245,
        title: "Rank fusion",
        sub: "Authorized context only",
        tone: "pink",
      },
      {
        id: "answer",
        x: 250,
        y: 245,
        title: "Cited answer",
        sub: "References to source chunks",
        tone: "peach",
      },
      {
        id: "exclude",
        x: 490,
        y: 410,
        title: "Unauthorized chunks",
        sub: "Excluded before context",
        tone: "violet",
      },
      {
        id: "eval",
        x: 10,
        y: 410,
        title: "Evaluation",
        sub: "Recall + leak rate",
        tone: "peach",
      },
    ],
    edges: [
      { path: "M200 100 H250" },
      { path: "M440 100 H490" },
      { path: "M680 100 H750" },
      { path: "M705 100 V287 H750" },
      { path: "M845 142 V195 H585 V245" },
      { path: "M750 287 H680" },
      { path: "M490 287 H440" },
      { path: "M490 100 H465 V452 H490", dashed: true },
      { path: "M345 329 V452 H200", dashed: true },
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
  const mapId = `${system}${instance}`;
  const graph = graphs[system];
  return (
    <svg
      className="architecture-map"
      viewBox="0 0 970 520"
      role="img"
      aria-labelledby={`${mapId}-map-title ${mapId}-map-desc`}
    >
      <title
        id={`${mapId}-map-title`}
      >{`${system === "aashinyra" ? "AashiNyra" : system === "tenantq" ? "Tenantq" : "VaultRAG"} architecture`}</title>
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
          <g key={i}>
            <path
              className={edge.dashed ? "map-wire map-wire-dashed" : "map-wire"}
              d={edge.path}
              pathLength={edge.dashed ? undefined : 1}
              markerEnd={`url(#${mapId}-arrow)`}
            />
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
