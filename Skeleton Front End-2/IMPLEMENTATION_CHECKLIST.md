# Backend Implementation Checklist

Track your progress implementing the Remote Check backend.

---

## Phase 1: Setup & Infrastructure

### Supabase Project
- [ ] Create Supabase project in `il-central-1` region
- [ ] Note project ID and service role key
- [ ] Configure `.env.local` with credentials
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Link local project: `supabase link --project-ref <id>`

### Database Schema
- [ ] Copy `DATABASE_SCHEMA.sql` to `supabase/migrations/20260421_initial_schema.sql`
- [ ] Apply migration: `supabase db push`
- [ ] Verify 4 tables created: sessions, task_results, scoring_reports, drawing_reviews
- [ ] Check RLS policies enabled on all tables
- [ ] Verify indexes created (9 total)
- [ ] Test database connection from Supabase dashboard

### Storage Setup
- [ ] Create storage bucket named `drawings`
- [ ] Set bucket to private (not public)
- [ ] Configure storage policies for clinician access
- [ ] Test file upload via dashboard

### Authentication
- [ ] Enable Email/Password auth in Supabase dashboard
- [ ] Create test clinician account
- [ ] Verify JWT token generation
- [ ] Test auth with Postman/curl

---

## Phase 2: Scoring Engine (Pure TypeScript)

### File Structure
- [ ] Create directory: `src/lib/scoring/`
- [ ] Create directory: `src/lib/scoring/__tests__/`
- [ ] Create directory: `src/types/`
- [ ] Create directory: `src/data/`

### Type Definitions
- [ ] Create `src/types/scoring.ts`
- [ ] Define `TaskResult` interface
- [ ] Define `ScoringReport` interface
- [ ] Define `Subscore` interface
- [ ] Define `NormData` interface

### Configuration Data
- [ ] Create `src/data/scoring-config.json`
- [ ] Add naming task config (correct answers)
- [ ] Add memory task config (max scores)
- [ ] Add orientation task config (fields)
- [ ] Add digit span config (scoring rules)
- [ ] Add vigilance config (target letter)
- [ ] Add serial 7s config (correct sequence)
- [ ] Add abstraction config (acceptable answers)

### Normative Data
- [ ] Research Lifshitz et al. 2012 paper
- [ ] Create `src/data/lifshitz-norms.json`
- [ ] Add age band 60-64 percentiles
- [ ] Add age band 65-69 percentiles
- [ ] Add age band 70-74 percentiles
- [ ] Add age band 75-79 percentiles
- [ ] Add age band 80+ percentiles

### Scorer Functions
- [ ] Create `src/lib/scoring/scorers.ts`
- [ ] Implement `scoreNaming()` - returns 0-3
- [ ] Implement `scoreMemory()` - first recall
- [ ] Implement `scoreDigitSpan()` - forward + backward
- [ ] Implement `scoreVigilance()` - correct taps
- [ ] Implement `scoreSerial7s()` - correct subtractions
- [ ] Implement `scoreLanguage()` - sentence repetition
- [ ] Implement `scoreAbstraction()` - similarities
- [ ] Implement `scoreDelayedRecall()` - word recall
- [ ] Implement `scoreOrientation()` - date/place
- [ ] Add error handling to each scorer (try-catch)

### Norms Lookup
- [ ] Create `src/lib/scoring/norms.ts`
- [ ] Implement `getPercentile(score, ageBand)`
- [ ] Load data from `lifshitz-norms.json`
- [ ] Handle edge cases (score > max, invalid age band)
- [ ] Add interpolation for scores between percentiles

### Utilities
- [ ] Create `src/lib/scoring/utils.ts`
- [ ] Implement `validateTaskData(taskName, data)`
- [ ] Implement `normalizeAnswer(text)` for Hebrew text
- [ ] Implement `calculateTotalScore(subscores)`
- [ ] Implement `isDrawingTask(taskName)`

### Main Scoring Function
- [ ] Create `src/lib/scoring/index.ts`
- [ ] Implement `scoreSession(taskResults, ageBand)`
- [ ] Loop through all task results
- [ ] Call appropriate scorer for each task
- [ ] Collect auto-score errors
- [ ] Set `needsReview = true` for drawings
- [ ] Calculate total score from subscores
- [ ] Lookup percentile from norms
- [ ] Return complete `ScoringReport`

### Tests (TDD)
- [ ] Create `src/lib/scoring/__tests__/scoring.test.ts`
- [ ] Test `scoreNaming()` - perfect score
- [ ] Test `scoreNaming()` - partial score
- [ ] Test `scoreMemory()` - all words recalled
- [ ] Test `scoreOrientation()` - all correct
- [ ] Test `scoreOrientation()` - missing fields
- [ ] Test `scoreSession()` - complete session
- [ ] Test `scoreSession()` - drawing marks needsReview
- [ ] Test `scoreSession()` - handles scoring errors
- [ ] Test `getPercentile()` - each age band
- [ ] Target: 95% code coverage
- [ ] Run: `npm test src/lib/scoring`
- [ ] All tests passing ✅

