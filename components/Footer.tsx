import "./footer.css";
import { ProjectsScenery } from "./ProjectsScenery";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer coastal-footer">
      <div className="footer-invitation">
        <ProjectsScenery scene="marina" />
        <div className="footer-copy">
          <h2>
            Need a<br />
            <span>developer?</span>
          </h2>
          <p>Freelance, full-time or open source. Let’s talk.</p>
          <a className="primary-link" href={`mailto:${siteConfig.email}`}>
            Send email <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav aria-label="Footer navigation">
          <Link href="/contact">Contact</Link>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
