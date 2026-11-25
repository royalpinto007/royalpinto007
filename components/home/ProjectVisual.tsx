import {
  ArrowRight,
  Braces,
  Check,
  Database,
  FileCode2,
  Fingerprint,
  GitBranch,
  Layers,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

/** Authored product concepts, not screenshots or live customer activity. */
export function ProjectVisual({ product }: { product: string }) {
  return (
    <div className={`product-art product-art-${product}`} aria-hidden="true">
      <div className="product-light" />
      <div className="product-art-topline">
        <span>Inside the product</span>
        <span>↗</span>
      </div>
      {product === "signalizeai" && (
        <div className="signal-art">
          <div className="signal-orbit">
            <Radar size={76} strokeWidth={1} />
            <i />
            <i />
          </div>
          <div className="signal-stack">
            <div className="signal-event">
              <ScanSearch size={20} />
              <span>Research the account</span>
              <Check size={15} />
            </div>
            <div className="signal-event">
              <Sparkles size={20} />
              <span>Find what changed</span>
              <Check size={15} />
            </div>
            <div className="signal-event">
              <ArrowRight size={20} />
              <span>Start the conversation</span>
            </div>
          </div>
          <strong className="product-art-title">
            A reason
            <br />
            to reach out
          </strong>
        </div>
      )}
      {product === "agentpostmortem" && (
        <div className="postmortem-art">
          <div className="incident-sheet">
            <span className="art-eyebrow">
              <GitBranch size={14} /> refund() → timeout → retry
            </span>
            <strong>
              Charged twice?
              <br />
              Find out first
            </strong>
            <div className="incident-line">
              <Fingerprint size={18} />
              <span>50 failure scenarios</span>
            </div>
            <div className="incident-line">
              <ShieldCheck size={18} />
              <span>Judged by real side effects</span>
            </div>
          </div>
          <span className="art-stamp">
            Break it.
            <br />
            On purpose
          </span>
        </div>
      )}
      {product === "aashinyra" && (
        <div className="commerce-art">
          <div className="commerce-window">
            <span>Discover</span>
            <div className="fashion-pieces">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="commerce-engine">
            <Database size={28} strokeWidth={1.4} />
            <span>Catalog</span>
            <i />
            <Workflow size={28} strokeWidth={1.4} />
            <span>Nightly tracking</span>
            <i />
            <Layers size={28} strokeWidth={1.4} />
            <span>Published deals</span>
          </div>
          <strong className="product-art-title">
            Good finds.
            <br />
            Real drops
          </strong>
        </div>
      )}
      {product === "boardeject" && (
        <div className="board-art">
          <div className="board-paper board-before">
            <span>Freeform</span>
            <div className="board-sketch">
              <i />
              <i />
              <i />
              <svg viewBox="0 0 220 140">
                <path d="M50 32 C140 10 65 130 170 100" />
              </svg>
            </div>
          </div>
          <div className="board-convert">
            <FileCode2 size={26} />
            <ArrowRight size={22} />
          </div>
          <div className="board-paper board-after">
            <span>Excalidraw</span>
            <div className="board-sketch">
              <i />
              <i />
              <i />
              <svg viewBox="0 0 220 140">
                <path d="M50 32 C140 10 65 130 170 100" />
              </svg>
            </div>
            <small>
              <Braces size={13} /> Editable elements
            </small>
          </div>
          <strong className="product-art-title">
            Your canvas.
            <br />
            New possibilities
          </strong>
        </div>
      )}
      <span className="product-art-caption">Illustrated product workflow</span>
    </div>
  );
}
