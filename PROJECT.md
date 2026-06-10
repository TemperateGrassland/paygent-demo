# Paygent — Project Overview

**Hackathon:** Antler x Ralio
**Team:** Ahmed, Charlie, Josh

---

## The Problem

Escrow payment disputes are slow, manual, and expensive. Real examples from the team:
- Ahmed waited **20 days** for dispute resolution on a freelancing platform
- Josh waited **14 days** for a deposit return on a rental property

Verification steps for escrow payments are manual and costly for businesses, resulting in poor customer experiences and long resolution times.

---

## The Solution

Paygent is a **verification engine** that businesses plug into to verify work and deliverables before releasing escrowed funds or escalating to dispute resolution.

- Integrates with **Ralio** for secure, auditable payments with configurable guardrails
- AI-powered verification replaces slow manual review
- Payments are released with confidence or escalated automatically

---

## Demo Script

### Happy Path
1. Employer posts a job with a payment amount
2. Contractor submits their work (URL, description, or deliverable)
3. Claude AI verifies the submission against the job requirements
4. Ralio agent releases payment to the contractor instantly

### Unhappy Path
1. Contractor submits work that doesn't meet requirements
2. Claude AI rejects the submission with reasoning
3. Job is flagged for dispute resolution

---

## What We've Built

### Infrastructure
- [x] Next.js 16 app (App Router, TypeScript, Tailwind)
- [x] Deployed to GitHub (`TemperateGrassland/paygent-demo`)
- [x] Vercel deployment configured
- [x] Persistent JSON file store (`data/jobs.json`) — survives server restarts

### Core Flow
- [x] **Job creation** — employer posts title, requirements, amount, contractor name (`/jobs/new`)
- [x] **Work submission** — contractor submits deliverable URL or description (`/jobs/[id]`)
- [x] **AI verification** — Claude (claude-sonnet-4-6) verifies work against requirements using structured tool_use output
- [x] **Ralio payment** — Ralio agent releases funds via natural language instruction (`chat.send()`)
- [x] **Dashboard** — lists all jobs with status badges + live Ralio transaction history (`/dashboard`)

### Ralio Integration
- [x] OAuth2 credentials registered (`cb_PjjMNRi1bO94YR82Nn6omA`)
- [x] `RalioClient` singleton with 120s timeout
- [x] `chat.send()` for payment execution
- [x] `transactions.list()` for audit trail
- [x] `/pay` retry endpoint for verified jobs where payment timed out

### Ralio Agent Chat
- [x] Live streaming chat interface (`/chat`) — ask the Ralio agent anything
- [x] Suggested questions: balance, transactions, spend limits, payment reasoning
- [x] Streaming responses via `chat.stream()` with real-time display

---

## Next Steps

### Demo Priorities
- [ ] Test full happy path end-to-end (withdemi.com as dummy submission)
- [ ] Test unhappy path — job that fails verification
- [ ] Confirm Ralio payment lands (resolve timeout issue)

### Additional Features (stretch)
- [ ] **Milestone payments** — split job into stages, pay incrementally (e.g. 80% complete → pay £400 of £500)
- [ ] **Dispute resolution agent** — second Claude call acts as arbitrator when contractor disputes a rejection
- [ ] **Multi-modal verification** — image/video support for property inspections, car rentals etc.
- [ ] **Analytics dashboard** — top contractors, dispute frequency, recommendations to reduce disputes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| AI Verification | Anthropic Claude (claude-sonnet-4-6) via `@anthropic-ai/sdk` |
| Payments | Ralio via `@ralioco/sdk` (OAuth2 + DPoP, sandbox) |
| Storage | JSON file store (`data/jobs.json`) |
| Hosting | Vercel |

## Key Files

| File | Purpose |
|---|---|
| `lib/claude.ts` | Claude verification agent (tool_use structured output) |
| `lib/ralio.ts` | RalioClient singleton |
| `lib/store.ts` | Persistent JSON job store |
| `app/api/jobs/[id]/verify/route.ts` | Core verify + pay logic |
| `app/api/chat/route.ts` | Streaming Ralio agent chat |
| `app/chat/page.tsx` | Chat UI |
| `app/dashboard/page.tsx` | Dashboard + transaction history |
