# TODO — venture-home-sales-intelligence

## Project Summary

AI-powered sales funnel intelligence system that analyzes performance across lead sources, reps, and markets to identify exactly why parts of the sales funnel are over or underperforming.

Venture Home Solar has 30 inside sales reps, 60 outside sales reps across 6 markets, and 30+ lead sources generating appointments. Currently they lack visibility into why specific parts of their lead-to-close funnel perform differently, making it impossible to quickly diagnose and fix performance issues or replicate successful patterns across the team.


## Release Strategy
**MVP → Iterative releases**
- MVP: Lead source performance dashboard with funnel health metrics, rep performance analysis, and AI-powered insights from call transcripts and notes to identify specific coaching opportunities and performance drivers.
- Success: Regional managers can instantly diagnose performance issues by lead source or rep, identify specific behavioral patterns driving success/failure, and get actionable coaching insights within 30 seconds of opening the dashboard.

---

## Data Model

### Objects
Lead (source, contact attempts, set status), Opportunity (stage, amount, market, assigned reps), Call Summary (transcript analysis, objection types, conversation quality), Rep Performance (conversion rates by funnel stage, timing metrics), Lead Source Performance (cost metrics, conversion rates, quality scores).

### Relationships
Lead connects to Opportunity via conversion. Opportunity connects to Inside Rep (who set appointment) and Outside Rep (who runs appointment). Call Summaries connect to Leads. Rep Performance aggregates across all their Leads/Opportunities. Lead Source Performance aggregates across all Leads from that source.

### Fields & API Names to Confirm
These must be confirmed before going to production. Each confirmed value should be written to `docs/memory/YYYY-MM-DD.md` as `[Tier 1]`, updated in `.auto-memory/project_venture-home-sales-intelligence.md`, and updated in code as a named constant.

Exact Salesforce field names for call summaries and transcripts,How lead source attribution is tracked in Salesforce,Specific stage names that map to 'Set', 'Sit', and 'Close Won',Format and location of cost data per lead source,How inside/outside rep assignments are stored

### Known Data Issues
Call transcripts are summarized in Salesforce but quality of notes varies by rep. Lead source performance includes complex metrics like trailing 3-month averages and skip-1-month calculations. Cost data may have blank fields that need handling.

---

## Phase 0: Planning ✅
- [x] Brainstorm and discovery conversation
- [x] Scope and release strategy defined
- [x] Project docs generated
- [x] Planning memory file created

## Phase 1: Setup

