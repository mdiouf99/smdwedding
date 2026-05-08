# Sophie & Thomas — Wedding Invitation Site

A complete wedding invitation site built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

## Features
- Hero, live countdown, schedule timeline, venue + map, photo gallery
- RSVP form saving to Supabase, with QR-code generation
- `/checkin?token=…` guest landing page
- `/admin/checkin` camera-based QR scanner (`html5-qrcode`)
- Wishes wall with realtime updates and heart reactions
- `/admin` dashboard with stats, search, CSV export, message moderation
- Password-protected admin area via middleware (cookie-based)

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase project values
npm run dev
```

Visit http://localhost:3000

> The site runs without Supabase (RSVP/Wishes fall back to local-only). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable persistence and realtime.

## Supabase setup

1. Create a Supabase project.
2. In **SQL editor**, run [`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql).
3. Copy your **Project URL** and **anon key** into `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
ADMIN_PASSWORD=mariage2025
```

## Admin
- `/admin/login` — password (default `mariage2025`, override via `ADMIN_PASSWORD`)
- `/admin` — dashboard
- `/admin/checkin` — QR scanner (requires camera permission, HTTPS in production)

## Deploy on Vercel
1. Push the repo to GitHub.
2. Import in Vercel.
3. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`.
4. Deploy.
