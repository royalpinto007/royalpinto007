import { WorldScene } from "./WorldScene";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-invitation">
        <WorldScene kind="horizon" />
        <div>
          <h2>
            Need a
            <br />
            developer?
          </h2>
          <p>
            Freelance projects, developer roles and open-source collaborations.
            Let’s talk.
          </p>
        </div>
        <a className="primary-link" href={siteConfig.hireUrl}>
          Hire me <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav aria-label="Footer navigation">
          <Link href="/contact" prefetch={false}>
            Contact
          </Link>
          <a href={siteConfig.github}>GitHub</a>
          <a href={siteConfig.linkedin}>LinkedIn</a>
          <a href={siteConfig.twitter}>X</a>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
        </nav>
      </div>
    </footer>
  );
}
