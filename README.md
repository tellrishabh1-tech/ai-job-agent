# AI-Job-Agent Application Platform

### AI-assisted end-to-end job search and application management

A full-stack platform designed to reduce the fragmented work involved in a modern job search — from discovering relevant opportunities and evaluating fit to tailoring a resume, preparing outreach, tracking applications, and managing follow-ups.

The project combines **AI/ML, workflow automation, product design, human oversight, security, and production-oriented engineering** into a single application lifecycle.

> **Product principle:** Use AI to reduce repetitive work and improve decision support, while keeping the candidate in control of important decisions.

---

# 1. 🎯 User Problem

Job searching is rarely a single task.

A candidate typically needs to:

1. Search across multiple job platforms.
2. Compare and filter opportunities.
3. Understand whether a role matches their profile.
4. Adapt their resume to the opportunity.
5. Identify skill gaps.
6. Contact recruiters or hiring teams.
7. Track applications.
8. Follow up at the right time.
9. Understand what is working and what needs improvement.

These activities are often performed across disconnected tools.

This creates a fragmented workflow where the candidate repeatedly moves between:

- Job boards
- Resume editors
- AI tools
- Email clients
- Application trackers
- Calendars
- Spreadsheets
- Follow-up reminders

The product opportunity is to bring these activities into one connected workflow.

---

# 2. 🚀 Product Vision

The vision is to create an **AI-assisted job search workflow** that helps candidates move from opportunity discovery to application follow-up with less repetitive work.

Rather than treating AI as a standalone chatbot, the platform integrates AI into the larger workflow.

```text
                 JOB SEARCH LIFECYCLE

                  Discover
                     │
                     ▼
              Evaluate Opportunity
                     │
                     ▼
               Analyze Resume
                     │
                     ▼
                Identify Gaps
                     │
                     ▼
                Tailor Resume
                     │
                     ▼
              Verify Accuracy
                     │
                     ▼
              Prepare Outreach
                     │
                     ▼
                 Apply / Send
                     │
                     ▼
              Track Application
                     │
                     ▼
                  Follow Up
```

The objective is not to automate every action.

The objective is to use AI where it can provide meaningful contextual value while keeping predictable operations and consequential decisions controlled.

---

# 3. 👤 Target User

The primary user is a **job candidate managing an active and potentially high-volume job search**.

The platform is designed around the recurring problems that arise when a candidate needs to:

- Find relevant opportunities across multiple sources.
- Decide which opportunities deserve attention.
- Understand how their existing experience aligns with a role.
- Adapt application materials.
- Communicate with hiring teams.
- Keep track of applications.
- Maintain follow-up discipline.

The product therefore treats the job search as a **workflow**, rather than as an isolated resume or job-search tool.

---

# 4. 🧭 User Journey

The intended user journey is:

```text
┌─────────────┐
│  Discover   │
│    Jobs     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Filter &  │
│ Prioritize  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Evaluate  │
│     Fit     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Analyze   │
│   Resume    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Identify  │
│    Gaps     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Tailor    │
│   Resume    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Truthfulness│
│  Guardrails │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Generate   │
│  Outreach   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Review /  │
│    Send     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Track     │
│ Application │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Follow Up  │
└─────────────┘
```

This journey is implemented across six development phases.

---

# 5. 🧩 Product Workflow

The platform is organized into six phases:

| Phase | Capability | Status |
|---|---|---|
| **P0** | Foundation & Platform Infrastructure | ✅ Complete |
| **P1** | Job Discovery & Aggregation | ✅ Complete |
| **P2** | AI Resume Analysis & Tailoring | ✅ Complete |
| **P3** | Outreach & Follow-up | ✅ Complete |
| **P4** | End-to-End Workflow Orchestration | ✅ Complete |
| **P5** | Security, Performance & Observability | ✅ Complete |

Each phase is independently structured while building toward a unified product.

---

# 6. 🔎 Where AI Adds Value

A key product decision is to **not use AI for everything**.

AI is most useful where the system needs contextual understanding, interpretation, generation, or personalization.

| Workflow Area | AI Role | Product Value |
|---|---|---|
| Resume analysis | LLM-based analysis | Understand candidate experience and skills |
| Gap analysis | Contextual reasoning | Identify missing or weak areas |
| Resume tailoring | Generative AI | Adapt relevant content to a target role |
| Truthfulness checks | AI-assisted guardrails | Detect potentially fabricated claims |
| Outreach personalization | Context-aware generation | Create relevant communication |
| Job relevance | Scoring/filtering | Prioritize opportunities |

Predictable operations remain deterministic.

Examples include:

- Validation
- State transitions
- Rate limiting
- File validation
- Database operations
- Deduplication rules
- Permissions
- Workflow execution

This separation allows AI to focus on tasks where contextual reasoning provides value while traditional software handles predictable operations.

---

