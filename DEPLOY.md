# Deploy — games-hub

## Quick Deploy

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
- Framework auto-detected as Next.js
- Set environment variables in Vercel dashboard
- See [platform-setup-playbook/guides/vercel.md](../platform-setup-playbook/guides/vercel.md)

### Cloudflare Pages
```bash
npm run build
# Upload .next/static to Cloudflare Pages
```
Note: Next.js App Router needs `@cloudflare/next-on-pages` adapter. See platform-setup-playbook for details.

### Local Production
```bash
npm run build
npm start
# Runs on http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` (local) or set in your hosting dashboard (production):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_LOCAL_MODE` | Yes | `true` = no Firebase, `false` = Firebase |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | If Firebase | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | If Firebase | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | If Firebase | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | If Firebase | Storage bucket URL |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | If Firebase | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | If Firebase | Firebase app ID |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Optional | Comma-separated admin emails |

## Firebase Setup

Follow [platform-setup-playbook/guides/firebase-setup.md](../platform-setup-playbook/guides/firebase-setup.md):
1. Create Firebase project
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Copy config to `.env.local`
5. Set `NEXT_PUBLIC_LOCAL_MODE=false`

## GitHub Pages

Not recommended for Next.js App Router. Use Vercel or Cloudflare Pages instead. For static export, set `output: "export"` in `next.config.ts` (limited features).
