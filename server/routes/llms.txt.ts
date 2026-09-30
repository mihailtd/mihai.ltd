import { defineEventHandler, setHeader, type H3Event } from "h3";
import { queryCollection } from "@nuxt/content/server";

// /llms.txt — a plain-markdown map of the site for LLMs and AI search
// (https://llmstxt.org). Generated from the content collections at build
// time so it never drifts from what is actually published.
const SITE = "https://mihai.ltd";

type Item = {
  path: string;
  title: string;
  description?: string;
  decision?: string;
  stage?: string;
};

const line = (i: Item, suffix = "") =>
  `- [${i.title}](${SITE}/blog/${i.path.split("/").pop() ?? ""})${suffix}${
    i.description ? `: ${i.description}` : ""
  }`;

const verdict = (i: Item) => {
  const v = i.decision ?? i.stage;
  return v ? ` (${v})` : "";
};

export default defineEventHandler(async (event: H3Event) => {
  const safe = async <T>(fn: () => Promise<T[]>) => {
    try {
      return await fn();
    } catch {
      return [] as T[];
    }
  };
  const [posts, books, radar] = await Promise.all([
    safe(() => queryCollection(event, "blog").all()),
    safe(() => queryCollection(event, "books").all()),
    safe(() => queryCollection(event, "radar").all()),
  ]);

  const byTitle = (a: Item, b: Item) => a.title.localeCompare(b.title);

  const body = `# Mihai Farcas

> Mihai Farcas is a Software Architect (Cluj-Napoca, Romania) with 10+ years of experience building enterprise systems in healthcare, fintech and insurance. He designs and ships production Agentic AI applications, n8n automation workflows and MCP (Model Context Protocol) servers. He is a technical writer for the official n8n blog, publishes n8n workflow templates, runs the Let's Talk Dev YouTube channel, and consults through his company INNOVI PRO.

## Key facts

- Name: Mihai Farcas (also written Mihai Farcaș; handle: mihailtd)
- Role: Software Architect · Agentic AI, n8n & MCP
- Current employer: Marsh (Software Architect — Agentic AI apps and automations)
- Consultancy: INNOVI PRO (https://innovi.pro/) — Agentic AI, n8n workflows, MCP servers, enterprise architecture
- Specializations: Agentic AI (LangGraph, RAG, Graph RAG), n8n, MCP servers, microservices, Kubernetes, healthcare interoperability (FHIR, HL7, DICOM)
- Core stack: TypeScript, Node.js, Python, FastAPI, Vue.js/Nuxt, PostgreSQL, MongoDB, SQL Server, Redis, RabbitMQ, Docker, Kubernetes, ArgoCD, GCP, Azure, AWS, Azure OpenAI, Claude, OpenAI
- Selected clients and projects: Marsh, n8n, Kaiser Permanente (via Cognizant), Cognizant, Lyfegen, medQ

## Services

- Agentic AI system design & implementation (LangGraph, RAG, evaluation, guardrails)
- n8n workflow automation (custom workflows, AI agents, self-hosted n8n on Docker/Kubernetes, migrations from Zapier/Make)
- MCP server development (connecting internal tools to Claude, ChatGPT and GitHub Copilot)
- Fractional software architecture and AI system design reviews
- Engage via ${SITE}/contact or https://innovi.pro/

## Main pages

- [Home / profile](${SITE}/): who Mihai is, experience, clients and skills
- [Contact & FAQ](${SITE}/contact): how to engage, services and common questions
- [Tech Radar](${SITE}/radar): hands-on evaluations with adopt / trial / assess / hold / reject decisions
- [Blog](${SITE}/blog): articles, tech reports and book notes
- [Stack](${SITE}/stack): tools and platforms used day to day

## Official profiles

- LinkedIn: https://www.linkedin.com/in/mihai-farcas-ltd/
- GitHub: https://github.com/mihailtd
- YouTube (Let's Talk Dev): https://www.youtube.com/@letstalkdev
- Dev.to: https://dev.to/mihailtd
- Medium: https://medium.com/@mihailtd
- n8n blog author page: https://blog.n8n.io/author/mihai/
- n8n creator templates: https://n8n.io/creators/mihailtd/

## Tech Radar reports

${(radar as Item[])
  .sort(byTitle)
  .map((i) => line(i, verdict(i)))
  .join("\n")}
${
  posts.length
    ? `
## Articles

${(posts as Item[])
  .sort(byTitle)
  .map((i) => line(i))
  .join("\n")}
`
    : ""
}
## Book notes

${(books as Item[])
  .sort(byTitle)
  .map((i) => line(i))
  .join("\n")}
`;

  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return body;
});