# 7. 🧠 AI / ML Design

The platform uses an LLM as a **component inside a larger application system**, rather than treating the LLM as the application itself.

The AI layer supports:

- Resume analysis
- Skill breakdown
- Strength and weakness identification
- Gap analysis
- Resume tailoring
- Truthfulness checking
- Fabrication detection
- Seniority validation
- Outreach personalization

---

## 7.1 Resume Analysis

The resume analyzer produces a structured assessment including:

- Overall score
- Skill breakdown
- Strengths
- Weaknesses
- Relevant gaps

The analyzer is implemented through:

```text
packages/shared/lib/services/analyzer.ts
```

---

## 7.2 Gap Analysis

The gap analyzer identifies missing or weak areas relative to the target opportunity.

The system assigns importance ratings to identified gaps.

Implementation:

```text
packages/shared/lib/services/gap-analyzer.ts
```

---

## 7.3 Resume Tailoring

The tailoring pipeline uses an LLM to rewrite relevant resume sections based on the target opportunity.

The system includes:

```text
Resume
   │
   ▼
Analyze
   │
   ▼
Identify Gaps
   │
   ▼
Tailor Relevant Sections
   │
   ▼
Compare Changes
   │
   ▼
Run Guardrails
   │
   ▼
Review
   │
   ▼
Export
```

The implementation supports per-section bullet rewriting and a line-by-line diff engine.

---

## 7.4 Prompt Architecture

Prompts are maintained separately from application logic.

```text
prompts/
├── resume/
│   ├── analyze.txt
│   ├── tailor.txt
│   └── gaps.txt
│
└── guardrails/
    └── truthfulness.txt
```

This separation allows prompts to be:

- Iterated independently
- Versioned
- Evaluated
- Improved without changing application logic

---

## 7.5 LLM Reliability

The LLM client includes:

- Retry logic
- Exponential backoff
- Timeout handling
- Circuit breaker
- Caching
- Environment-based configuration
- Mock mode

The current LLM client uses the Groq SDK.

---

# 8. 🧠 Product Decisions

The product was designed around several important AI product decisions.

---

## 8.1 AI Where Contextual Understanding Matters

LLMs are used for:

- Resume interpretation
- Gap analysis
- Contextual rewriting
- Truthfulness checks
- Outreach personalization

The product does not use an LLM for every operation.

---

## 8.2 Deterministic Logic Where Predictability Matters

Traditional application logic handles operations where predictable behavior is more appropriate.

Examples include:

- Validation
- State management
- Permissions
- Filtering
- Rate limiting
- File validation
- Workflow transitions
- Database operations

This creates a hybrid system:

```text
             PRODUCT WORKFLOW
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
    Deterministic          AI / LLM
       Logic                Logic
          │                   │
          │              Contextual
          │              Reasoning
          │                   │
          └─────────┬─────────┘
                    ▼
             Validated Output
                    │
                    ▼
                 Action
```

---

## 8.3 AI Output Is Treated as Untrusted Input

AI-generated content is probabilistic.

The application therefore does not assume that generated content is automatically correct.

The system includes:

- Structured schemas
- Output validation
- Guardrail checks
- Retry mechanisms
- Failure handling
- Human review

This is especially important when AI modifies professional information.

---

## 8.4 Human-in-the-Loop

The platform is designed so that AI can assist with decisions without automatically taking control of consequential actions.

```text
                 AI
                  │
                  ▼
          Analyze / Generate
                  │
                  ▼
             User Review
                  │
          ┌───────┴───────┐
          ▼               ▼
       Approve           Edit
          │               │
          └───────┬───────┘
                  ▼
               Execute
```

AI assists with:

- Understanding
- Analysis
- Recommendations
- Draft generation
- Personalization

The user remains responsible for important actions.

---

# 9. 🛡️ Safety & Guardrails

Resume generation introduces a significant product risk:

> **An AI system can make a candidate appear more qualified by inventing information.**

Because the product operates on professional credentials, factual accuracy is an important product requirement.

The platform therefore includes a dedicated guardrail system.

---

## 9.1 Guardrail Checks

The system checks for:

- Title inflation
- Fabricated metrics
- Fabricated companies
- Fabricated certifications
- Fabricated degrees
- Seniority inflation
- Years-of-experience inflation
- Other truthfulness concerns

---

## 9.2 Guardrail Results

Results are surfaced as:

- **PASS**
- **WARNING**
- **FAIL**

```text
              AI Tailoring
                   │
                   ▼
          ┌────────────────┐
          │   Guardrail    │
          │  Verification  │
          └───────┬────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      PASS      WARNING    FAIL
        │         │         │
        ▼         ▼         ▼
      Review    Review    Block /
                           Rework
```

---

## 9.3 Product Rationale

The goal is not simply to maximize keyword alignment.

The goal is to improve relevance **without compromising factual accuracy**.