---

## Phase 3: Edge Functions

### Shared Utilities
- [ ] Create `supabase/functions/_shared/`
- [ ] Create `_shared/supabase.ts` - createClient helper
- [ ] Create `_shared/cors.ts` - CORS headers constant
- [ ] Create `_shared/errors.ts` - error response builder
- [ ] Create `_shared/validators.ts` - request validation

### Function: start-session
- [ ] Create `supabase/functions/start-session/index.ts`
- [ ] Handle OPTIONS for CORS preflight
- [ ] Verify clinician JWT token
- [ ] Parse request body (caseId, ageBand)
- [ ] Validate required fields
- [ ] Check for duplicate caseId
- [ ] Insert session into database
- [ ] Generate linkToken (UUID)
- [ ] Return session details + URL
- [ ] Add error handling
- [ ] Create `_test.ts` test file
- [ ] Test with curl/Postman
- [ ] Deploy: `supabase functions deploy start-session`
- [ ] Test deployed version

### Function: submit-task
- [ ] Create `supabase/functions/submit-task/index.ts`
- [ ] Validate link token (not used/expired)
- [ ] Parse request (taskName, taskData)
- [ ] Validate task name is valid
- [ ] Mark session as `in_progress` if first task
- [ ] Check if drawing task (cube, clock, trailMaking)
- [ ] If drawing, call `save-drawing` function
- [ ] Upsert into task_results table
- [ ] Return success response
- [ ] Add error handling
- [ ] Create test file
- [ ] Test with valid link token
- [ ] Test with invalid token
- [ ] Deploy and test

### Function: save-drawing
- [ ] Create `supabase/functions/save-drawing/index.ts`
- [ ] Parse request (sessionId, taskName, strokesData, canvasPNG)
- [ ] Validate session exists
- [ ] Insert into drawing_reviews table
- [ ] If canvasPNG provided:
  - [ ] Decode base64 PNG
  - [ ] Upload to storage: `drawings/{sessionId}/{taskName}.png`
  - [ ] Save storage_path in drawing_reviews
- [ ] Update scoring_reports: `needsReview = true`
- [ ] Return storage path
- [ ] Add error handling
- [ ] Create test file
- [ ] Test with stroke data only
- [ ] Test with PNG upload
- [ ] Deploy and test

### Function: complete-session
- [ ] Create `supabase/functions/complete-session/index.ts`
- [ ] Validate link token
- [ ] Check all required tasks submitted
- [ ] Fetch all task_results for session
- [ ] Import scoring engine: `import { scoreSession } from '../../src/lib/scoring'`
- [ ] Call `scoreSession(taskResults, ageBand)`
- [ ] Insert/update scoring_reports table
- [ ] Mark session: `status = 'completed'`, `completed_at = NOW()`
- [ ] Mark link_token: `used = true`
- [ ] Return scoring report
- [ ] Add error handling
- [ ] Create test file
- [ ] Test complete flow
- [ ] Test with missing tasks
- [ ] Deploy and test

### Function Testing
- [ ] Create integration test suite
- [ ] Test: clinician creates session
- [ ] Test: patient submits all tasks
- [ ] Test: patient completes session
- [ ] Test: verify score calculated
- [ ] Test: verify drawings marked for review
- [ ] Test: invalid token rejected
- [ ] Test: duplicate submission handling

---

## Phase 4: Frontend Integration

### API Client
- [ ] Create `src/lib/api/client.ts`
- [ ] Implement `startSession(caseId, ageBand)`
- [ ] Implement `submitTask(linkToken, taskName, taskData)`
- [ ] Implement `completeSession(linkToken)`
- [ ] Implement `getSession(sessionId, clinicianToken)`
- [ ] Implement `updateDrawingScore(reviewId, score, rubric, notes)`
- [ ] Add error handling with retries
- [ ] Add request logging

### Update AssessmentContext
- [ ] Open `src/app/store/AssessmentContext.tsx`
- [ ] Import API client functions
- [ ] Add `linkToken` to state
- [ ] Replace `updateTaskData` with API call
- [ ] Add loading state for API calls
- [ ] Add error state for failed saves
- [ ] Keep localStorage as offline fallback
- [ ] Test with network offline

### Update EndScreen
- [ ] Open `src/app/components/EndScreen.tsx`
- [ ] Import `completeSession` from API client
- [ ] Call API on component mount
- [ ] Display loading state
- [ ] Display preliminary score from response
- [ ] Show error message if API fails
- [ ] Test complete flow

### Update Dashboard List
- [ ] Open `src/app/components/ClinicianDashboardList.tsx`
- [ ] Remove mock data
- [ ] Import Supabase client
- [ ] Fetch sessions from database
- [ ] Display loading skeleton
- [ ] Handle empty state
- [ ] Add pagination
- [ ] Add filtering by status
- [ ] Add search by case ID
- [ ] Test with real data

