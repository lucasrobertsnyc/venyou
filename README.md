# Stubs — Track. Rate. Rank. Relive.

The social sports passport for every game you've been to.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables required.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with waitlist form |
| `/dashboard` | Personal dashboard (demo user: Alex Rivera) |
| `/log` | 3-step log form with 9-category rating |
| `/stats` | Stats & charts (Recharts) |
| `/rankings/demo1` | Alex's 4 ranking lists |
| `/profile/demo1` | Alex's profile |
| `/profile/demo2` | Jordan's profile |
| `/venue/[slug]` | Individual venue page (e.g. `/venue/arrowhead-stadium`) |

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS v3
- Recharts for stats charts
- No database — all data in `data/events.ts`
- No auth — hardcoded demo user (demo1)
