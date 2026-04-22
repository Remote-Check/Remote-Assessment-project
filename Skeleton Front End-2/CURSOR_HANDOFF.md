# Handoff to Cursor: MoCA Assessment App Backend

## Context
We have built the complete frontend for a 14-step MoCA (Montreal Cognitive Assessment) web app designed for elderly patients, along with a Clinician Dashboard for reviewing the results. The UI is highly accessible, offline-first, and strictly mimics the pen-and-paper test with manual progression. 

The frontend is complete. Your task is to build the Supabase backend and wire it up to the existing frontend state management.

## Tech Stack
- **Frontend:** React, React Router (Data Mode), Tailwind CSS v4, Lucide Icons
- **State Management:** React Context (`AssessmentContext`) for test flow, IndexedDB (`AudioStore`) for offline audio
- **Performance:** `@tanstack/react-virtual` for the clinician dashboard list, Canvas API for drawing tasks
- **Backend (Target):** Supabase (PostgreSQL, Auth, Storage, Edge Functions)

## Current Architecture & Data Flow
1. **Patient Flow:** The patient goes through 14 standardized steps (Clock Drawing, Trail Making, Serial 7s, Delayed Recall, etc.).
2. **Drawing Tasks (Canvas):** Strokes are captured as an array of `Point` objects (x, y, time, pressure, pointerType) and stored in `AssessmentContext`.
3. **Verbal Tasks (Audio):** Audio is recorded via `AudioRecorder.tsx`, saved locally to IndexedDB via `AudioStore.tsx`, and the resulting `audioId` is saved to `AssessmentContext`.
4. **Clinician Dashboard:** 
   - `/dashboard`: A virtualized list of patients (`ClinicianDashboardList.tsx`).
   - `/dashboard/:patientId`: A detailed review screen (`ClinicianDashboardDetail.tsx`) that lazy-loads `PlaybackCanvas.tsx` for drawings and `PlaybackAudio.tsx` (fetching from IndexedDB) for verbal responses.

## Backend Implementation Goals

### 1. Database Schema (Supabase SQL)
- Create tables for `patients`, `assessments` (to store the JSON/JSONB state of the test, including drawing strokes and scores), and `clinicians`.
- Set up Row Level Security (RLS) so clinicians can only access their own patients' data and recordings.

### 2. Storage (Supabase Storage)
- Create a private bucket (e.g., `moca-audio-recordings`).
- Write a sync utility to take the offline audio blobs stored in the local IndexedDB (`AudioStore`), upload them to Supabase Storage at the end of the test, and update the `assessment` record with the remote storage paths.
- Ensure audio files are secured via RLS policies so only the assigned clinician can generate signed URLs.

### 3. Authentication (Supabase Auth)
- Implement an email/password or magic link login for clinicians to access the `/dashboard` routes.
- Protect the dashboard routes using a React Router loader or layout component that checks the Supabase session state.

### 4. API Integration (Frontend to Backend)
- **Dashboard List:** Replace the dummy virtualized data in `ClinicianDashboardList.tsx` with a real Supabase query fetching the clinician's patients and their latest assessment statuses.
- **Dashboard Detail:** Update `ClinicianDashboardDetail.tsx` to fetch the specific assessment JSON from Supabase and generate signed URLs for the audio playback in `PlaybackAudio.tsx`.
- **Patient Submission:** Update the final "Submit" step of the patient flow to push the `AssessmentContext` state and all associated IndexedDB blobs to the backend.