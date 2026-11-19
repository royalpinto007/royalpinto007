import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projectCollections } from "@/data/project-collections";
import { SceneEnvironment } from "./SceneEnvironment";

const shelves = [
  {
    id: "experiments",
    line: "Light. Physics. A little curiosity.",
    picks: ["abyss", "magnetic-sand", "fogged-glass"],
  },
  {
    id: "games",
    line: "Made to be played.",
    picks: ["bumblecrate", "revlap", "hushmallow"],
  },
  {
    id: "apps",
    line: "Useful software, on your terms.",
    picks: ["boardeject", "kabootar", "pennyrush"],
  },
  {
    id: "websites",
    line: "Different ideas. Different identities.",
    picks: ["vantage", "lumen", "atlas"],
  },
];
const findCollection = (id: string) => {
  const collection = projectCollections.find((item) => item.id === id);
  if (!collection) throw new Error(`Missing Home collection: ${id}`);
  return collection;
};

/** A compact visual index, distinct from the full project-by-project directory. */
export function HomeProjectExplorer() {
  const web3 = findCollection("web3");
  const tools = web3.groups.flatMap((group) => group.items);
  return (
    <section
      className="home-discovery immersive-chapter"
      id="explore"
      aria-labelledby="explore-title"
    >
      <SceneEnvironment scene="tidal" />
      <header className="discovery-heading chapter-heading">
        <div>
          <h2 id="explore-title">
            More to <span>explore</span>
          </h2>
          <p>Useful, playful, open. There’s more than one way to build.</p>
        </div>
        <Link
          className="go-link go-link-surface"
          data-direction="forward"
          href="/projects"
          prefetch={false}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="go-link-label">All projects</span>
          <span className="go-link-icon" aria-hidden="true">
            <ArrowRight />
          </span>
        </Link>
      </header>
      <div className="discovery-shelves">
        {shelves.map((shelf) => {
          const collection = findCollection(shelf.id);
          const projects = collection.groups.flatMap((group) => group.items);
          return (
            <Link
              className={`discovery-shelf shelf-${shelf.id}`}
              href={`/projects#${shelf.id}`}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              key={shelf.id}
              data-home-collection={shelf.id}
            >
              <div className="shelf-art" aria-hidden="true">
                {shelf.picks.map((id) => {
                  const project = projects.find((item) => item.id === id);
                  if (!project?.image)
                    throw new Error(`Missing Home preview: ${id}`);
                  return (
                    <Image
                      key={id}
                      src={project.image}
                      alt=""
                      width={960}
                      height={640}
                      sizes="(max-width: 767px) 45vw, 25vw"
                    />
                  );
                })}
              </div>
              <div className="shelf-caption">
                <div>
                  <span className="shelf-count">
                    {collection.count} projects
                  </span>
                  <h3>{collection.title}</h3>
                  <p>{shelf.line}</p>
                </div>
                <ArrowUpRight size={25} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
      <section
        className="home-web3"
        data-home-collection="web3"
        aria-labelledby="web3-title"
      >
        <div className="web3-copy">
          <p className="web3-label">Solana & Web3</p>
          <h3 id="web3-title">
            On-chain data.
            <br />
            <span>Human-readable</span>
          </h3>
          <p>
            Open-source tools to inspect permissions, trace transactions and
            debug payments on Solana.
          </p>
          <Link
            className="go-link"
            data-direction="forward"
            href="/projects/web3"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="go-link-label">
              Explore all {web3.count} tools
            </span>
            <span className="go-link-icon" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </div>
        <div className="web3-workbench">
          <p className="web3-workbench-label">
            <span aria-hidden="true">›_</span> Read-only developer tools
          </p>
          <div className="web3-previews">
            {["delegate-inspector", "txray"].map((id) => {
              const project = tools.find((item) => item.id === id);
              if (!project?.image || !project.href)
                throw new Error(`Missing Web3 preview: ${id}`);
              return (
                <a
                  key={id}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="web3-preview"
                >
                  <div className="web3-window-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>
                      {project.id === "txray" ? "txray" : "delegate?"}
                    </span>
                  </div>
                  <Image
                    src={project.image}
                    alt=""
                    width={960}
                    height={640}
                    sizes="(max-width: 767px) 80vw, 25vw"
                  />
                  <span>
                    <strong>{project.name}</strong>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                  <small>{project.kind}</small>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      {/* Apps & products already has a shelf above; only link what Home does not preview. */}
      <nav className="discovery-more" aria-label="More project collections">
        {(() => {
          const collection = findCollection("open-source");
          return (
            <Link
              href={collection.href}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <strong>{collection.title}</strong>
                <small>Docs, modules and source analysis, built in the open.</small>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          );
        })()}
      </nav>
    </section>
  );
}