---

# 10. ✍️ Outreach & Communication

The Closer handles communication after the resume workflow.

The platform supports:

- Cold email generation
- Follow-up email generation
- Personalization
- HTML email
- Text email
- Email preview
- SMTP delivery
- Delivery tracking
- Outreach logging
- CSV export
- Send queue
- Follow-up scheduling

---

## 10.1 Personalization

The outreach workflow can incorporate:

- Company context
- Resume highlights
- Role information
- Introduction
- Body
- Closing

The system separates content generation from delivery so generated communication can be reviewed before sending.

---

## 10.2 Email Generation

The implementation includes:

```text
app/email_generator.py
app/personalizer.py
app/email_generator_llm.py
```

Templates include:

```text
app/templates/
├── cold_email.html
├── cold_email.txt
├── follow_up.html
└── follow_up.txt
```

---

## 10.3 Email Delivery

SMTP delivery is implemented with:

- STARTTLS
- Message-ID
- In-Reply-To headers
- Dry-run mode

The platform also includes rate limiting and retry behavior.

---

# 11. 📊 Application Tracking

The platform provides a unified view of the candidate's application activity.

The dashboard includes:

- Jobs discovered
- Applications
- Outreach
- Resume activity
- Application status
- Timeline events
- Follow-up reminders

The application tracker uses a Kanban-style workflow with status transition validation.

---

# 12. 🔄 Workflow Orchestration

Phase P4 connects the individual services into a unified application lifecycle.

The orchestration layer uses a state machine.

The implemented workflow includes:

```text
Search
  ↓
Upload Resume
  ↓
Analyze
  ↓
Tailor
  ↓
Guardrail
  ↓
Generate Outreach
  ↓
Send
  ↓
Track
  ↓
Follow Up
```

The orchestrator includes:

- 12 workflow states
- Valid state transition matrix
- Pipeline persistence
- Recovery after restart
- Cleanup of abandoned workflows
- Retry logic
- User-friendly error handling
- Follow-up scheduling
- Event-driven analytics

---

# 13. 📡 Event-Driven Architecture

The platform includes a typed event bus for communication between application components.

Events cover:

- Job harvesting
- Resume processing
- Outreach
- Application pipelines

The current implementation uses an in-memory event backend and is designed to be Redis-ready.

The shared event layer includes:

```text
packages/shared/events/
├── bus.ts
└── schemas.ts
```

The system includes 11 typed event interfaces across the major workflow areas.

---

# 14. 🏗️ System Architecture

The platform follows a modular full-stack architecture.

```text
                         ┌──────────────────────┐
                         │      Web Client      │
                         │      Next.js 15      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Application     │
                         │       Services       │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ Job Harvester│      │ Resume AI     │      │  Outreach    │
      │     P1       │      │     P2        │      │     P3       │
      └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
             │                     │                     │
             └─────────────────────┼─────────────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │ Pipeline Orchestrator│
                         │         P4           │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
       ┌────────────┐       ┌────────────┐       ┌────────────┐
       │ PostgreSQL │       │    Redis   │       │    LLM     │
       │            │       │  / Events  │       │  Provider  │
       └────────────┘       └────────────┘       └────────────┘
```

---

# 15. 🧰 Technology Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- App Router

## Backend

- FastAPI
- Express
- Python
- TypeScript
- SQLAlchemy
- Drizzle ORM

## Database & Infrastructure

- PostgreSQL
- Redis-ready event architecture
- Docker
- Docker Compose

## AI / ML

- LLM-based resume analysis
- LLM-based resume tailoring
- LLM-based gap analysis
- LLM-based guardrail verification
- Groq SDK
- Prompt templates
- LLM caching
- Retry mechanisms
- Circuit breakers
- Mock LLM mode

## Data & Automation

- Selenium
- Firecrawl
- SMTP
- Playwright

## Testing

- Vitest
- pytest
- Playwright
- End-to-end integration testing

## Deployment / DevOps

- GitHub Actions
- Docker
- Vercel configuration
- Dependabot
- Structured logging
- Metrics
- OpenTelemetry-compatible tracing

---

# 16. 🔎 Implementation — P1 Job Harvester

## Goal

Multi-source job aggregation, filtering, deduplication, storage, and REST API access.

---

## Core Pipeline

The pipeline follows:

```text
Fetch
  ↓
Normalize
  ↓
Filter
  ↓
Deduplicate
  ↓
Store
```

Source fetching can be performed in parallel.

---

## Normalization

The system supports:

- Date parsing across 12+ formats
- Salary extraction
- USD
- INR
- EUR
- GBP
- Location normalization
- Experience inference

Implementation:

```text
normalizer.py
```

---

## Deduplication

The system supports:

- Fuzzy matching
- URL deduplication
- Source + source ID deduplication

Fuzzy matching uses `thefuzz` with `token_set_ratio`.

