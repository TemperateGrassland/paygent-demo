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
- [x] **Payment status detection** — reply parsed to distinguish confirmed payment from refusals/questions
- [x] **Payment retry** — `/pay` endpoint retries Ralio payment on verified jobs without re-running Claude
- [x] **Dashboard** — lists all jobs with status badges + live Ralio transaction history (`/dashboard`)

### Ralio Integration
- [x] OAuth2 credentials registered (`cb_PjjMNRi1bO94YR82Nn6omA`)
- [x] `RalioClient` singleton with 120s timeout
- [x] `chat.send()` for payment execution — message includes source account and escrow context
- [x] `transactions.list()` for audit trail
- [x] Approval requirement disabled on Ralio agent for demo
- [x] "Charlie" registered as beneficiary in Ralio sandbox console

### Ralio Agent Chat
- [x] Live streaming chat interface (`/chat`) — ask the Ralio agent anything
- [x] Suggested questions pre-loaded for demo
- [x] Streaming responses via `chat.stream()` with real-time display
- [x] Tool call names hidden from output (clean UX)

### Demo Data
- [x] **Happy path** — "Build a landing page for Demi AI" / `withdemi.com` / £500 / **paid** ✅
- [x] **Unhappy path** — "Write a technical blog post about AI payments" / inadequate submission / **rejected** ❌

### Confirmed Working
- [x] Full happy path end-to-end: job → submission → Claude approval → Ralio payment (£500 to Charlie, Payment ID: `ralio-2007ec5d-dcaf-4ce7-8459-f0240e36bd4b`)
- [x] Full unhappy path: job → submission → Claude rejection → no payment triggered

---

## Next Steps

### Demo Recording
- [ ] Record video demo using Loom (screen + webcam)
- [ ] Happy path: use copy-paste text provided — property inspection job → clear submission → paid
- [ ] Unhappy path: logo design job → vague submission → rejected
- [ ] Show Ralio agent chat: balance, transactions, spend limits

### Additional Features (stretch)
- [ ] **Dummy data / analytics** — create batch of historical jobs so Ralio agent can answer "who are my top contractors", "how much paid out this month" etc.
- [ ] **Milestone payments** — split job into stages, pay incrementally (e.g. 80% complete → pay £400 of £500)
- [ ] **Dispute resolution agent** — second Claude call acts as arbitrator when contractor disputes a rejection
- [ ] **Multi-modal verification** — image/video support for property inspections, car rentals etc.

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
