# Nexora — Stage 1: Foundation

## Setup
1. Create an Appwrite project; copy `.env.example` to `.env` and fill in the project ID.
2. Console → Overview → API keys: create a key with scopes `databases.*`, `collections.*`, `attributes.*`, `indexes.*`, `buckets.*`. Put it in `APPWRITE_API_KEY` (local only, never in Vercel).
3. `npm install && npm run setup:appwrite`
4. Console → Overview → Platforms: add a Web platform for localhost and your Vercel domain.
5. `npm run dev`

## Creating the first owner (secure)
1. Console → Auth → Create user (strong unique password, 12+ chars). Do NOT add a signup page that grants roles.
2. Open that user → **Labels** → add `owner`. Labels can only be set from the console/server, never by the browser.
3. Enable MFA on that user (Auth → user → MFA) and rotate/delete the API key from step 2 afterward.
4. Sign in at `/admin/login`. Password recovery uses `/admin/reset`; set your SMTP in Console → Settings → SMTP so reset emails send.

## Security model
- Browser-supplied roles are never trusted: permissions are Appwrite collection/bucket rules keyed to `label:owner` / `label:staff`.
- Drafts live in private `site_content_draft`; only `site_content_published` is public-read. Publishing copies draft → published.
- `orders`, `profiles`, `audit_logs` have no public access; `audit_logs` is written only by server functions (Stage 4).
- Uploads: whitelisted extensions, 10 MB cap.

## Vercel
Set only the four `VITE_*` variables. `vercel.json` already handles SPA routing.