Implementation:

```text
dedup.py
```

---

## Filtering

Filtering includes:

- Keyword scoring
- Location
- Remote status
- Experience
- Date
- Relevance sorting

Implementation:

```text
filter.py
```

---

## Storage

The storage layer provides:

- Async SQLAlchemy CRUD
- Upsert
- Search
- Pagination

Upsert conflicts are handled using:

```text
source + source_id
```

Implementation:

```text
store.py
```

---

## Source Adapters

Implemented sources:

- Remote OK
- Naukri
- Wellfound

Architecture:

```text
adapters/
├── base.py
├── remoteok.py
├── naukri.py
├── wellfound.py
└── __init__.py
```

The adapter architecture allows additional sources to be added without changing the core pipeline.

---

## P1 API

```text
POST   /api/jobs/search
GET    /api/jobs/search/{search_id}
GET    /api/jobs/search?q=...
GET    /api/jobs/
GET    /api/jobs/{id}
DELETE /api/jobs/{id}
GET    /api/jobs/sources
GET    /api/jobs/export
```

---

## P1 Export

The system supports:

- CSV generation
- Batch application creation
- Streaming CSV download

---

# 17. 🤖 Implementation — P2 Resume Tailor

## Goal

AI-powered resume analysis, tailoring, guardrails, and PDF export.

---

## P2.1 Resume Parsing & Upload

Supported formats:

- PDF
- DOCX
- TXT

The parser extracts sections such as:

- Education
- Experience
- Skills
- Other resume sections

Upload functionality includes:

- Multipart upload
- 10 MB limit
- File type validation
- Drag-and-drop UI
- Upload progress

---

## P2.2 LLM Client

The shared LLM client includes:

- Groq SDK
- 3 retry attempts
- Exponential backoff
- 30-second timeout
- Circuit breaker
- 5 failures / 60-second window
- Environment-based configuration
- Zod validation
- Prompt loading
- Variable interpolation
- Prompt caching
- In-memory response cache
- TTL invalidation
- Deterministic mock responses

Mock mode can be enabled with:

```text
MOCK_MODE=true
```

---

## P2.3 Resume Analysis

The analysis pipeline produces:

- Resume score from 0–100
- Skill breakdown
- Strengths
- Weaknesses
- Gap analysis

The UI includes:

- Animated score gauge
- Expandable gap list
- Importance grouping

---

## P2.4 Resume Tailoring

The tailoring workflow includes:

- Per-section bullet rewriting
- Line-by-line diff
- Added changes
- Removed changes
- Modified changes
- Unchanged content

The UI provides:

- Tailoring action
- ETA display
- Side-by-side comparison
- Unified diff view

---

## P2.5 Guardrails

The guardrail implementation includes:

```text
guardrails.ts
guardrails/
├── truthfulness.ts
├── fabrication.ts
└── seniority.ts
```

Checks include:

- Title inflation
- Metric fabrication
- Company fabrication
- Certification fabrication
- Degree fabrication
- Seniority inflation
- Experience inflation

---

## P2.6 PDF Export

The system supports:

- Tailored resume PDF
- Comparison report
- Score
- Gaps
- Guardrail results
- Side-by-side comparison

---

# 18. ✉️ Implementation — P3 The Closer

## Goal

Cold email generation, follow-up generation, preview, delivery, tracking, and audit logging.

---

## Email Generation

The implementation uses:

- Jinja2 templates
- Cold email templates
- Follow-up templates
- Personalization context
- Company insights
- Resume highlights
- Introduction
- Body
- Closing

---

## SMTP Delivery

The sender supports:

- STARTTLS
- Message-ID
- In-Reply-To
- Dry-run mode

---

## Rate Limiting

The system implements a token bucket:

```text
20 emails / hour
100 emails / day / user
```

The API exposes `Retry-After` headers.

---

## Queue

The in-memory queue supports:

- Retry
- Linear backoff
- 30 seconds
- 60 seconds
- 120 seconds
- Circuit breaker
- 3 failures → 5-minute pause

---

## Preview Engine

The preview system includes:

- HTML rendering
- Link extraction
- Read-time estimation
- Text view
- Interactive preview

The UI provides:

- Looks Good
- Edit

---

## Outreach Tracking

The system tracks:

- Delivered
- Bounced
- Opened
- Replied

The outreach console provides:

- Send queue
- Delivery log
- Search/filter
- Send/delete actions
- Resend
- Total sent
- Open rate
- Reply rate
- Bounce rate
- Volume gauge

---

## P3 API

```text
POST /api/outreach/generate
POST /api/outreach/:id/preview
POST /api/outreach/:id/send
POST /api/outreach/:id/queue
POST /api/outreach/:id/track
GET  /api/outreach/logs
GET  /api/outreach/stats
GET  /api/outreach/export
```

---

# 19. 🔄 Implementation — P4 Integration

