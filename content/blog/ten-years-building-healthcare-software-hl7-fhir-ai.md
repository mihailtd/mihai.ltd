---
title: "Ten Years Building Healthcare Software Across HL7, Enterprise Portals, Pharma AI, and FHIR"
description: "Lessons from ten years architecting healthcare systems across medQ radiology integrations, Kaiser Permanente patient portals, pharma agentic AI at Lyfegen, and building Innovi Care on FHIR R5."
date: "2026-11-19"
type: "blog_post"
tags:
  - healthcare software
  - HL7
  - FHIR
  - Mirth Connect
  - agentic AI
  - software architecture
  - care pathway digitization
canonical_url: "https://mihai.ltd/blog/ten-years-building-healthcare-software-hl7-fhir-ai/"
---

# Ten Years Building Healthcare Software Across HL7, Enterprise Portals, Pharma AI, and FHIR

Most software engineers who enter healthcare assume the hardest problem is picking the right frontend framework or cloud vendor, then discover within a month that the real bottlenecks are messy clinical data handoffs, brittle legacy interfaces, and strict privacy boundaries. Teams usually treat healthcare like ordinary SaaS with a compliance checklist bolted on at the end, which produces portals that look clean in a demo and fail the first time a real hospital feed or multi-clinic workflow hits them. In this article I trace what more than ten years of building healthcare software taught me across radiology RIS and Mirth Connect integrations, enterprise patient portals, pharmaceutical AI automation, and my own FHIR R5 platform [Innovi Care](https://innovi.care). Along the way, I share the architectural patterns that actually hold up when digitizing a care pathway.

I did not plan to spend a decade in healthcare software, however once you work on systems where data accuracy directly affects a patient's diagnosis, appointment, or treatment access, ordinary CRUD apps start feeling small by comparison.

## Starting in radiology at medQ: support, SQL, Mirth Connect, and HL7

My healthcare career started in December 2014 at [medQ](https://www.medq.com) in Cluj, working on US radiology workflow software (RIS, short for Radiology Information System, and Radiology Reporting). Looking back, the sequence of roles I went through there gave me an education you cannot get from reading standards documents alone:

- **Technical Support Engineer (December 2014 to October 2015):** Eleven months digging into live customer issues, SQL Server queries, and broken clinical workflows taught me how radiologists, technologists, and imaging centers actually use software under time pressure.
- **Interface Analyst (October 2015 to March 2017):** Eighteen months building and troubleshooting clinical integrations with [Mirth Connect](https://github.com/nextgenhealthcare/connect) (later also known as NextGen Connect), HL7 v2 pipe-delimited messages, DICOM imaging metadata, and early FHIR interfaces.
- **JavaScript Developer (March 2017 to April 2018):** Fourteen months building features directly inside the US radiology application across JavaScript, SQL Server, HL7, DICOM, and FHIR.

### What HL7 v2 and Mirth Connect teach every healthcare architect

If you have never stared at an HL7 v2 `ORM` (order) or `ORU` (observation result) message at 2 AM because a hospital updated one segment without telling anyone, it is easy to underestimate healthcare interoperability. People often joke that if you have seen one HL7 v2 implementation, you have seen one HL7 v2 implementation, and from my time writing JavaScript transformers in Mirth Connect channels, that joke is close to literal truth.

Three practical lessons from those three and a half years still drive how I design systems today:

1. **Support logs beat assumptions.** Sitting in technical support first shows you every place a workflow breaks when a clinic is busy. A missing validation rule in a database table turns into a stuck radiology report two hours later.
2. **An integration engine is a shock absorber.** Mirth Connect sits between a RIS, a PACS (Picture Archiving and Communication System), and an EHR so protocol quirks, MLLP retries, and field-mapping transformations stay isolated inside observable channels instead of polluting your core product code.
3. **Enforce structured data early.** Once an unstructured text blob enters a reporting pipeline, extracting reliable structured facts later is painful. That early pain is a big reason I later became obsessed with database constraints and typed contracts.

## Enterprise scale via Cognizant Softvision: six and a half years with Kaiser Permanente

In April 2018 I joined Cognizant Softvision as a Senior Software Engineer, and for six years and eight months (April 2018 to November 2024) I worked exclusively with **Kaiser Permanente**.

Kaiser Permanente is one of the largest integrated healthcare organizations in the United States, serving roughly 12.6 million members across 40 hospitals and more than 610 medical offices ([Kaiser Permanente Fast Facts](https://about.kaiserpermanente.org/who-we-are/fast-facts)). My focus was on the patient-facing and foundational layers that sit right in the middle of a member's care journey: patient portals, provider directories, and patient resources, built across Node.js, Express.js, MongoDB, SQL Server, REST APIs, OAuth, OpenAPI, GitLab CI/CD, Docker, Kubernetes, and Splunk.

### Why patient directories and portals are harder than they look

From the outside, a provider directory or patient portal looks like a straightforward search page. At enterprise healthcare scale, it is an active piece of the care pathway.

A directory has to reflect which clinicians are accepting patients, which locations and specialties they cover, which languages they speak, and how OAuth-protected patient resources reconcile identity across legacy backend systems without leaking a single record or slowing down under peak traffic. Working in that environment taught me how much operational discipline goes into OpenAPI contracts, container deployments on Kubernetes, structured observability in Splunk, and boring, predictable REST design.

It also highlighted a gap that stuck with me: large integrated health systems have entire engineering divisions building patient portals and directories, while independent clinics, physiotherapists, family doctors, and small multidisciplinary practices in Europe are usually left with clunky legacy tools or disconnected booking widgets.

## Consultancy in pharma AI with Lyfegen: where agentic software actually fits

Alongside enterprise clinical engineering, my consultancy work with [Lyfegen](https://lyfegen.com) brought me into another critical corner of healthcare: the pharmaceutical industry and value-based healthcare pricing and contracting.

In that consultancy work as an AI engineer, I focused on building AI integrations, workflow automations, and agentic software using Python, LangGraph, RAG and Agentic RAG pipelines, Azure OpenAI, Google Gemini, and PostgreSQL.

### The real architecture rule for AI in regulated healthcare and pharma

Pharma and healthcare workflows carry high stakes. Whether an automation is helping analysts parse complex value-based contract terms, pulling evidence from structured and unstructured documents, or orchestrating multi-step retrieval in LangGraph, a confident hallucination is worse than a slow error.

That work sharpened a principle I now apply to every AI project I architect, and explored in my guide on [isolating LangGraph agents with PostgreSQL Row-Level Security](https://mihai.ltd/blog/postgresql-rls-langgraph-agent-isolation). Use models for reasoning, extraction, and synthesis, while deterministic code and database rules stay in charge of permissions, calculations, and final state changes. In regulated industries, an agent proposes and structures information while deterministic checks, audit trails, and human review remain in the loop.

## Four layers of healthcare software compared

When teams ask how care pathway digitization fits together across clinics, hospitals, and life sciences, it helps to see the four layers side by side rather than treating "healthcare IT" as one monolithic category:

| Healthcare layer                             | Typical protocols & stack                                                 | Main failure mode                                              | Architectural lesson                                                                   |
| :------------------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| Radiology & hospital interfaces (RIS / PACS) | HL7 v2, MLLP, DICOM, Mirth Connect / Open Integration Engine, SQL         | Silent message drift and unmapped vendor segment quirks        | Isolate hospital feed translation in observable integration channels                   |
| Enterprise patient portals & directories     | REST, OpenAPI, OAuth, Node.js, Kubernetes, observability stacks           | Stale directory data, slow nested lookups, identity mismatches | Treat directory accuracy, auth boundaries, and observability as core clinical UX       |
| Pharma & life-sciences AI workflows          | Python, LangGraph, RAG / Agentic RAG, PostgreSQL, cloud LLMs              | Unchecked model output creeping into regulated decisions       | Pair agentic extraction with deterministic validation and human review                 |
| Modern clinic & care-pathway platforms       | [HL7 FHIR R5](https://hl7.org/fhir/R5/), PostgreSQL 18, RLS, GraphQL/REST | Disconnected booking, intake, charting, and home care tools    | Put scheduling and privacy invariants in PostgreSQL and keep records in open standards |

## Why I love healthcare engineering and why I built Innovi Care

People sometimes ask why I keep coming back to healthcare instead of picking a lighter domain with fewer regulations and cleaner legacy systems. For me it comes down to three things: the challenge, the responsibility, and the feeling of creating something genuinely useful.

Healthcare software forces you to think end to end. Double-booking a doctor disrupts real people's mornings, which is why database exclusion constraints matter. A psychotherapy note or a lab report is more sensitive than an ordinary JSON document, so Row-Level Security belongs in the database rather than in a UI toggle. And with [Regulation (EU) 2025/327](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0327) (the European Health Data Space) phasing in across Europe, open standards like HL7 FHIR R5 let patients keep ownership of their health story as they move across clinics and countries.

That combination of challenge and responsibility is what pushed me to create two connected projects from scratch:

- **[graphpg](https://github.com/mihailtd/graphpg):** An open-source Rust engine ([documentation](https://mihailtd.github.io/graphpg/)) that reads a PostgreSQL schema directly and compiles GraphQL and OpenAPI REST requests into single SQL queries, so teams spend their time on domain modeling and database security instead of hand-writing CRUD endpoints.
- **[Innovi Care](https://innovi.care):** A calm, multilingual practice management platform and patient portal built on HL7 FHIR R5 and PostgreSQL 18 through my consultancy [Innovi Pro](https://innovi.pro), bringing conflict-free scheduling, adaptive specialty workspaces, mobile care entry, and between-visit home plans to independent practitioners and clinics across Europe.

Writing code that starts as a blank migration file and turns into a system that saves a clinician an hour of evening charting or helps a family track recovery plans in their own language is still the best feeling in engineering.

## Practical takeaways for healthcare builders and CTOs

If you are architecting or modernizing a healthcare product or care-pathway platform today, these are the four principles I would not skip:

- **Start with open clinical models.** Even if you are building for small outpatient clinics today, aligning core entities (`Patient`, `Appointment`, `Encounter`, `Observation`, `CarePlan`) with HL7 FHIR R5 prevents painful rewrites as European portability rules phase in from 2027 onward.
- **Enforce non-negotiable rules in the database.** Put overlap prevention (`EXCLUDE USING gist`) and patient-consent isolation (PostgreSQL Row-Level Security) at the data layer so no new screen, script, or coding agent can bypass them. I wrote a dedicated technical guide on [why RLS is the safest place for authorization in AI-built apps](https://mihai.ltd/blog/row-level-security-ai-coding-agents).
- **Separate product workflows from legacy exchange.** Keep Mirth Connect, HL7 v2 feeds, and national switch adapters at a clean integration perimeter rather than leaking hospital quirks into your clinical UI.
- **Keep AI agents bounded and auditable.** Use agentic workflows to remove tedious synthesis and automation bottlenecks, while keeping deterministic validation and clinician or analyst sign-off on every consequential output.

If you want to go deeper into the clinic workflow or the database architecture behind this work, read our business guide to [care pathway digitization software on Innovi Care](https://innovi.care/blog/care-pathway-digitization-software) or our technical blueprint on [architecting care pathway digitization on FHIR R5 and PostgreSQL at Innovi Pro](https://innovi.pro/blog/architecting-care-pathway-digitization-software). You can also explore how we build agentic delivery tooling at [RetroAgile](https://retroagile.com). And if your organization is planning a healthcare architecture review or AI integration, you can [reach out to Innovi Pro](https://innovi.pro/#contact) or look at our [software architecture audit](https://innovi.pro/services/software-architecture-audit).
