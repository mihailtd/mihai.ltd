// Single source of truth for who Mihai is, how the site is named, and the
// schema.org entities every page references. Keep the wording here identical
// to the LinkedIn / GitHub / Dev.to / n8n bios so search engines and AI
// assistants see one consistent entity across the web.

export const SITE_URL = "https://mihai.ltd";
export const SITE_NAME = "Mihai Farcas";
export const PERSON_NAME = "Mihai Farcas";
export const PERSON_HEADLINE = "Software Architect · Agentic AI, n8n & MCP";
export const PERSON_SUMMARY =
  "Mihai Farcas is a Software Architect with 10+ years of experience building enterprise systems in healthcare, fintech and insurance. He designs and ships production Agentic AI applications, n8n automation workflows and MCP servers, writes for the official n8n blog, and publishes tutorials on the Let's Talk Dev YouTube channel.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_ID = `${SITE_URL}/#innovi-pro`;

// Every profile that is the same person. Order matters only for readability.
export const PROFILE_LINKS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mihai-farcas-ltd/",
  },
  { name: "GitHub", url: "https://github.com/mihailtd" },
  {
    name: "YouTube — Let's Talk Dev",
    url: "https://www.youtube.com/@letstalkdev",
  },
  { name: "Dev.to", url: "https://dev.to/mihailtd" },
  { name: "Medium", url: "https://medium.com/@mihailtd" },
  { name: "n8n Blog author page", url: "https://blog.n8n.io/author/mihai/" },
  { name: "n8n Creator templates", url: "https://n8n.io/creators/mihailtd/" },
];

export const absoluteUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_NAME,
  alternateName: ["Mihai Farcaș", "Mihai Fărcaș", "mihailtd"],
  url: `${SITE_URL}/`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/mihai_farcas.webp`,
    caption: "Mihai Farcas, Software Architect",
  },
  jobTitle: "Software Architect",
  description: PERSON_SUMMARY,
  worksFor: {
    "@type": "Organization",
    name: "Marsh",
    url: "https://www.corporate.marsh.com/global/home.html",
  },
  homeLocation: {
    "@type": "Place",
    name: "Cluj-Napoca, Romania",
  },
  nationality: { "@type": "Country", name: "Romania" },
  knowsAbout: [
    "Software Architecture",
    "Agentic AI",
    "AI Agents",
    "AI Automation",
    "n8n",
    "Model Context Protocol (MCP)",
    "LangGraph",
    "Retrieval-Augmented Generation (RAG)",
    "Graph RAG",
    "Azure OpenAI",
    "Microservices",
    "Kubernetes",
    "Node.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "Vue.js",
    "Nuxt",
    "PostgreSQL",
    "MongoDB",
    "SQL Server",
    "Healthcare interoperability (FHIR, HL7, DICOM)",
  ],
  sameAs: PROFILE_LINKS.map((l) => l.url),
};

export const SERVICES = [
  {
    id: "agentic-ai",
    name: "Agentic AI system design & implementation",
    description:
      "Design and delivery of production Agentic AI applications — multi-agent orchestration with LangGraph, RAG and Graph RAG pipelines, evaluation and guardrails — on Azure OpenAI, OpenAI, Anthropic Claude or Google Gemini.",
  },
  {
    id: "n8n-automation",
    name: "n8n workflow automation",
    description:
      "Custom n8n workflows and AI agents, self-hosted n8n in queue mode on Docker or Kubernetes, and migrations from Zapier or Make.",
  },
  {
    id: "mcp-servers",
    name: "MCP server development",
    description:
      "Model Context Protocol servers that expose internal tools and data to Claude, ChatGPT and GitHub Copilot.",
  },
  {
    id: "architecture",
    name: "Fractional software architecture & AI design reviews",
    description:
      "Architecture reviews, technology selection and fractional architect / CTO support for teams building enterprise systems and AI features.",
  },
];

export const organizationNode = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "INNOVI PRO",
  url: "https://innovi.pro/",
  logo: `${SITE_URL}/innovi_pro_logo.png`,
  image: `${SITE_URL}/innovi_pro_logo.png`,
  description:
    "Software architecture and AI automation consultancy founded by Mihai Farcas: Agentic AI, n8n workflows, MCP servers and enterprise-grade architecture.",
  founder: { "@id": PERSON_ID },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software architecture & AI automation services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": `${SITE_URL}/#service-${s.id}`,
        name: s.name,
        description: s.description,
        serviceType: s.name,
        provider: { "@id": PERSON_ID },
        areaServed: "Worldwide",
      },
    })),
  },
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: "mihai.ltd",
  description: `${PERSON_NAME} — ${PERSON_HEADLINE}. Architecture write-ups, a hands-on tech radar, book notes and consulting.`,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
};

export type Crumb = { name: string; path: string };

export const breadcrumbNode = (crumbs: Crumb[], pageUrl: string) => ({
  "@type": "BreadcrumbList",
  "@id": `${pageUrl}#breadcrumb`,
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

// Adds a page-specific JSON-LD graph. The site-wide Person/WebSite/
// Organization graph is injected once by plugins/seo.ts; page nodes only
// reference those by @id.
export const useJsonLd = (
  key: string,
  nodes: (() => Record<string, unknown>[]) | Record<string, unknown>[],
) => {
  useHead({
    script: [
      {
        key: `ld-${key}`,
        type: "application/ld+json",
        innerHTML: computed(() =>
          JSON.stringify({
            "@context": "https://schema.org",
            "@graph": typeof nodes === "function" ? nodes() : nodes,
          }),
        ),
      },
    ],
  });
};
