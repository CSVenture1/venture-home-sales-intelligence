# Project: venture-home-sales-intelligence

## What This Is

AI-powered sales funnel intelligence system that analyzes performance across lead sources, reps, and markets to identify exactly why parts of the sales funnel are over or underperforming.

Venture Home Solar has 30 inside sales reps, 60 outside sales reps across 6 markets, and 30+ lead sources generating appointments. Currently they lack visibility into why specific parts of their lead-to-close funnel perform differently, making it impossible to quickly diagnose and fix performance issues or replicate successful patterns across the team.


## Repo Setup

- **Local project directory**: `~/Documents/Claude/projects/venture-home-sales-intelligence` (extracted from scaffold zip or cloned from GitHub)
- **GitHub repo**: `[your-gh-org]/venture-home-sales-intelligence`
- **Cloud Run service**: `venture-home-sales-intelligenc`
- **GCP project ID**: `venture-home-sales-intelligenc`
- **Branch strategy**: `main` is production. Work on feature branches (`feature/[name]`) and merge via PR.

When asked to make changes, commit to the current working branch with clear commit messages. Push to GitHub when asked to "push" or "ship it."

## Tech Stack

- **Frontend**: React with hooks, Vite build system
- **Styling**: Inline styles with dark theme, JetBrains Mono for data, Outfit for UI text
- **Data Sources**: Salesforce CRM data, call transcripts and summaries
- **Integrations**: Salesforce (primary data source), potential future integrations with Sales Buddy for coaching delivery and Customer.io for campaign triggers


## Hosting & Deployment

- **Runtime**: Google Cloud Run (containerized, port 8080)
- **Static/File Storage**: Google Cloud Storage
- **Container Registry**: Google Artifact Registry
- **Region**: us-east1

### Key deployment rules:
- Cloud Run URL format: `https://venture-home-sales-intelligenc-HASH-ue.a.run.app`
- Environment variables are set via Cloud Run service configuration — never baked into the container
- `.env.local` is for local dev only — never deployed, never committed
- For server-side API calls, use the Cloud Run service URL as the base, not localhost
- Always test Docker builds locally before deploying: `docker build -t venture-home-sales-intelligence . && docker run -p 8080:8080 venture-home-sales-intelligence`

### Deployment Commands
All commands run from the repo root (`~/Documents/Claude/projects/venture-home-sales-intelligence`).

```bash
# Verify required tools first
which node && which npm && which git && which docker && which gcloud
# If any are missing, install before proceeding

# First-time GCP setup (run once)
gcloud auth login
gcloud config set project venture-home-sales-intelligenc
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com storage.googleapis.com

# Create Artifact Registry repo (once)
gcloud artifacts repositories create venture-home-sales-intelligence --repository-format=docker --location=us-east1

# Build and deploy
gcloud builds submit --tag us-east1-docker.pkg.dev/venture-home-sales-intelligenc/venture-home-sales-intelligence/venture-home-sales-intelligence:latest .
gcloud run deploy venture-home-sales-intelligenc \
  --image us-east1-docker.pkg.dev/venture-home-sales-intelligenc/venture-home-sales-intelligence/venture-home-sales-intelligence:latest \
  --region us-east1 --platform managed --allow-unauthenticated

# Update environment variables
gcloud run services update venture-home-sales-intelligenc --region us-east1 \
  --update-env-vars="KEY=value,KEY2=value2"
```

## Project Structure

