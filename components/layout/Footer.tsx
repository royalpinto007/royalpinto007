import "./footer.css";
import { ProjectsScenery } from "@/components/scenery/ProjectsScenery";
import Link from "next/link";
import { ArrowUpRight, Coffee, Star } from "lucide-react";
import { siteConfig } from "@/lib/data/site";
import { CopyEmail } from "@/components/ui/CopyEmail";

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
          <div className="footer-email-actions">
            <a className="primary-link" href={`mailto:${siteConfig.email}`}>
              Send email <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <CopyEmail email={siteConfig.email} className="footer-copy-email" />
          </div>
          <p className="footer-email">{siteConfig.email}</p>
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
          <a
            href="https://github.com/royalpinto007/royalpinto007"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Star size={13} aria-hidden="true" /> Star this site
          </a>
          <a
            href="https://www.buymeacoffee.com/royalpinto007"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Coffee size={13} aria-hidden="true" /> Buy me a coffee
          </a>
        </nav>
      </div>
    </footer>
  );
}
