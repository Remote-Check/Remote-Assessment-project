# Supabase Setup Instructions

## Prerequisites
- Supabase account at supabase.com
- Supabase CLI: `brew install supabase/tap/supabase`
- A Resend account for email (resend.com) — free tier sufficient for MVP

## 1. Create Supabase project
1. Go to supabase.com → New project
2. Choose region: **AWS ap-southeast-1 (Singapore)** for now (il-central-1 not yet available in Supabase)
   - When Supabase supports il-central-1, migrate for full Israeli data residency
3. Note your **Project URL** and **anon key** (Settings → API)
4. Note your **service role key** (Settings → API → service_role — keep secret)

## 2. Initialize and link CLI
```bash
cd "Remote Assessment project"
supabase init
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

## 3. Run migrations
```bash
supabase db push
```
This applies all 3 migrations:
- `20260421000001_schema.sql` — tables
- `20260421000002_rls.sql` — row level security
- `20260421000003_storage.sql` — drawings bucket

## 4. Set environment variables

**Client** — copy and fill:
```bash
cp client/.env.example client/.env.local
# Edit client/.env.local with your Project URL and anon key
```

**Edge Functions** — set secrets:
```bash
supabase secrets set RESEND_API_KEY=re_your-key-here
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically
```

## 5. Deploy Edge Functions
```bash
supabase functions deploy start-session
supabase functions deploy submit-results
supabase functions deploy complete-session
supabase functions deploy save-drawing
```

## 6. Enable Email Auth
1. Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Disable **Confirm email** for MVP (re-enable before production)

## 7. Create first clinician account
```bash
# In Supabase SQL editor:
insert into clinicians (id, clinic_name)
values ('YOUR_AUTH_USER_UUID', 'שם המרפאה');
```

## 8. Verify setup
- Create a session row manually in the DB
- Visit `http://localhost:5173/?t=YOUR_LINK_TOKEN`
- Should load assessment (not "invalid link")

## Notes
- `link_token` goes in the URL: `/assess?t={token}`
- Each token is single-use — once patient loads it, it's consumed
- Drawings stored in `assessment-drawings` bucket, private, signed URLs only