## Goal

Connect the individual services into a unified platform.

The integration layer provides:

- Pipeline orchestration
- State management
- Event bus
- Unified UI
- Application tracking
- Follow-up scheduling
- Analytics
- Recovery

---

## Pipeline State Machine

The orchestrator contains 12 states with a valid transition matrix.

The workflow supports:

```text
idle
  ↓
searching_jobs
  ↓
uploading_resume
  ↓
analyzing
  ↓
tailoring
  ↓
guardrail
  ↓
generating
  ↓
sending
  ↓
completed / failed
```

The exact workflow contains additional internal states represented by the state machine.

---

## Pipeline Persistence

The system includes:

```text
persistState()
recoverOnRestart()
cleanupAbandoned()
```

Abandoned pipelines have a 24-hour cleanup TTL.

---

## Error Recovery

The recovery system supports:

- Maximum 3 retries
- Recovery logic
- User-friendly errors

---

## Unified UI

The application includes:

### Dashboard

```text
/dashboard
```

Displays:

- Jobs discovered
- Applications
- Outreach sent

### Resume Studio

```text
/dashboard/resume
```

Includes:

- Upload zone
- Quick actions
- Activity log

### Outreach Console

```text
/dashboard/outreach
```

Includes:

- Statistics
- Send queue
- Delivery log

### Application Tracker

```text
/dashboard/tracker
```

Includes:

- 9-column Kanban board
- Metric cards
- Drag-and-drop interaction
- Status badges

---

## Application Tracking API

The application service supports:

- GET
- POST
- PATCH
- DELETE

It also provides:

- Status transition validation
- Timeline events
- Dashboard statistics

---

## Follow-up Scheduling

The orchestrator includes follow-up reminders:

```text
3 days
7 days
14 days
```

after outreach.

---

# 20. ⚡ Implementation — P5 Production Readiness

P5 focuses on:

- Performance
- Security
- UX
- Mobile responsiveness
- Monitoring
- Observability

---

## P5.1 Performance

### LLM Cache Warm-up

Common queries can be pre-populated at startup.

### Bundle Optimization

The application includes:

- Production console removal
- WebP / AVIF image optimization
- Device-size configuration
- Immutable static asset caching

### API Caching

API responses use:

```text
Cache-Control: no-store
```

Static assets use:

```text
public, max-age=31536000, immutable
```

---

# 21. 🔐 Security & Privacy

Security is treated as a product requirement rather than a final-stage feature.

---

## Rate Limiting

Token bucket middleware supports:

```text
60 requests / minute / IP
120 requests / minute / user
```

---

## Input Sanitization

The system sanitizes:

- HTML
- Event handlers
- JavaScript protocols
- Filenames
- MIME types
- File magic bytes

---

## PII Masking

PII protection includes masking:

- Phone numbers
- Email addresses
- SSNs
- Addresses

The platform supports:

```text
restorePII()
```

to restore masked information after processing where appropriate.

---

## CSRF Protection

The application implements the double-submit cookie pattern.

---

## Security Headers

Configured protections include:

- CSP
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- X-XSS-Protection
- Permissions-Policy

---

## Dependency Security

Dependabot is configured for weekly updates across:

- npm
- pip
- GitHub Actions

---

# 22. 📈 Observability

The platform includes a dedicated observability layer.

---

## Structured Logging

Logs include:

- Level
- Timestamp
- Service
- Request ID
- User ID
- Duration

---

## Health Checks

The enhanced health endpoint reports:

- Database status
- Redis status
- LLM dependency status
- Application uptime

---

## Metrics

Prometheus-compatible metrics include:

- Request counters
- Latency histograms

---

## Distributed Tracing

The tracing layer uses OpenTelemetry-compatible trace identifiers.

The system supports:

```text
x-trace-id
x-span-id
```

headers with span recording.

---

## Alert Rules

Alert thresholds are documented for:

- LLM
- SMTP
- Application health
- Infrastructure
- Business metrics

---

# 23. 📊 Evaluation Framework

For an AI product, technical correctness alone is not enough.

The product should ultimately be evaluated across **quality, usefulness, trust, efficiency, and reliability**.

| Dimension | Evaluation Question |
|---|---|
| **Job Relevance** | Does the system identify opportunities that match the candidate? |
| **Resume Quality** | Does tailoring improve alignment with the role? |
| **Truthfulness** | Does tailoring preserve factual information? |
| **Gap Quality** | Are identified gaps useful and relevant? |
| **Outreach Quality** | Is generated communication relevant and useful? |
| **Usefulness** | Does the product reduce meaningful user effort? |
| **Reliability** | Does the workflow behave correctly when dependencies fail? |
| **Latency** | Is the AI response fast enough for the workflow? |
| **Cost** | Is model usage proportional to the value delivered? |
| **User Control** | Can the candidate review and override AI decisions? |
| **Workflow Completion** | Can users efficiently move from discovery to application? |

