# Portfolio — Joaquín Pozzo

Personal portfolio with an iOS / visionOS visual language (“Sala de proyección”).

## Stack

- Astro + React 19 islands + TypeScript (strict)
- Tailwind CSS v4 · Vitest · Playwright + axe
- Vercel adapter (static pages + serverless `/api/*`)
- Zero paid services: Gemini free tier, Web3Forms/Resend free, mailto fallback

## Scripts

```bash
pnpm install
pnpm dev          # http://127.0.0.1:4321
pnpm build        # syncs shots + generates CV PDFs + OG images
pnpm test
pnpm test:e2e
pnpm assets:cv
pnpm assets:og
```

## Environment variables (all optional for local UI)

Copy `.env.example` → `.env`.

| Variable | Purpose | Free setup |
| --- | --- | --- |
| `GEMINI_API_KEY` | Joaquín AI chat | [Google AI Studio](https://aistudio.google.com/apikey) → Create API key |
| `GEMINI_MODEL` | Override model (default `gemini-2.0-flash`) | optional |
| `WEB3FORMS_ACCESS_KEY` | Contact form delivery | [web3forms.com](https://web3forms.com) free access key |
| `RESEND_API_KEY` | Alternate contact mailer | [resend.com](https://resend.com) free tier |
| `RESEND_FROM` | Verified from-address for Resend | optional |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | Durable chat rate limits | [Upstash](https://upstash.com) free Redis REST |

Without `GEMINI_API_KEY`, the chat widget shows **próximamente** and a mailto CTA (build/tests stay green).  
Without a form key, `/api/contact` returns a `mailto:` fallback.

### Gemini free key (quick)

1. Open [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with Google → **Create API key**
3. Set `GEMINI_API_KEY` in Vercel project env (Production + Preview) or local `.env`

## Features

- **Joaquín AI** — `/api/chat`, Gemini provider behind a small interface, verified-knowledge dossier, guardrails, IP/session/global rate limits (in-memory; Upstash optional)
- **Contact form** — Zod + honeypot + min dwell time; Web3Forms/Resend or mailto
- **CV PDFs** — `public/cv-es.pdf` / `public/cv-en.pdf` from verified facts at build
- **OG images** — `public/og/{es,en}/*.png` generated at build

## Layout

| Token | 390 | 834 | 1440 |
| --- | --- | --- | --- |
| `--gutter` | 16px | 32px | 48px |
| `--card-pad` | 20px | 24px | 32px |
| `--content-max` | 1120px | | |

Debug: `?grid=1`.

## Deploy (Vercel)

Auto-deploy from Git is **disabled** so pushes to `main` do not publish:

```json
"git": { "deploymentEnabled": false }
```

in `vercel.json`. The linked Vercel project stays connected; nothing goes live until you re-enable.

### Re-enable production deploys

1. Change that block to `"git": { "deploymentEnabled": true }` (or delete the `git` key), **or**
2. In the Vercel project → **Settings → Git**, turn production deployments back on.

Then push to `main` (or trigger a redeploy from the Vercel dashboard).

## Roadmap

- Stage 1–2 ✅
- Stage 3 chatbot + contact + CV PDF + OG ✅