### Tool Verification (run these first)
- [ ] Verify Node.js: `node --version` (requires v18+)
- [ ] Verify npm: `npm --version`
- [ ] Verify git: `git --version`
- [ ] Verify Docker: `docker --version`
- [ ] Verify gcloud: `gcloud --version` (install from https://cloud.google.com/sdk/docs/install if missing)

### Project Initialization
- [ ] Extract scaffold zip to `~/Documents/Claude/projects/venture-home-sales-intelligence`
- [ ] `cd ~/Documents/Claude/projects/venture-home-sales-intelligence && npm install`
- [ ] Copy `.env.example` → `.env.local` and fill in values
- [ ] Verify local dev server: `npm run dev`
- [ ] Initialize git: `git init && git add -A && git commit -m "initial scaffold from Ignition"`
- [ ] Create GitHub repo and push: `gh repo create venture-home-sales-intelligence --source . --push`
- [ ] Set up `.auto-memory/` directory and `MEMORY.md` index
- [ ] Update `.auto-memory/reference_venture-home-sales-intelligence.md` with GitHub URL

### GCP & Cloud Run
- [ ] Test Docker build: `docker build -t venture-home-sales-intelligence . && docker run -p 8080:8080 venture-home-sales-intelligence`
- [ ] Create GCP project: `gcloud projects create venture-home-sales-intelligenc --name="venture-home-sales-intelligence"`
- [ ] Link billing: https://console.cloud.google.com/billing/linkedaccount?project=venture-home-sales-intelligenc
- [ ] Enable APIs: `gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com storage.googleapis.com --project venture-home-sales-intelligenc`
- [ ] Create Artifact Registry: `gcloud artifacts repositories create venture-home-sales-intelligence --repository-format=docker --location=us-east1 --project venture-home-sales-intelligenc`
- [ ] First Cloud Run deploy: `gcloud run deploy venture-home-sales-intelligenc --source . --region us-east1 --project venture-home-sales-intelligenc --allow-unauthenticated` (use `--update-env-vars`, never `--set-env-vars`)
- [ ] Update `.auto-memory/reference_venture-home-sales-intelligence.md` with Cloud Run URL + GCP project ID
- [ ] Write first session file: `docs/memory/YYYY-MM-DD.md`

### Salesforce Setup
- [ ] Go to Salesforce Setup → App Manager → New Connected App
- [ ] Enable OAuth settings; set callback URL to `http://localhost:5173` (dev) and your Cloud Run URL (prod)
- [ ] Add OAuth scope: `api`
- [ ] Copy the Consumer Key → goes into `SF_CLIENT_ID` in `.env.local`
- [ ] Confirm field names (see Data Model → Fields to Confirm above)
- [ ] Update SOQL queries with confirmed field names
- [ ] Test OAuth flow against sandbox, then production org
- [ ] Write confirmed field names to `docs/memory/YYYY-MM-DD.md` as `[Tier 1]` and update `.auto-memory/project_venture-home-sales-intelligence.md`

### Customer.io Setup
- [ ] Get API key from Customer.io Settings → API Credentials
- [ ] Note Workspace ID (in URL or Settings)
- [ ] Add to `.env.local` as `CUSTOMERIO_API_KEY` and `CUSTOMERIO_WORKSPACE_ID`
- [ ] Confirm the join key for matching Customer.io profiles to other records (usually email)
- [ ] Set up batch API calls — don't do one request per record
- [ ] Define "active" vs "dormant" threshold (e.g., active = any event in last 30 days)
- [ ] Write confirmed thresholds and API details to `docs/memory/YYYY-MM-DD.md` as `[Tier 1]`

## Phase 2: Prototype
- [ ] Build core UI with mock data
- [ ] Implement main views and interactions
- [ ] Verify mock mode works end-to-end
- [ ] Deploy prototype to Cloud Run for review

### What the prototype already covers:
✅ Lead source performance table with funnel health indicators
✅ Expandable detail view with comprehensive metrics
✅ Rep performance tracking by market
✅ Mock data structure for all key metrics
✅ Clean dark theme interface matching VH design standards


## Phase 3: Live Data
- [ ] Confirm all field names and API names — write each to `docs/memory/YYYY-MM-DD.md` as `[Tier 1]` and update `.auto-memory/project_venture-home-sales-intelligence.md`
- [ ] Connect Salesforce (primary data source) integration
- [ ] Connect potential future integrations with Sales Buddy for coaching delivery and Customer.io for campaign triggers integration
- [ ] Set production env vars on Cloud Run (`--update-env-vars`, never `--set-env-vars`)
- [ ] Run with live data end-to-end
- [ ] Verify in production

## Phase 4: MVP Features
- [ ] Lead source performance dashboard with funnel health metrics, rep performance analysis, and AI-powered insights from call transcripts and notes to identify specific coaching opportunities and performance drivers.

## Phase 5: MVP Deploy
- [ ] All env vars confirmed on Cloud Run
- [ ] Tested with real users in production
- [ ] Memory finalized, TODO updated
- [ ] Ship

## Phase 6+: Post-MVP
- [ ] Predictive pipeline forecasting, automated coaching recommendations, real-time alerts for performance changes, integration with Sales Buddy for coaching delivery, Customer.io campaign triggers based on conversation patterns.
---

## Known Challenges & Open Questions

Lead source attribution complexity with 30+ sources, varying note quality requiring AI parsing, complex trailing average calculations, real-time performance change detection, scaling AI analysis across hundreds of calls per day.

---

## Brainstorm Notes
User wants to build a sales intelligence system for Venture Home Solar that can diagnose exactly why different parts of their lead-to-close funnel are performing well or poorly. The system needs to analyze performance by lead source, individual reps, and markets using call transcripts, notes, and conversion metrics. MVP focuses on a diagnostic dashboard showing funnel health by lead source with detailed metrics. Future phases will add predictive analytics and automated coaching recommendations. The prototype demonstrates the core lead source performance table with expandable detail views.

---

## Reference Data

30 inside sales reps including Ben Vest and Joseph Goodwin as managers. 60 outside sales reps across NY West (Josh Rosen, Arturo Bustamante, etc.), NY East, NJ, CT, MA/RI, ME/NH, MD markets. 30+ lead sources including Referral, Adnet LLC, Modernize, Energy Bill Cruncher, Clean Energy Experts, SolarReviews, and others. Key metrics include Lead to Set %, Set to Completed %, Sit to Close Won %, Cost Per Deal, Cancellation %, and various trailing 3-month averages.