These provide a foundation for evaluating the product beyond raw model output.

---

# 24. 🧪 Testing & Validation

Testing is implemented across multiple layers.

---

## P1 Job Harvester

The documented P1 test suite contains **71 tests**.

Coverage includes:

- Date parsing
- Salary extraction
- Location normalization
- Exact duplicates
- Fuzzy duplicates
- Edge cases
- Filtering
- API behavior
- Integration scenarios

Test fixtures are maintained under:

```text
mock_data/
```

---

## P2 Resume AI

The documented P2 test suite contains **23 tests**.

Coverage includes:

- Resume parsing
- TXT parsing
- Edge cases
- LLM cache operations
- TTL behavior
- Key hashing
- Pattern invalidation
- Title inflation
- Metric fabrication
- Company fabrication
- Degree fabrication
- Seniority validation
- Experience inflation
- Diff generation

---

## P3 Outreach

The documented P3 test suite contains **22 tests**.

Coverage includes:

- Template rendering
- Personalization
- Edge cases
- Rate limiting
- Hourly limits
- Daily limits
- User isolation
- Reset behavior
- Dry-run mode
- SMTP failure handling
- API endpoints

---

## P4 End-to-End

Integration testing covers:

- Full pipeline execution
- Multi-user isolation
- Concurrent pipeline execution
- Error recovery

---

## P5 Security Tests

Security testing includes coverage for:

- PII masking
- PII restoration
- HTML sanitization
- Filename sanitization
- MIME validation
- Magic-byte validation

The documented security test suite contains **9 tests**.

---

# 25. 📁 Project Structure

```text
FineProject/
│
├── apps/
│   └── web/
│
├── packages/
│   ├── shared/
│   └── py-shared/
│
├── phases/
│   ├── p0/
│   │   └── Foundation
│   │
│   ├── p1/
│   │   └── Job Harvester
│   │
│   ├── p2/
│   │   └── Resume Tailor
│   │
│   ├── p3/
│   │   └── The Closer
│   │
│   ├── p4/
│   │   └── Integration
│   │
│   └── p5/
│       └── Polish
│
├── prompts/
│   ├── resume/
│   └── guardrails/
│
├── docs/
│
├── e2e/
│
├── .github/
│
├── docker-compose.yml
├── Dockerfile
├── package.json
├── turbo.json
└── README.md
```

---

# 26. 🔄 Development Phases

The project was built incrementally rather than as one large application.

---

## P0 — Foundation

### Goal

Establish the platform foundation.

### Implemented

- Monorepo scaffolding
- Next.js frontend
- FastAPI services
- Turborepo
- Shared packages
- Database schema
- PostgreSQL
- Drizzle ORM
- SQLAlchemy
- Database migrations
- Authentication
- Shared UI
- CI/CD
- Docker setup
- Testing configuration
- Vercel configuration

### Authentication

The foundation includes:

- NextAuth.js
- Magic link
- OAuth
- JWT sessions

### Shared UI

Components include:

- Button
- Card
- Badge
- Input
- Dialog
- Tabs
- Sonner
- Skeleton
- ErrorBoundary

### P0 Structure

```text
apps/web/
packages/shared/
packages/py-shared/
prompts/
scripts/
e2e/
uploads/
.github/
```

---

## P1 — Job Harvester

### Goal

Build multi-source job discovery.

### Implemented

- Multi-source collection
- Normalization
- Salary extraction
- Location normalization
- Experience inference
- Filtering
- Deduplication
- Storage
- REST API
- CSV export
- Source adapter architecture
- Tests

### Dependencies

P1 depends on P0 database schema and shared Python models.

---

## P2 — Resume Intelligence

### Goal

Use AI to analyze and tailor resumes.

### Implemented

- Resume parsing
- PDF/DOCX/TXT upload
- LLM integration
- Resume scoring
- Skill analysis
- Gap analysis
- Resume tailoring
- Diff viewer
- Guardrails
- PDF export

### Dependencies

P2 depends on:

- P0 database schema
- Shared types
- UI components

---

## P3 — The Closer

### Goal

Handle candidate outreach and follow-up communication.

### Implemented

- Cold email generation
- Follow-up generation
- Personalization
- Preview
- SMTP delivery
- Rate limiting
- Retry queue
- Circuit breaker
- Delivery tracking
- Outreach analytics
- CSV export

### Dependencies

P3 depends on P0 configuration and shared UI components.

---

## P4 — Integration

### Goal

Connect the individual services into one workflow.

### Implemented

- Pipeline orchestrator
- State machine
- Event bus
- Unified dashboard
- Application tracker
- Timeline events
- Follow-up scheduler
- Analytics
- Recovery
- Integration tests

### Dependencies

P4 depends on:

- P1 Job Harvester API
- P2 Resume Tailor API
- P3 Outreach API