### Update Dashboard Detail
- [ ] Open `src/app/components/ClinicianDashboardDetail.tsx`
- [ ] Fetch session data from API
- [ ] Load drawing reviews
- [ ] Load stroke data for playback
- [ ] Implement rubric scoring UI
- [ ] Call `updateDrawingScore` on save
- [ ] Add autosave for notes
- [ ] Display total score update
- [ ] Test scoring workflow

### Session Link Generation
- [ ] Create new component: `CreateSessionModal.tsx`
- [ ] Add form for case ID and age band
- [ ] Call `startSession` API
- [ ] Display generated link
- [ ] Add copy-to-clipboard button
- [ ] Show QR code (optional)
- [ ] Add to dashboard

---

## Phase 5: Testing & QA

### Unit Tests
- [ ] All scoring tests passing (95% coverage)
- [ ] All API client tests passing
- [ ] All component tests updated

### Integration Tests
- [ ] End-to-end: Create session → Submit tasks → Complete → Review
- [ ] Test offline mode (localStorage fallback)
- [ ] Test network errors and retries
- [ ] Test concurrent sessions
- [ ] Test drawing upload (5MB PNG)

### Manual Testing
- [ ] Create session as clinician
- [ ] Complete assessment as patient (all 14 tasks)
- [ ] Verify score calculated correctly
- [ ] Review drawings in dashboard
- [ ] Update drawing scores
- [ ] Verify total score recalculated
- [ ] Export PDF (if implemented)
- [ ] Test on mobile device
- [ ] Test RTL layout

### Performance Testing
- [ ] Load test: 100 concurrent patient sessions
- [ ] Load test: 50 clinicians reviewing simultaneously
- [ ] Verify Edge Function response time < 500ms
- [ ] Verify drawing upload < 2 seconds
- [ ] Check database query performance

### Security Audit
- [ ] RLS policies tested for all tables
- [ ] Link tokens properly validated
- [ ] Service role key not exposed to frontend
- [ ] CORS configured correctly
- [ ] SQL injection tests
- [ ] XSS prevention in notes field

---

## Phase 6: Deployment

### Environment Setup
- [ ] Create production Supabase project
- [ ] Configure production environment variables
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring (Sentry, LogRocket)

### Database Migration
- [ ] Run migrations on production
- [ ] Verify all tables created
- [ ] Verify RLS policies enabled
- [ ] Create initial clinician accounts
- [ ] Test with production database

### Edge Functions Deployment
- [ ] Deploy all functions to production
- [ ] Verify CORS headers work
- [ ] Test each endpoint with Postman
- [ ] Configure rate limiting
- [ ] Set up function logging

### Frontend Deployment
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Vercel/Netlify
- [ ] Verify environment variables set
- [ ] Test production build locally
- [ ] Deploy to production
- [ ] Verify all features work

### Monitoring Setup
- [ ] Set up error tracking (Sentry)
- [ ] Configure alerts for:
  - [ ] Session completion rate < 90%
  - [ ] API error rate > 0.1%
  - [ ] Drawing upload failures
  - [ ] Auto-scoring errors > 5%
- [ ] Set up uptime monitoring
- [ ] Create dashboard for key metrics

---

## Phase 7: Documentation & Handoff

### Code Documentation
- [ ] Add JSDoc comments to all public functions
- [ ] Document API client usage
- [ ] Document scoring engine logic
- [ ] Update README with setup instructions

### User Documentation
- [ ] Clinician guide: How to create sessions
- [ ] Clinician guide: How to review drawings
- [ ] Patient guide: How to complete assessment
- [ ] Troubleshooting guide

### Handoff Materials
- [ ] Record demo video of complete flow
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures
- [ ] List all credentials and access

---

## Completion Criteria

### Backend Complete ✅
- [ ] All 4 Edge Functions deployed and tested
- [ ] Scoring engine 95%+ test coverage
- [ ] Database schema applied with RLS
- [ ] Storage bucket configured

### Frontend Integration Complete ✅
- [ ] All API calls working
- [ ] Dashboard loads real data
- [ ] Session creation works
- [ ] Drawing review works
- [ ] Offline fallback works

### Production Ready ✅
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit complete
- [ ] Monitoring configured
- [ ] Documentation complete

---

## Timeline Estimate

- **Phase 1 (Setup):** 1 day
- **Phase 2 (Scoring):** 3-4 days
- **Phase 3 (Edge Functions):** 3-4 days
- **Phase 4 (Frontend):** 2-3 days
- **Phase 5 (Testing):** 2-3 days
- **Phase 6 (Deployment):** 1-2 days
- **Phase 7 (Documentation):** 1 day

**Total: 13-18 days** for full backend implementation

---

## Notes

Use this checklist to track progress. Check off items as you complete them.

For questions, refer to:
- BACKEND_HANDOFF.md - Full implementation guide
- API_SPEC.md - API reference
- DATABASE_SCHEMA.sql - Database structure
- BACKEND_README.md - Directory structure

Good luck! 🎯
