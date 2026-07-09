import type { Metadata } from "next";
import {
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Clock,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/BrandIcons";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for AI products, backend systems, freelance work, or collaborations.",
};

export default function ContactPage() {
  const channels = [
    { icon: Calendar, label: "Book a call", desc: "30-min intro call", href: siteConfig.calendarLink, cta: "Schedule" },
    { icon: MessageSquare, label: "WhatsApp", desc: "Quick questions", href: siteConfig.whatsappLink, cta: "Message" },
    { icon: Mail, label: "Email", desc: siteConfig.email, href: `mailto:${siteConfig.email}`, cta: "Send email" },
    { icon: Phone, label: "Phone", desc: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}`, cta: "Call" },
  ];

  const socials = [
    { icon: LinkedinIcon, label: "LinkedIn", href: siteConfig.linkedin },
    { icon: GithubIcon, label: "GitHub", href: siteConfig.github },
    { icon: TwitterIcon, label: "X / Twitter", href: siteConfig.twitter },
  ];

  return (
    <div className="max-w-[1300px] mx-auto px-5 sm:px-8 py-20">
      <SectionHeader
        eyebrow="Get in touch"
        title="Let's"
        titleEm="talk"
        subtitle="AI products, backend systems, freelance work, collaborations — pick the channel that works best."
      />

      {/* Main CTA Card */}
      <div className="rounded-xl border border-line bg-panel p-10 sm:p-12 mb-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-accent tracking-wide">Available now</span>
        </div>
        <h2 className="text-2xl sm:text-3xl text-ink mb-3 font-normal">
          Building something <span className="display-em text-accent">with AI?</span>
        </h2>
        <p className="text-mute mb-8 max-w-md leading-relaxed">
          Tell me what you&apos;re working on. I&apos;ll reply within 24 hours with how
          I can help.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={siteConfig.hireUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-bg text-sm font-semibold px-6 py-3 rounded-full hover:bg-accent-hover transition-colors"
          >
            Hire me <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href={siteConfig.calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-line-strong text-ink text-sm px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors"
          >
            <Calendar className="w-4 h-4" /> Book a 30-min call
          </a>
          <a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-mute text-sm px-4 py-3 hover:text-ink transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp me
          </a>
        </div>
      </div>

      {/* Direct channels */}
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint mb-5">
        Direct channels
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {channels.map(({ icon: Icon, label, desc, href, cta }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-xl border border-line bg-panel hover:border-line-strong transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center mb-4">
              <Icon className="w-4 h-4 text-accent" />
            </div>
            <div className="text-sm text-ink">{label}</div>
            <div className="text-xs text-faint mt-1 mb-4 break-all">{desc}</div>
            <span className="text-xs font-medium text-accent group-hover:text-accent-hover transition-colors">
              {cta} →
            </span>
          </a>
        ))}
      </div>

      {/* Socials */}
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint mb-5">
        Find me online
      </h3>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 rounded-xl border border-line bg-panel hover:border-line-strong transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center">
              <Icon className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm text-ink group-hover:text-accent transition-colors">
              {label}
            </span>
          </a>
        ))}
      </div>

      {/* Logistics */}
      <div className="rounded-xl border border-line bg-panel p-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint mb-6">
          Logistics
        </h3>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { icon: MapPin, label: "Location", value: siteConfig.location },
            { icon: Clock, label: "Timezone", value: siteConfig.timezone },
            { icon: Zap, label: "Reply time", value: siteConfig.replyTime },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-faint">{label}</div>
                <div className="text-sm text-ink mt-0.5">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