---

## P5 — Production Readiness

### Goal

Improve performance, security, UX, and observability.

### Implemented

- LLM cache warm-up
- Bundle optimization
- API/static caching strategy
- Rate limiting
- Input sanitization
- PII protection
- CSRF protection
- Security headers
- Dependency auditing
- Mobile responsiveness
- Empty states
- Loading states
- Error pages
- Onboarding
- Keyboard shortcuts
- Structured logging
- Health checks
- Metrics
- Tracing
- Alert rules

---

# 27. ⚙️ Local Development

## Prerequisites

Recommended environment:

- Node.js
- npm
- Python
- PostgreSQL
- Docker
- Git

---

## Clone the Repository

```bash
git clone https://github.com/Indemmity/FineProject.git
cd FineProject
```

---

## Install Dependencies

```bash
npm install
```

Python dependencies are maintained within the relevant service directories.

Example:

```bash
cd phases/p1/harvester
pip install -r requirements.txt
```

---

# 28. 🐳 Docker

The repository includes Docker configuration for local infrastructure.

From the project root:

```bash
docker compose up
```

The P0 configuration can start:

- PostgreSQL
- Redis
- Web application

---

# 29. 🧪 Running Individual Services

## P1

```bash
cd phases/p1/harvester
pip install -r requirements.txt
pip install pytest pytest-asyncio
```

Run tests:

```bash
python -m pytest tests/ -v
```

Start the service:

```bash
uvicorn app.main:app --reload --port 8001
```

API:

```text
http://localhost:8001
```

Health check:

```bash
curl http://localhost:8001/health
```

List sources:

```bash
curl http://localhost:8001/api/jobs/sources
```

Search:

```bash
curl -X POST http://localhost:8001/api/jobs/search \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["software engineer"]}'
```

List jobs:

```bash
curl http://localhost:8001/api/jobs/
```

---

## P1 Docker

```bash
docker compose up harvester
```

Or:

```bash
cd phases/p1/harvester
docker build -t jobplatform-harvester .
docker run -p 8001:8001 jobplatform-harvester
```

---

## P2

Install dependencies:

```bash
cd phases/p0
npm install
```

Run tests:

```bash
npx vitest run --config vitest.config.ts
```

Start web application:

```bash
npm run dev
```

---

## P3

```bash
cd phases/p3/closer
pip install -r requirements.txt
```

Run tests:

```bash
python -m pytest tests/ -v
```

Start service:

```bash
uvicorn app.main:app --reload --port 8002
```

---

## P3 CLI

Preview a cold email:

```bash
python -m cli.main preview \
  --company "TechCorp" \
  --role "Engineer" \
  --name "Jane"
```

Interactive send:

```bash
python -m cli.main send \
  --email "jane@techcorp.com" \
  --company "TechCorp"
```

---

## P4

Start orchestrator:

```bash
cd phases/p4/orchestrator
npm install
npx tsx src/main.ts
```

Health check:

```bash
curl http://localhost:8100/health
```

Start pipeline:

```bash
curl -X POST http://localhost:8100/api/pipeline/start
```

---

# 30. 🔑 Environment Configuration

Create the environment configuration from the example:

```bash
cp .env.example .env
```

Depending on the service being used, environment variables may include:

```text
DATABASE_URL
GROQ_API_KEY
LLM_MODEL
SMTP configuration
Authentication configuration
```

> **Never commit API keys, OAuth credentials, database credentials, or other secrets to Git.**

---

# 31. 🔌 API Overview

## Job Search

```text
POST   /api/jobs/search
GET    /api/jobs/search/{search_id}
GET    /api/jobs/search?q=...
GET    /api/jobs/
GET    /api/jobs/{id}
DELETE /api/jobs/{id}
GET    /api/jobs/sources
GET    /api/jobs/export
```

---

## Resume

```text
POST /api/resume/:id/analyze
POST /api/resume/:id/tailor
POST /api/resume/:id/export
```

---

## Outreach

```text
POST /api/outreach/generate
POST /api/outreach/:id/preview
POST /api/outreach/:id/send
POST /api/outreach/:id/queue
POST /api/outreach/:id/track
GET  /api/outreach/logs
GET  /api/outreach/stats
GET  /api/outreach/export
```

---

## Pipeline

```text
GET  /health
POST /api/pipeline/start
GET  /api/pipeline/
GET  /api/pipeline/:id
POST /api/pipeline/:id/transition
```

---

# 32. ⚠️ Implementation Notes

This repository represents a substantial engineering prototype and product system.

Some components currently use:

- In-memory storage
- In-memory event infrastructure
- Development-oriented configurations
- Mock LLM responses
- Service-specific local infrastructure

These implementation choices provide a foundation for future production-scale infrastructure.

The architecture is intentionally modular so individual components can evolve independently.

---

