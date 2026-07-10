export const siteConfig = {
  name: "Royal Simpson Pinto",
  initials: "RSP",
  role: "Software Engineer",
  location: "Mangaluru, India",
  timezone: "IST (UTC+5:30)",
  bio: "I build AI-powered products and agentic workflows, contribute to open source compilers and networking systems, and ship things that work.",
  shortBio: "Software engineer building AI-first products and contributing to open source.",
  email: "royalpinto007@gmail.com",
  phone: "+91 7337834185",
  whatsappLink: "https://wa.me/917337834185",
  calendarLink: "https://cal.com/royalpinto007",
  github: "https://github.com/royalpinto007",
  linkedin: "https://linkedin.com/in/royalpinto007",
  twitter: "https://twitter.com/royalpinto007",
  mediumUsername: "royalpinto007",
  mediumFeedUrl: "https://medium.com/feed/@royalpinto007",
  hireUrl: "https://hire.agentpostmortem.com",
  availability: "Open to new opportunities — AI, full-stack, and open source work",
  availabilityStatus: true,
  replyTime: "Within 24 hours",
  avatar: "/avatar.webp",

  stats: [
    { label: "Open source contributions", value: "1500+" },
    { label: "Live products shipped", value: "10+" },
    { label: "Students mentored", value: "500+" },
  ],

  currently: [
    "Building agentic AI workflows with n8n and Claude API for clients",
    "Running a suite of five live AI agents for support, debugging, and ops",
    "Growing SignalizeAI — a sales-research extension on Chrome and Firefox",
    "Contributing to open source compilers, networking systems, and AI tooling",
  ],

  services: [
    {
      icon: "Brain",
      title: "AI Agents & Automation",
      description:
        "Agentic workflows, LLM integrations, and AI-powered product features that solve real problems.",
      tags: ["Claude API", "OpenAI", "n8n"],
    },
    {
      icon: "Layers",
      title: "Full-stack Engineering",
      description:
        "End-to-end product development — from React frontends to Node.js backends and cloud deployments.",
      tags: ["Next.js", "TypeScript", "Node.js"],
    },
    {
      icon: "Server",
      title: "Open Source Systems",
      description:
        "Compiler development, network OS contributions, documentation, and low-level systems engineering.",
      tags: ["D", "C++", "Linux"],
    },
    {
      icon: "Palette",
      title: "Browser Extensions & Tools",
      description:
        "Chrome and Firefox extensions, VS Code extensions, and developer tools built with modern web tech.",
      tags: ["Chrome APIs", "Cloudflare", "Supabase"],
    },
  ],

  techStack: {
    Frontend: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Vite.js"],
    Backend: ["Node.js", "Express", "PHP", "REST APIs", "Drupal"],
    "AI / Agents": ["Claude API", "OpenAI", "Gemini AI", "n8n", "SerpAPI"],
    Databases: ["SQL", "Supabase", "Cloudflare Workers"],
    Languages: ["JavaScript", "Python", "C++", "D", "PHP"],
    Tools: ["Git", "Ansible", "GNS3", "Wrangler", "GitHub Actions"],
  },

  projects: [
    {
      id: "signalizeai",
      name: "SignalizeAI",
      category: "AI",
      status: "Production",
      description:
        "Sales-research browser extension on the Chrome and Firefox stores — AI-based prospecting and outreach with batch analysis and CSV export.",
      features: [
        "Side panel flows for quick analysis, saved prospects, search, and filters",
        "Batch prospecting for file uploads and pasted URLs",
        "CSV and Excel export for bulk outreach generation",
        "Supabase and Cloudflare Workers backend with Google auth and plan limits",
      ],
      tech: ["TypeScript", "Cloudflare Workers", "Supabase", "Chrome APIs"],
      featured: true,
      section: "AI Products",
      liveUrl: "https://signalizeai.org",
      githubUrl: "https://github.com/royalpinto007",
    },
    {
      id: "agent-suite",
      name: "Agent Suite",
      category: "AI",
      status: "Production",
      description:
        "Five live AI agents — Resolvd, Tracecase, Webhands, Bridgekit, and Greenlite — covering support triage, incident debugging, browser automation, integrations, and code review.",
      features: [
        "Five production agents deployed and running end-to-end",
        "Built on n8n workflows and the Claude API",
        "Supabase persistence with Cloudflare Workers delivery",
        "Live demos available for each agent",
      ],
      tech: ["Claude API", "n8n", "Supabase", "Cloudflare Workers"],
      featured: true,
      section: "AI Products",
      liveUrl: "https://hire.agentpostmortem.com",
      githubUrl: "https://github.com/royalpinto007",
    },
    {
      id: "proofclip",
      name: "ProofClip",
      category: "AI",
      status: "Production",
      description:
        "Testimonial-wall SaaS — collect customer testimonials with a shareable form and embed a wall of social proof on any site.",
      features: [
        "Hosted collection forms with zero-code setup",
        "Embeddable testimonial walls",
        "Moderation and curation dashboard",
      ],
      tech: ["Next.js", "TypeScript", "Supabase", "Cloudflare"],
      featured: true,
      section: "AI Products",
      liveUrl: "https://proofclip.agentpostmortem.com",
      githubUrl: "https://github.com/royalpinto007",
    },
    {
      id: "aashinyra",
      name: "AashiNyra",
      category: "Frontend",
      status: "Production",
      description:
        "Fashion discovery and affiliate commerce platform — curated collections with affiliate-powered checkout.",
      features: [
        "Curated fashion discovery feeds",
        "Affiliate commerce integration",
        "Fast, image-heavy storefront experience",
      ],
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      featured: true,
      section: "AI Products",
      liveUrl: "https://aashinyra.com",
      githubUrl: "https://github.com/royalpinto007",
    },
    {
      id: "water",
      name: "Water",
      category: "Open Source",
      status: "Production",
      description:
        "VS Code extension that estimates the water footprint of your AI usage — making the environmental cost of LLM calls visible in the editor.",
      features: [
        "Live water-footprint estimates for AI-assisted coding",
        "Per-session and cumulative usage tracking",
        "Lightweight status bar integration",
      ],
      tech: ["TypeScript", "VS Code API"],
      featured: false,
      section: "Open Source & Tools",
      liveUrl: "https://water.signalizeai.org",
      githubUrl: "https://github.com/royalpinto007/Water",
    },
    {
      id: "html-mp4",
      name: "HTML-MP4",
      category: "Open Source",
      status: "Open Source",
      description:
        "Turn HTML animations into deterministic MP4 video — frame-accurate rendering of web animations to shareable video files.",
      features: [
        "Deterministic, frame-accurate capture of HTML/CSS/JS animations",
        "Headless rendering pipeline to MP4",
        "Reproducible output for CI and content workflows",
      ],
      tech: ["TypeScript", "Node.js", "FFmpeg"],
      featured: false,
      section: "Open Source & Tools",
      liveUrl: "#",
      githubUrl: "https://github.com/royalpinto007/HTML-MP4",
    },
    {
      id: "dmd-sarif",
      name: "DMD Compiler — SARIF & Squiggles",
      category: "Open Source",
      status: "Open Source",
      description:
        "Compiler contributions to the D language — implemented SARIF support and squiggle/caret error messages in DMD.",
      features: [
        "SARIF support for standardized static analysis reporting and tool integration",
        "Squiggle and caret support for detailed, IDE-friendly error messages",
        "Updated 1,500+ compiler tests for correctness",
        "Built d-errors-docs for improved developer experience",
      ],
      tech: ["D", "DMD Compiler", "SARIF", "C++"],
      featured: false,
      section: "Open Source & Tools",
      liveUrl: "#",
      githubUrl: "https://github.com/royalpinto007",
    },
    {
      id: "drupal-chatbot",
      name: "Drupal Chatbot",
      category: "Open Source",
      status: "Open Source",
      description:
        "Built during Google Summer of Code 2023 — an AI chatbot integrated into Drupal to assist new contributor onboarding.",
      features: [
        "Integrated OpenAI and RapidAPI for intelligent contributor Q&A",
        "Drupal module architecture for seamless CMS integration",
        "Top 2% selection from 160 countries in GSoC 2023",
      ],
      tech: ["PHP", "Drupal", "OpenAI", "JavaScript"],
      featured: false,
      section: "Open Source & Tools",
      liveUrl: "#",
      githubUrl: "https://github.com/royalpinto007/drupal-chatbot",
    },
    {
      id: "dent-docs",
      name: "DENT Network OS — Docs & Automation",
      category: "Open Source",
      status: "Open Source",
      description:
        "Network documentation and Ansible automation for the DENT Network Operating System at the Linux Foundation.",
      features: [
        "Authored DENT documentation across the TCP/IP protocol stack",
        "Configured 30+ networking topologies in GNS3 and DENT Labs",
        "Top 6% globally (874/14,024) in LFX Mentorship 2023–24",
      ],
      tech: ["Ansible", "GNS3", "Linux", "TCP/IP"],
      featured: false,
      section: "Open Source & Tools",
      liveUrl: "#",
      githubUrl: "https://github.com/royalpinto007",
    },
  ],

  footerLinks: {
    Pages: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    Connect: [
      { label: "GitHub", href: "https://github.com/royalpinto007" },
      { label: "LinkedIn", href: "https://linkedin.com/in/royalpinto007" },
      { label: "X / Twitter", href: "https://twitter.com/royalpinto007" },
      { label: "Medium", href: "https://medium.com/@royalpinto007" },
    ],
  },
};