```
venture-home-sales-intelligence/
├── .auto-memory/
│   ├── MEMORY.md                  # Canonical index — read first every session
│   ├── reference_venture-home-sales-intelligence.md       # Infra: GCP project, Cloud Run URL, env vars
│   └── project_venture-home-sales-intelligence.md         # Tech stack, components, architecture decisions
├── src/
│   ├── main.jsx
│   ├── app.jsx
│   ├── components/                 # React with hooks, Vite build system components (.jsx)
│   ├── views/
│   ├── data/
│   ├── auth/
│   └── utils/
├── docs/
│   └── memory/
│       └── planning.md            # Bootstrap planning artifact from Ignition
├── PROJECT_INSTRUCTIONS.md
├── AGENTS.md
├── TODO.md
├── STARTER_PROMPTS.md
├── USER_GUIDE.md                  # Living user-facing reference — updated as features ship
├── Dockerfile
├── .dockerignore
├── .gcloudignore
├── .env.example
├── .env.local                     # Local dev only — git-ignored
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## Current State

✅ Lead source performance table with funnel health indicators
✅ Expandable detail view with comprehensive metrics
✅ Rep performance tracking by market
✅ Mock data structure for all key metrics
✅ Clean dark theme interface matching VH design standards

## Design

- **Theme**: Clean, data-focused dashboard with amber accents for highlights and teal/coral for positive/negative indicators
- **Fonts**: JetBrains Mono (data/numbers), system sans-serif (labels)



## Data Model

### Objects
Lead (source, contact attempts, set status), Opportunity (stage, amount, market, assigned reps), Call Summary (transcript analysis, objection types, conversation quality), Rep Performance (conversion rates by funnel stage, timing metrics), Lead Source Performance (cost metrics, conversion rates, quality scores).

### Relationships
Lead connects to Opportunity via conversion. Opportunity connects to Inside Rep (who set appointment) and Outside Rep (who runs appointment). Call Summaries connect to Leads. Rep Performance aggregates across all their Leads/Opportunities. Lead Source Performance aggregates across all Leads from that source.

### Fields to Confirm Before Going Live
Exact Salesforce field names for call summaries and transcripts,How lead source attribution is tracked in Salesforce,Specific stage names that map to 'Set', 'Sit', and 'Close Won',Format and location of cost data per lead source,How inside/outside rep assignments are stored

### Known Data Issues
Call transcripts are summarized in Salesforce but quality of notes varies by rep. Lead source performance includes complex metrics like trailing 3-month averages and skip-1-month calculations. Cost data may have blank fields that need handling.

## Architecture Notes

Phase 1: React dashboard pulling from Salesforce with mock data simulation. Phase 2: Node.js backend for scheduled data processing and AI transcript analysis. Phase 3: Real-time alerts and automated coaching recommendations. May eventually integrate into existing Canopy platform.


## Multi-User Collaboration

These docs are **AI-agnostic** — they work with Claude, GPT, Gemini, Copilot, or any LLM.
- **Team**: solo


## How to Work in This Project

1. **Read in this order every session**: `.auto-memory/MEMORY.md` (follow its links) → `AGENTS.md` → `docs/memory/` (newest first) → `TODO.md` → this file → `USER_GUIDE.md` (to see the current feature surface area from the user's perspective). The project spec is distributed across these files — no single file has the complete picture. Give a brief status summary before starting work.

2. **Follow AGENTS.md.** It defines agent roles, the memory system (tiers, auto-memory, golden snapshots), and session lifecycle. Read it and follow it.

3. **Keep mock data working at all times.** Every feature must be testable with mock/demo data before live data is wired up. The mock mode should always work.

4. **Field names and API names are placeholders until confirmed.** Keep them as configurable constants. When a field name is confirmed, update the constant, write it to today's session file in `docs/memory/` as `[Tier 1]`, and update `.auto-memory/project_venture-home-sales-intelligence.md`.

5. **Design rules are not suggestions.** Follow the established visual system — dark theme, monospace for numbers, minimal chrome.

6. **Ambiguous or multi-step work goes through the PM agent first.** When a feature is described in business terms, scope it before building: data source needed, API calls required, UI components to build, which agents are involved, and what goes in TODO.md as follow-up. See AGENTS.md → Fast Path for when to skip PM.

7. **Write to memory incrementally.** The moment a field name is confirmed, a decision is made, or a bug is fixed — write it to today's session file in `docs/memory/YYYY-MM-DD.md`. If it's a Tier 1 fact (infra, architecture, confirmed field name, deployment state), also update the relevant `.auto-memory/` file. See AGENTS.md → Memory System for the full rules.

8. **Commit often in small chunks.** After each logical unit of work (a component, a data integration, a view), commit with a descriptive message.

9. **Memory files and TODO.md are committed to GitHub.** They are project artifacts, not ephemeral notes. Every session should end with a commit and push that includes updated memory and TODO files.

10. **Keep USER_GUIDE.md current as features ship.** `USER_GUIDE.md` is the living, user-facing reference for this product. Every time a user-facing feature ships or changes, add or update an entry in the **same commit** as the feature — name, what it does (user terms), how to use it (step-by-step), and anything important to know. When the project is done, this file is publishable as-is. See AGENTS.md → "User Guide Maintenance" for the full rules and entry template.

11. **End every session the same way.** Finalize today's session file in `docs/memory/`. If any Tier 1 context changed, update the relevant `.auto-memory/` files. If any user-facing feature shipped or changed, update `USER_GUIDE.md`. Update TODO.md, commit everything, push to GitHub, confirm what was shipped. (Ultra-fast-path fixes can bundle into the next real commit — see AGENTS.md.)

12. **Cloud Run deploys**: test locally in Docker first. `docker build -t venture-home-sales-intelligence . && docker run -p 8080:8080 venture-home-sales-intelligence`

13. **Environment variables**: `.env.local` for local dev. Set production vars via `gcloud run services update --update-env-vars` (never `--set-env-vars` — it wipes all existing vars). Never commit secrets.

## Reference Data

30 inside sales reps including Ben Vest and Joseph Goodwin as managers. 60 outside sales reps across NY West (Josh Rosen, Arturo Bustamante, etc.), NY East, NJ, CT, MA/RI, ME/NH, MD markets. 30+ lead sources including Referral, Adnet LLC, Modernize, Energy Bill Cruncher, Clean Energy Experts, SolarReviews, and others. Key metrics include Lead to Set %, Set to Completed %, Sit to Close Won %, Cost Per Deal, Cancellation %, and various trailing 3-month averages.