# 33. 🧠 AI Product Design Principles

The project demonstrates several practical principles for building AI-enabled products.

### Problem before model

The product begins with a workflow problem rather than starting with an AI capability.

### AI where it adds value

LLMs are used for contextual tasks such as interpretation, analysis, rewriting, and personalization.

### Deterministic logic for predictable tasks

Traditional software handles validation, state transitions, rules, permissions, and other predictable operations.

### AI output requires validation

AI-generated content is treated as probabilistic rather than automatically correct.

### Human oversight for consequential actions

The user remains in control of actions that can materially affect professional communication or information.

### Reliability is part of the product

Retries, caching, circuit breakers, error handling, and observability are treated as product requirements.

### Cost affects architecture

The number and type of model calls affect both system economics and user experience.

---

# 34. 💰 Cost & Performance Considerations

AI functionality introduces both inference cost and latency.

The platform therefore includes several mechanisms to reduce unnecessary model usage.

---

## LLM Caching

Common responses can be cached using TTL-based invalidation.

---

## Mock Mode

Deterministic mock responses allow UI development without repeatedly calling an LLM.

---

## Retry Control

Failed model calls use bounded retry strategies rather than indefinite retries.

---

## Circuit Breaker

Repeated dependency failures can temporarily stop additional requests.

---

## AI / Deterministic Separation

The application avoids using an LLM for operations that can be handled reliably through traditional application logic.

---

# 35. 📊 Product Evaluation

The current evaluation framework focuses on how the product could be assessed across multiple dimensions.

```text
                    PRODUCT SUCCESS
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
     QUALITY          EFFICIENCY          TRUST
        │                 │                 │
   Relevance           Time saved       Accuracy
   Tailoring           Latency           Safety
   Truthfulness        Cost             Control
```

The framework considers:

- Relevance
- Resume quality
- Truthfulness
- Gap quality
- Outreach quality
- Usefulness
- Reliability
- Latency
- Cost
- User control
- Workflow completion

---

# 36. 🚀 Roadmap

The current platform provides the foundation for additional AI, product, and infrastructure improvements.

---

## AI & Personalization

Potential future improvements include:

- More sophisticated job-to-resume matching
- Improved candidate-job relevance scoring
- Personalized application recommendations
- Better feedback loops from application outcomes
- More advanced outreach personalization

---

## AI Evaluation

Potential future improvements include:

- Automated evaluation datasets
- LLM-as-judge evaluation where appropriate
- Human evaluation workflows
- Hallucination/fabrication benchmarks
- Prompt regression testing
- Model comparison experiments

---

## Infrastructure

Potential future improvements include:

- Redis-backed event bus
- Persistent workflow state
- Background workers
- Distributed job processing
- More comprehensive observability

---

## Product

Potential future improvements include:

- Application outcome analytics
- Candidate performance insights
- Better opportunity prioritization
- More intelligent follow-up recommendations
- Additional job sources

---

# 37. 🏁 Project Status

All six planned phases are documented as complete:

```text
P0  Foundation                     ✅
P1  Job Harvester                  ✅
P2  Resume Tailor                  ✅
P3  The Closer                     ✅
P4  Integration                    ✅
P5  Polish / Production Readiness  ✅
```

The platform represents an end-to-end prototype architecture for AI-assisted job search and application management.

---

# 38. 🎯 Product Strategy & AI Design

This project was approached as more than a collection of AI features.

The central product question was:

> **How can AI reduce the operational effort of a job search without removing the candidate's control over important decisions?**

That question shaped the product architecture.

### Problem → Solution

The platform addresses the fragmented nature of the job-search workflow by connecting discovery, resume intelligence, outreach, tracking, and follow-up.

### AI where it adds value

AI is applied to contextual tasks such as:

- Understanding resumes
- Identifying gaps
- Tailoring content
- Checking truthfulness
- Personalizing communication

### Deterministic logic where appropriate

Predictable tasks remain within traditional software logic.

### Human control

Consequential actions are designed around review and validation rather than blind automation.

### Safety by design

Resume fabrication and inaccurate professional claims are treated as product risks.

### Cost awareness

Caching, mock mode, bounded retries, and selective AI usage are incorporated into the architecture.

### Reliability

The product accounts for model failures, API failures, timeouts, rate limits, invalid outputs, and dependency failures.

### Scalability

The modular architecture separates product capabilities into services that can evolve independently.

---

# 39. 💡 Product Philosophy

> **The goal is not to automate everything. The goal is to automate the right things while keeping people in control of consequential decisions.**

---

# 40. 👤 Author

## Indemmity Lamare

**Aspiring AI Product Manager**

Interested in:

**AI Product Management × AI/ML × Automation × Human-Centered Product Design**

I build practical AI products focused on solving real workflow problems and exploring how AI can be integrated into products responsibly, reliably, and with meaningful user value.

---
