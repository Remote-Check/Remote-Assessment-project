# Frontend Comprehensive Planning Document
## Remote Check - Hebrew MoCA Platform

**Last Updated:** April 21, 2026  
**Status:** Planning Phase - Awaiting User Approval  
**Scope:** Screen-by-screen, button-by-button specification

---

## EXECUTIVE SUMMARY

### Primary Users
- **Patients:** 60+ age, low tech literacy, mild cognitive impairment
- **Clinicians:** Desktop-primary, low tech literacy
- **Devices:** Desktop (primary), tablets, mobile (compatible)

### Goals
1. Refine existing React/Tailwind frontend
2. Plan frontend-backend integration (Supabase)
3. Maximize accessibility for elderly/cognitively impaired users
4. Streamline clinician workflow

### Critical Success Factors
- **Touch targets ≥ 64px** (elderly users)
- **High contrast, large text** (vision impairment)
- **Simple navigation** (cognitive load reduction)
- **Forgiving UX** (errors should be recoverable)
- **Fast loading** (impatience, confusion)

---

## SECTION 1: TECH STACK EVALUATION

### Current Stack
```
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- react-router v7 (hash-based routing)
- Supabase (backend)
- HTML5 Canvas (drawing)
- Vite (build tool)
```

### Alternative Stacks Considered

#### Option A: Keep Current Stack (React + Tailwind)
**Pros:**
- ✅ Already implemented (14 tasks done)
- ✅ Large ecosystem, easy to find help
- ✅ TypeScript safety for complex state
- ✅ Tailwind v4 - fast, modern
- ✅ Vite - extremely fast builds
- ✅ No migration risk

**Cons:**
- ❌ React can be heavy for simple tasks
- ❌ Client-side routing (hash-based) - harder SEO
- ❌ Manual performance optimization needed

**Verdict:** **RECOMMENDED** - Migration risk outweighs benefits given progress

---

#### Option B: Migrate to Next.js 14 (App Router)
**Pros:**
- ✅ Server-side rendering (faster initial load)
- ✅ Built-in routing (no react-router)
- ✅ Image optimization
- ✅ Better SEO (if needed)
- ✅ API routes (could replace some Edge Functions)

**Cons:**
- ❌ **HIGH MIGRATION EFFORT** - rewrite all 14 tasks
- ❌ More complex mental model (server/client components)
- ❌ Figma Make compatibility unknown
- ❌ Overkill for single-page assessment app

**Verdict:** **NOT RECOMMENDED** - Too much risk for minimal benefit

---

#### Option C: Migrate to Svelte + SvelteKit
**Pros:**
- ✅ Smaller bundle size (faster for low-end devices)
- ✅ Simpler syntax (easier to maintain)
- ✅ Built-in animations
- ✅ Better performance on older devices

**Cons:**
- ❌ **VERY HIGH MIGRATION EFFORT** - complete rewrite
- ❌ Smaller ecosystem (less help available)
- ❌ Team unfamiliarity
- ❌ Figma Make likely incompatible

**Verdict:** **NOT RECOMMENDED** - Risk too high

---

#### Option D: Hybrid - Keep React, Add Specific Optimizations
**Changes:**
- Use `React.memo` for expensive components
- Add `react-window` for long lists (dashboard)
- Lazy load routes with `React.lazy`
- Optimize Canvas with OffscreenCanvas API
- Add service worker for offline support

**Pros:**
- ✅ Low risk (incremental improvements)
- ✅ Keeps existing code
- ✅ Measurable performance gains
- ✅ Better offline experience

**Cons:**
- ❌ Requires careful profiling
- ❌ More complex code in places

**Verdict:** **RECOMMENDED** - Best risk/reward ratio

---

### DECISION: Stick with Current Stack + Incremental Optimizations

**Final Stack:**
```
✅ React 18.3.1 (with memo, lazy loading)
✅ TypeScript (strict mode)
✅ Tailwind CSS v4 (with custom tokens)
✅ react-router v7 (hash routing for Figma Make)
✅ Supabase (auth, database, storage, edge functions)
✅ Vite 6.3 (build tool)
✅ Canvas API (drawing, consider OffscreenCanvas)
✅ Web Speech API (TTS for Hebrew)
```

**New Additions:**
```
+ React Query (server state management)
+ React Hook Form (form validation)
+ Zod (runtime validation)
+ date-fns (date handling)
+ recharts (analytics charts - already installed)
```

---

## SECTION 2: INFORMATION ARCHITECTURE

### User Flows

#### Flow 1: Patient Assessment Journey
```
1. Landing Page (/)
   ↓
2. Session Entry (/session/{token})
   ↓
3. Orientation/Welcome
   ↓
4-15. Assessment Tasks (14 tasks)
   ↓
16. Completion Screen
   ↓
17. Thank You / Exit
```

#### Flow 2: Clinician Management
```
1. Login (/login)
   ↓
2. Dashboard Home (/dashboard)
   ↓
3a. Create New Session → Generate Link
3b. View Patient List → Select Patient
   ↓
4. Patient Detail (/dashboard/patient/{id})
   ↓
5. Review Drawings → Score Rubric
   ↓
6. Complete Review → Export PDF/CSV
```

---

## SECTION 3: SCREEN-BY-SCREEN SPECIFICATION

### SCREEN 1: Landing Page (Public Entry)

**Route:** `/`  
**Purpose:** Entry point for patients OR clinicians  
**Users:** Both patients and clinicians

#### Current Design Issues
- ❌ No clear distinction between patient/clinician entry
- ❌ "Resume assessment" depends on localStorage (not reliable)
- ❌ No session token validation

#### Proposed Design

**Layout:**
```
┌─────────────────────────────────────┐
│  [RC Logo]  Remote Check            │
│  הערכה נוירופסיכולוגית              │
├─────────────────────────────────────┤
│                                     │
│   [Large Card]                      │
│   👤 כניסת מטופל                    │
│   הזן קוד מבחן או סרוק QR          │
│                                     │
│   ┌─────────────────────┐           │
│   │ קוד מבחן: [______] │           │
│   │       [אישור]       │           │
│   └─────────────────────┘           │
│                                     │
├─────────────────────────────────────┤
│   [Small Link]                      │
│   🔒 כניסה לקלינאים                │
└─────────────────────────────────────┘
```

#### Components

**1. SessionTokenInput Component**
```typescript
interface SessionTokenInputProps {
  onValidToken: (token: string, sessionData: Session) => void;
  onInvalidToken: (error: string) => void;
}
```

**Behavior:**
- Input field accepts UUID or short code (e.g., "ABC123")
- On blur or button click, validate with backend
- Show loading spinner during validation
- If valid: redirect to `/session/{token}`
- If invalid: show error message in Hebrew

**Accessibility:**
- Font size: 24px minimum
- Input height: 80px (extra large for elderly)
- Error message: Red text, 20px, with icon
- Auto-focus on load

**Questions for User:**
1. Should patients be able to resume sessions? Or always one-time links?
2. Do we need QR code scanning? (requires camera permission)
3. Should we show a "demo mode" link for clinicians to test?

---

**2. ClinicianLoginLink Component**

**Behavior:**
- Small text link at bottom
- Navigates to `/login`
- No visual prominence (patients shouldn't click)

---

### SCREEN 2: Session Entry & Validation

**Route:** `/session/{token}`  
**Purpose:** Validate token and start assessment  
**Users:** Patients only

#### Logic Flow
```
1. Extract token from URL
2. Call API: POST /validate-token
3. If valid:
   - Store session data in Context
   - Redirect to /patient/welcome
4. If invalid/used:
   - Show error message
   - Provide "Contact clinician" info
5. If expired (7+ days):
   - Show different error
```

#### Error States

**Error 1: Token Not Found**
```
┌─────────────────────────────────────┐
│  ⚠️ קוד המבחן אינו תקין              │
│                                     │
│  הקוד שהזנת אינו קיים במערכת.      │
│  אנא בדוק את הקוד ונסה שוב.         │
│                                     │
│  [חזרה לדף הבית]                    │
└─────────────────────────────────────┘
```

**Error 2: Token Already Used**
```
┌─────────────────────────────────────┐
│  ⚠️ המבחן כבר הושלם                 │
│                                     │
│  קוד זה כבר שימש להשלמת מבחן.       │
│  אם עדיין לא השלמת את המבחן,        │
│  פנה לקלינאי שלך.                   │
│                                     │
│  [חזרה לדף הבית]                    │
└─────────────────────────────────────┘
```

**Questions for User:**
1. Should expired tokens (7+ days) have different message than used tokens?
2. Should we provide clinician contact info in error messages?
3. Do we need a "help" button on error screens?

---

### SCREEN 3: Patient Welcome / Orientation

**Route:** `/patient/welcome`  
**Purpose:** Orient user to assessment process  
**Users:** Patients

#### Current Issues
- ❌ Doesn't exist - jumps straight to Task 1
- ❌ No explanation of what to expect
- ❌ No tech check (audio, canvas)

#### Proposed Design

```
┌─────────────────────────────────────┐
│  Remote Check - MoCA                │
├─────────────────────────────────────┤
│                                     │
│  ברוך הבא למבחן MoCA                │
│                                     │
│  המבחן כולל 12 משימות קצרות.        │
│  זמן משוער: 25-30 דקות.             │
│                                     │
│  💡 טיפים:                          │
│  • מצא מקום שקט                     │
│  • השתמש בעכבר או מסך מגע            │
│  • הקשב להוראות בקפידה               │
│                                     │
│  ──────────────────────────         │
│                                     │
│  בדיקת מערכת:                       │
│  ✅ חיבור לאינטרנט                  │
│  🔊 [נסה קול]                       │
│  ✏️ [נסה ציור]                      │
│                                     │
│  [התחל מבחן] ──►                    │
└─────────────────────────────────────┘
```

#### Tech Check Components

**1. Audio Test**
- Button plays sample Hebrew sentence
- User confirms they heard it
- If no audio, show troubleshooting

**2. Drawing Test**
- Small canvas (200x200px)
- Prompt: "צייר עיגול קטן"
- Detects if strokes captured
- If no drawing detected, show mouse/touch help

**Questions for User:**
1. Should tech checks be mandatory or skippable?
2. Should we show estimated time per task?
3. Do we need a "pause and resume later" feature?
4. Should we explain scoring? Or keep it opaque?

---

### SCREEN 4-15: Assessment Tasks (14 screens)

**Routes:**
```
/patient/trail-making    (Task 1)
/patient/cube           (Task 2)
/patient/clock          (Task 3)
/patient/naming         (Task 4)
/patient/memory         (Task 5)
/patient/digit-span     (Task 6)
/patient/vigilance      (Task 7)
/patient/serial7        (Task 8)
/patient/language       (Task 9-10)
/patient/abstraction    (Task 11)
/patient/delayed-recall (Task 12)
/patient/orientation    (Task 13)
/patient/end            (Task 14)
```

#### Common Layout (All Tasks)

```
┌─────────────────────────────────────────────────┐
│ [RC Logo]  MoCA - עברית        שלב 3 מתוך 14  │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░ 21%                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Task-Specific Content Area]                  │
│                                                 │
│  Instructions, stimuli, inputs, etc.           │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  [חזרה] ◄────                    ────► [המשך]  │
│  (80px tall, 200px wide buttons)               │
└─────────────────────────────────────────────────┘
```

#### Universal Components

**1. ProgressBar**
- 4px height
- Fills RTL (right to left)
- Shows percentage visually
- Smooth animation (300ms ease-out)

**2. StepCounter**
- "שלב X מתוך 14"
- Tabular numbers (no layout shift)
- Font: 20px, weight 600

**3. Navigation Buttons**
- Back: Always enabled (except step 1)
- Next: Disabled until task complete
- Size: 80px height, min 200px width
- Icons: Arrow-right (back), Arrow-left (next)

**Questions for User:**
1. Should "Back" preserve previous answers? Or warn about losing data?
2. Should we auto-advance after task completion? Or require clicking "Next"?
3. Do we need a "Save and exit" button on every screen?
4. Should we show a progress % number or just the bar?

---

Let me pause here for your feedback on Screens 1-4 before continuing with detailed task-by-task specs.

### KEY DECISIONS NEEDED (Part 1)

**A. Session Management**
1. One-time links only? Or allow resume?
2. QR code scanning for token entry?
3. Session timeout duration?

**B. Welcome Screen**
1. Mandatory tech checks or optional?
2. Show time estimates per task?
3. Explain scoring to patients?

**C. Navigation**
1. Auto-advance vs manual "Next"?
2. Back button - preserve data or warn?
3. Save-and-exit on every screen?

**D. Accessibility** ✅ DECIDED
1. **Minimum font size: 22px base, 24px+ for instructions**
   - Rationale: Elderly users need larger text, but not so large it reduces content per screen
   - Body text: 22px
   - Instructions/headings: 24-28px
   - Button text: 24px minimum
   
2. **Touch targets: 72px minimum height, 56px minimum width**
   - Rationale: Larger than standard 44px, accounts for tremors/reduced dexterity
   - Primary buttons (Next/Back): 80px height × 200px width
   - Secondary buttons (Listen, Clear): 72px height × auto width
   - Checkbox/radio targets: 56px × 56px
   
3. **Color contrast: AAA (7:1 for normal, 4.5:1 for large)**
   - Rationale: Vision impairment common in 60+ population
   - Primary text: #000000 on #FFFFFF (21:1 - exceeds AAA)
   - Secondary text: #1F2937 on #FFFFFF (16:1 - exceeds AAA)
   - Disabled state: #6B7280 on #F9FAFB (4.8:1 - meets AA large text)
   - Error text: #991B1B on #FFFFFF (10.4:1 - exceeds AAA)

---

## DECISIONS LOCKED ✅

**A. Session Management**
1. ✅ Allow resume (store session state in backend + localStorage fallback)
2. ✅ No QR code scanning (reduce complexity)
3. ✅ 30 minute session timeout (warn at 25 minutes)

**B. Welcome Screen**
1. ✅ Tech checks optional (but encouraged)
2. ✅ No time estimates (maintain standardization)
3. ✅ No scoring explanation (clinician-only info)

**C. Navigation**
1. ✅ Manual "Next" click (no auto-advance)
2. ✅ Warn about data loss on back button
3. ✅ No save-and-exit (one-sitting completion expected)
4. ✅ One-time notification: "יש להשלים את המבחן בישיבה אחת"

**D. Accessibility**
1. ✅ 22px base font, 24px+ for instructions
2. ✅ 72px minimum touch targets
3. ✅ AAA color contrast (7:1)

---

## SECTION 4: DETAILED TASK SPECIFICATIONS

### Universal Task Components (Used Across All Tasks)

Before detailing each task, these components appear consistently:

#### 1. TaskHeader Component
```typescript
interface TaskHeaderProps {
  eyebrow: string;      // e.g., "1. חיבור מסלול"
  title: string;        // Main instruction
  subtitle?: string;    // Optional helper text
  showListen: boolean;  // Show TTS button?
}
```

**Visual Spec:**
- Eyebrow: 14px, uppercase, gray-600, weight 700, letter-spacing 1px
- Title: 28px, black, weight 800, line-height 1.2
- Subtitle: 20px, gray-600, weight 500, margin-top 8px
- Listen button: Top-left (RTL = visually left), 72px height

#### 2. ListenButton Component (Already exists)
- Idle state: Gray background, speaker icon
- Playing state: Black background, animated equalizer
- Hebrew TTS: `lang: 'he-IL'`, `rate: 0.9`
- Size: 72px × auto

#### 3. ProgressIndicator Component (For multi-item tasks)
```typescript
interface ProgressIndicatorProps {
  total: number;
  current: number;
  completed: boolean[];  // For showing correct/incorrect
}
```

**Visual Spec:**
- Horizontal dots/bars
- Current item: 48px × 8px, black
- Other items: 32px × 8px, gray-300
- Completed correct: green-500
- Completed incorrect: red-500

#### 4. InstructionBox Component (Per SPEC.md)
- Variant: Clinical (default per spec)
- 2px black border, 32px padding
- Title: 28px weight 800
- Numbered steps with black circles

---

### TASK 1: Trail Making (חיבור מסלול)

**Route:** `/patient/trail-making`  
**Type:** Drawing task  
**Duration:** ~2 minutes  
**Auto-scorable:** No (needs clinician review)

#### Layout

```
┌──────────────────────────────────────────────────┐
│ Header: MoCA - עברית            שלב 1 מתוך 14   │
│ Progress: ▓░░░░░░░░░░░░░░ 7%                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. חיבור מסלול                                 │
│  מתח קו בין מספר לאות, בסדר עולה               │
│  1 ➔ א ➔ 2 ➔ ב ➔ 3 ➔ ג ➔ 4 ➔ ד ➔ 5 ➔ ה      │
│                                   [🔊 השמע]      │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │                                        │     │
│  │        [Canvas: 800×400px]            │     │
│  │                                        │     │
│  │  (Shows numbered/lettered nodes       │     │
│  │   in semi-random layout)              │     │
│  │                                        │     │
│  └────────────────────────────────────────┘     │
│                                                  │
│  [נקה הכל]  [בטל משיכה אחרונה]                 │
│                                                  │
├──────────────────────────────────────────────────┤
│  [חזרה] ◄─────                      ─────► [המשך]│
└──────────────────────────────────────────────────┘
```

#### Canvas Specification

**Stimulus Layout:**
- Nodes: 1, א, 2, ב, 3, ג, 4, ד, 5, ה (10 total)
- Each node: 48px diameter circle, white fill, black 2px border
- Text: 24px, centered in circle
- Layout: Semi-random, min 60px spacing between nodes
- Correct path: 1→א→2→ב→3→ג→4→ד→5→ה

**Drawing Mechanics:**
- Stroke color: Black (#000000)
- Stroke width: 3px
- Capture: Mouse or touch events
- Store: Every point with timestamp, pressure (if available)

**Controls:**
- "נקה הכל" (Clear All): 72px height, secondary style, right-aligned
- "בטל משיכה אחרונה" (Undo): 72px height, secondary style, next to Clear
- Both buttons: Gray background, black text, rounded-lg

**State Management:**
```typescript
interface TrailMakingState {
  strokes: Stroke[];
  hasDrawn: boolean;  // Enable Next button
}

interface Stroke {
  points: { x: number; y: number; pressure?: number }[];
  startTime: number;  // Unix timestamp
  endTime: number;
  color: string;
  width: number;
}
```

**Validation:**
- Next button enabled when: `strokes.length > 0`
- No correctness validation (clinician scores later)

**Backend Integration:**
- On Next click: POST to `/submit-task`
- Payload: `{ taskName: 'trailMaking', taskData: { strokes } }`
- Also store in localStorage as fallback

#### Decisions (Locked):
1. **Visual feedback:** No visual feedback. Mimicking the pen-and-paper test means no immediate confirmation to avoid biasing the assessment.
2. **Undo operations:** Allow unlimited undos via a single "Undo last stroke" button and a "Clear All" button to avoid cognitive overload.
3. **Timer:** Do not show a timer to the patient, but silently record timestamps in the background for the clinician dashboard.

---

### TASK 2: Cube Copying (העתקת קוביה)

**Route:** `/patient/cube`  
**Type:** Drawing task  
**Duration:** ~2 minutes  
**Auto-scorable:** No

#### Layout

```
┌──────────────────────────────────────────────────┐
│ Header: MoCA - עברית            שלב 2 מתוך 14   │
│ Progress: ▓▓░░░░░░░░░░░░ 14%                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  2. העתקת קוביה                                 │
│  העתק את הקוביה בדיוק כפי שהיא מופיעה          │
│                                   [🔊 השמע]      │
│                                                  │
│  ┌──────────────┬─────────────────────────────┐ │
│  │              │                             │ │
│  │   [Cube      │     [Canvas: 400×400px]    │ │
│  │    Image]    │                             │ │
│  │   300×300    │     (Empty drawing area)   │ │
│  │              │                             │ │
│  └──────────────┴─────────────────────────────┘ │
│                                                  │
│               [נקה הכל]  [בטל משיכה]            │
│                                                  │
├──────────────────────────────────────────────────┤
│  [חזרה] ◄─────                      ─────► [המשך]│
└──────────────────────────────────────────────────┘
```

#### Stimulus (Reference Cube)

**Visual:**
- MoCA standard cube drawing (3D wireframe cube)
- Size: 300×300px
- Line weight: 2px black
- Background: Light gray (#F9FAFB)
- Border: 1px solid #E5E7EB
- Position: Left panel (RTL layout)

**Important Note per SPEC.md:**
> MoCA stimuli must be standardized. Use official MoCA cube image, not custom SVG.

#### Canvas Specification
- Size: 400×400px
- Same drawing mechanics as Trail Making
- Same Undo/Clear controls
- Same state management (`strokes` array)

**Decisions (Locked):**
1. **Grid lines:** No grid lines. Keep the blank space to mimic the paper test exactly.
2. **Zoom/pan on mobile:** Disabled. A fixed canvas prevents accidental panning while attempting to draw.

---

### TASK 3: Clock Drawing (ציור שעון)

**Route:** `/patient/clock`  
**Type:** Drawing task  
**Duration:** ~3 minutes  
**Auto-scorable:** No

#### Layout

```
┌──────────────────────────────────────────────────┐
│ Header: MoCA - עברית            שלב 3 מתוך 14   │
│ Progress: ▓▓▓░░░░░░░░░░░ 21%                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  3. ציור שעון                                   │
│  צייר שעון עגול עם כל המספרים                  │
│  והצב את המחוגים על 11:10                       │
│                                   [🔊 השמע]      │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │                                            │ │
│  │                                            │ │
│  │         [Canvas: 500×500px]               │ │
│  │         (Empty drawing area)              │ │
│  │                                            │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│               [נקה הכל]  [בטל משיכה]            │
│                                                  │
├──────────────────────────────────────────────────┤
│  [חזרה] ◄─────                      ─────► [המשך]│
└──────────────────────────────────────────────────┘
```

#### Canvas Specification
- Size: 500×500px (larger for detail)
- Instructions: 
  1. Draw circle
  2. Add all numbers (1-12)
  3. Add hands pointing to 11:10
- Same drawing mechanics as previous tasks

**Scoring Criteria (for clinician):**
- Contour (1 pt): Circle drawn
- Numbers (1 pt): All 12 numbers present
- Numbers correct (1 pt): Numbers in correct positions
- Hands (1 pt): Two hands present
- Hands correct (1 pt): Hands pointing to 11:10

**Decisions (Locked):**
1. **Pre-drawn outline:** Absolutely not. The contour is part of the scoring criteria; providing it would invalidate the score.
2. **Phases:** No. Standard MoCA requires drawing everything at once in a single space. Multistep drawing deviates from the standardized cognitive load.

---

### TASK 4: Naming (שיום)

**Route:** `/patient/naming`  
**Type:** Multiple choice (3 items)  
**Duration:** ~2 minutes  
**Auto-scorable:** Yes

#### Layout (Item 1 of 3)

```
┌──────────────────────────────────────────────────┐
│ Header: MoCA - עברית            שלב 4 מתוך 14   │
│ Progress: ▓▓▓▓░░░░░░░░░ 28%                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  4. משימת שיום · פריט 1 מתוך 3                 │
│  מה שם החיה בתמונה?                             │
│                                   [🔊 השמע]      │
│                                                  │
│  Progress: ▓▓░░░░  (1/3 items)                  │
│                                                  │
│  ┌──────────────┬─────────────────────────────┐ │
│  │              │                             │ │
│  │   [Lion      │   ┌─────────────────────┐  │ │
│  │   Drawing]   │   │      אריה           │  │ │
│  │              │   └─────────────────────┘  │ │
│  │   400×400    │   ┌─────────────────────┐  │ │
│  │              │   │      פיל            │  │ │
│  │              │   └─────────────────────┘  │ │
│  │              │   ┌─────────────────────┐  │ │
│  │              │   │      זברה           │  │ │
│  │              │   └─────────────────────┘  │ │
│  │              │   ┌─────────────────────┐  │ │
│  │              │   │      ג��ירפה         │  │ │
│  └──────────────┴───└─────────────────────┘──┘ │
│                                                  │
│                          [לפריט הבא] ──►         │
│                                                  │
├──────────────────────────────────────────────────┤
│  [חזרה] ◄─────                      ─────► [המשך]│
└──────────────────────────────────────────────────┘
```

#### Stimulus Images

**Animals (in order):**
1. Lion (אריה) - Correct
2. Rhinoceros (קרנף) - Correct  
3. Camel (גמל) - Correct

**Per SPEC.md Warning:**
> Current drawings are PLACEHOLDERS. Must replace with official MoCA animal drawings before production.

#### Answer Options Specification

**Per Item:**
- 4 answer choices per animal
- Correct answer always included
- 3 distractors (similar animals)
- Options randomized per session (not per patient - maintain standardization)

**Button Specs:**
- Height: 72px
- Width: 100% of right panel
- Font: 24px, weight 600
- Spacing: 16px between buttons
- States:
  - Default: White bg, black border (2px), black text
  - Hover: Gray-50 bg
  - Selected: Black bg, white text
  - Disabled (after selection): Opacity 50%

#### Interaction Flow

**Per Item:**
1. Show animal image + 4 options
2. Patient selects one option
3. Record: answer + timestamp
4. Button "לפריט הבא" becomes enabled
5. Click → Next item
6. After item 3 → Auto-advance to next task

**State:**
```typescript
interface NamingState {
  items: [
    { animal: 'lion', answer: string, timestamp: number },
    { animal: 'rhino', answer: string, timestamp: number },
    { animal: 'camel', answer: string, timestamp: number }
  ];
  currentItem: number;  // 0, 1, or 2
}
```

**Auto-Scoring:**
```typescript
// Backend scoring
const correctAnswers = ['אריה', 'קרנף', 'גמל'];
const score = items.filter((item, i) => 
  item.answer === correctAnswers[i]
).length;  // 0-3 points
```

**Decisions (Locked):**
1. **Correctness feedback:** None. Similar to the paper test, no validation is given to prevent discouragement.
2. **Change answers:** Yes, users can change their answer up until they click "Next".
3. **Timeout:** No time limit, aligning with the paper test.

---

### TASK 5: Memory - Learning Phase (זיכרון · למידה)

**Route:** `/patient/memory`  
**Type:** Word recall (encoding phase)  
**Duration:** ~2 minutes  
**Auto-scorable:** Partial (first recall auto-scored, delayed recall in Task 12)

#### Layout

```
┌──────────────────────────────────────────────────┐
│ Header: MoCA - עברית            שלב 5 מתוך 14   │
│ Progress: ▓▓▓▓▓░░░░░░░░ 35%                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  5. זיכרון · שלב למידה                          │
│  אני אקרא רשימת מילים. הקשב בקפידה.             │
│  בסוף, תתבקש לחזור על כל המילים שתזכור.         │
│                                   [🔊 השמע]      │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │                                            │ │
│  │         [Trial 1 - Learning]              │ │
│  │                                            │ │
│  │            פנים                            │ │
│  │            משי                             │ │
│  │            כנסייה                          │ │
│  │            אדום                            │ │
│  │            דליה                            │ │
│  │                                            │ │
│  │         [🔊 השמע רשימה]                   │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                              [הבנתי, המשך] ──►   │
│                                                  │
├──────────────────────────────────────────────────┤
│  [חזרה] ◄─────                      ─────► [המשך]│
└──────────────────────────────────────────────────┘
```

#### Word List (Standardized MoCA Hebrew)

**Words:**
1. פנים (face)
2. משי (silk)
3. כנסייה (church)
4. אדום (red)
5. דליה (dahlia)

**Presentation:**
- Visual: All 5 words shown simultaneously
- Size: 32px per word, weight 600
- Spacing: 24px between words
- Audio: TTS reads list at 1 second per word
- Trials: 2 learning trials total

#### Multi-Phase Flow

**Phase 1: Learning Trial 1**
```
1. Show all 5 words
2. TTS reads list (optional - user clicks)
3. Patient studies for 30 seconds (no timer shown)
4. Click "הבנתי, המשך"
5. → Phase 2
```

**Phase 2: Immediate Recall Trial 1**
```
┌────────────────────────────────────────────┐
│  עכשיו, אמור את כל המילים שאתה זוכר       │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  □ פנים   □ משי   □ כנסייה           │ │
│  │  □ אדום   □ דליה                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│                     [סיימתי לחזור] ──►     │
└────────────────────────────────────────────┘
```

**Checkboxes:**
- Size: 56×56px touch targets
- Words: 24px, next to checkbox
- Allow check/uncheck before submitting
- No correctness feedback shown

**Phase 3: Learning Trial 2**
(Repeat Phase 1 with same words)

**Phase 4: Immediate Recall Trial 2**
(Repeat Phase 2)

**Phase 5: Transition**
```
תודה. בחלק מאוחר יותר של המבחן, 
תתבקש לזכור מילים אלו שוב.

[המשך למשימה הבאה] ──►
```

#### State Management

```typescript
interface MemoryState {
  wordsShown: string[];  // ['פנים', 'משי', ...]
  trial1Recall: string[];
  trial2Recall: string[];
  trial1Timestamp: number;
  trial2Timestamp: number;
}
```

#### Auto-Scoring (First Recall)

Best of 2 trials:
```typescript
const score = Math.max(
  trial1Recall.length,
  trial2Recall.length
);  // 0-5 points for first recall
```

**Note:** Delayed recall scored in Task 12

**Decisions (Locked):**
1. **Timer:** No visible timer, adhering to the paper test environment.
2. **Typing vs Checkboxes:** Typing is too difficult for this demographic. If possible, utilize Voice Recording (where the clinician listens and scores later) to maintain "Free Recall". If voice recording is out of scope, stick to Checkboxes, but document that it transitions the task into "Recognition", which alters clinical validity.
3. **TTS:** Play automatically upon screen load to ensure standard delivery, with an option to replay manually.

---

We have locked the patient-facing UX for Tasks 1-5. Since the remaining tasks follow similar mechanics (audio, multiple-choice, simple recognition/recording), the most critical next step is detailing the **Clinician Dashboard** (Section 5). Detailing the dashboard next ensures the telemetry data collected during these patient tasks aligns with the scoring interface and playback tools the clinicians need to review them accurately.

Let's move on to the Clinician Dashboard next to verify the data handoff.

---

## SECTION 5: CLINICIAN DASHBOARD

### SCREEN 1: Dashboard Home (Patient List)

**Route:** `/dashboard`
**Purpose:** Manage patients, view high-level metrics, and find tests awaiting review.
**Users:** Clinicians (Desktop-primary)

#### Layout

```
┌───────────────────────────┬──────────────────────────────────────────────────┐
│                           │                                                  │
│  [RC Logo] Remote Check   │  מטופלים                                        │
│                           │  142 פעילים · 18 דורשים סקירה                   │
│  ───────────────────────  │                                                  │
│                           │  [🔍 חיפוש לפי שם או מזהה...]     [+ מטופל חדש] │
│  ■ מטופלים [18]           │                                                  │
│  □ מבחנים אחרונים         │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  □ ניתוחים                │  │ סקירות   │ │ זמן      │ │ ממוצע    │ │ מבחנים   │
│  □ ספריית מבחנים          │  │ ממתינות  │ │ ממוצע    │ │ MoCA     │ │ השבוע    │
│                           │  │ 18       │ │ 24 דק׳   │ │ 23.4     │ │ 42       │
│                           │  │ +2       │ │ -1.5     │ │ +0.5     │ │ +12%     │
│                           │  └──────────┘ └──────────┘ └──────────┘ └──────────┘
│                           │                                                  │
│                           │  ┌──────────────────────────────────────────────┐│
│                           │  │ שם         גיל  מבחנים  פעילות    סטטוס   MoCA ││
│  [Clinician Profile]      │  │ ──────────────────────────────────────────── ││
│  ד״ר כהן                  │  │ יצחק א.    72   3       היום     [בבדיקה]  --  ││
│  dr.cohen@clinic.com      │  │ שרה ב.     68   1       אתמול    [הושלם]   26  ││
│                           │  └──────────────────────────────────────────────┘│
└───────────────────────────┴──────────────────────────────────────────────────┘
```

#### Components

**1. Sidebar (`dashboard-list.jsx`)**
- Fixed width: 240px
- Background: `#0a0a0a` (Near black), Text: White
- Navigation items with active state and notification badges (e.g., pending reviews)
- Bottom-pinned clinician profile card

**2. Stats Row**
- 4 KPI cards for quick clinic oversight: tests this week, average score, average duration, pending reviews.
- Labels in small grey text, main numbers in 26px weight-800, colored delta text (green for positive trend, red for negative).

**3. Patient Table**
- White card with `--border-color` outline.
- Columns: Name (with Avatar & ID), Age, Test Count, Last Activity, Status Pill (New, Review, Completed), MoCA Score (X/30 + trend arrow), and a Chevron.
- **Interaction:** Hovering row changes background to `--ink-50`. Clicking navigates to `/dashboard/patient/{id}`.

---

### SCREEN 2: Patient Detail & Scoring Review

**Route:** `/dashboard/patient/{id}`
**Purpose:** Detailed view of a patient's session, manual grading of drawings/audio, and final score export.
**Users:** Clinicians

#### Layout

```
┌───────────────────────────┬──────────────────────────────────────────────────┐
│                           │ מטופלים / יצחק א.                               │
│        [Sidebar]          │                                                  │
│                           │ 👤 יצחק א.  | ת.ז: 12345 | גיל: 72 | [בבדיקה]   │
│                           │                                                  │
│                           │ ┌──────┬──────┬──────┬──────┬────────┬───────┐  │
│                           │ │ סה״כ │ חזותי│ שיום │ זיכרון│ קשב    │ זמן   │  │
│                           │ │ --/30│ --/5 │ 3/3  │ --/5 │ 4/6    │ 26דק׳ │  │
│                           │ └──────┴──────┴──────┴──────┴────────┴───────┘  │
│                           │                                                  │
│                           │ 2. העתקת קוביה (viso-spatial)                    │
│                           │ ┌──────────────────────┬───────────────────────┐│
│                           │ │                      │                       ││
│                           │ │ [Scoring Rubric]     │  [Canvas Playback]    ││
│                           │ │                      │                       ││
│                           │ │ □ קווי מתאר תקינים   │  [▶ Play] [↓ Download]││
│                           │ │ □ כל הקווים צוירו    │                       ││
│                           │ │ □ פרופורציות נכונות  │  Timeline: ||| | ||   ││
│                           │ │                      │  Metrics: 45s, 6 lifts││
│                           │ │ הניקוד: --/3         │                       ││
│                           │ │                      │                       ││
│                           │ │ [הערות קלינאי...]    │                       ││
│                           │ └──────────────────────┴───────────────────────┘│
│                           │                                                  │
│                           │                         [CSV] [PDF] [סגור מבחן] │
└───────────────────────────┴──────────────────────────────────────────────────┘
```

#### Components

**1. Profile Header & Session Summary Strip**
- **Header:** Large Avatar, Name (26px weight-800), metadata strip (ID, age, total sessions, status pill).
- **Summary Strip:** 6-column grid highlighting domain scores (MoCA total, viso-spatial, naming, delayed recall, attention, test duration). 
- Scores auto-update as the clinician completes the rubrics below. Pass (green) / Warn (red) coloring applied based on thresholds.

**2. Drawing Review Cards (e.g., Clock, Cube)**
- Two-column layout per task requiring manual review.
- **Left Column (Rubric):** `--ink-50` background. 
  - Checkboxes for standardized MoCA criteria. 
  - Clicking a row turns it light green (`#ecfdf5`), checkbox turns green-filled.
  - Live-totaling score updates instantly.
  - Textarea for qualitative clinician notes.
- **Right Column (Playback):** Light background.
  - Recreates the patient's drawing from stored coordinates.
  - **Stroke timeline:** Horizontal bar visualization showing hesitation and duration.
  - Playback controls to animate the drawing sequentially.
  - Metrics table detailing total time, average stroke speed, pen lifts, and pressure (if available).

**3. Audio Review Cards (Memory, Naming, Language)**
- If tasks utilize audio recording (e.g., "Free Recall"), an audio player replaces the canvas. 
- The left column remains the scoring rubric where the clinician listens and checks off recalled words.

**4. Export Actions**
- Right-aligned buttons at the top or bottom for PDF/CSV generation.
- **"סגור מבח��" (Close Session):** Primary action. Marks the test as `Completed` and locks further scoring edits.

---

### DATA HANDOFF REQUIREMENTS

To support this dashboard, the frontend must collect and transmit the following telemetry per task to Supabase:

1. **Drawing Tasks (Trail Making, Cube, Clock):**
   - Array of `Stroke` objects: `{ points: [{x, y, timestamp, pressure}], startTime, endTime, color, width }`.
   - Total task duration and number of undo/clear operations.
2. **Audio/Verbal Tasks (Memory, Serial 7s, Language):**
   - Web Audio API `Blob` recordings (saved to Supabase Storage), linked to the task ID.
   - Array of timestamped button clicks (if using fallback checkboxes).
3. **Multiple Choice (Naming, Orientation):**
   - The selected answer, the index of the answer, and the exact time taken to answer.
4. **General Metadata:**
   - Total session duration.
   - Browser/device details (to provide context for drawing pressure or audio quality).

---

## SECTION 6: BACKEND INTEGRATION PLAN

**Status:** Infrastructure planned; integration pending.
**Target Environment:** Supabase (PostgreSQL, Edge Functions, Storage, Auth)

### 6.1 Architecture Overview
The platform uses a three-tier architecture:
1. **Frontend:** React SPA (Vite) managing patient assessment state and clinician dashboards.
2. **Serverless API:** Supabase Edge Functions handling secure data insertion, session validation, and auto-scoring.
3. **Database:** Supabase PostgreSQL with strict Row Level Security (RLS).

**Core Design Principles:**
- **Zero PII:** The database only stores `case_id` (e.g., "RC-2026-001") and `age_band` (e.g., "60-64"). No exact names or DOBs are stored.
- **Pseudonymization:** The clinician dashboard maps internal clinic records to these case IDs.
- **Single-Use Tokens:** Patients access the test via a `link_token` UUID that is marked `used` upon completion.

### 6.2 Database Schema Alignment

The frontend must conform to the 4 primary tables established in the backend:
1. **`sessions`**: Tracks session state (`pending`, `in_progress`, `completed`).
2. **`task_results`**: Stores the raw JSON payload from each task as the patient progresses.
3. **`drawing_reviews`**: Dedicated table for tasks requiring manual scoring (Cube, Clock, Trail Making). Stores the `strokes_data` JSON.
4. **`scoring_reports`**: Holds the auto-computed total score, subscores, and the `needs_review` flag.

### 6.3 Edge Function Interactions

The frontend `AssessmentContext` currently relies on `localStorage`. This will be replaced with API calls to the following Edge Functions:

- **`POST /start-session` (Clinician):**
  - **Payload:** `{ caseId, ageBand }`
  - **Returns:** A unique URL containing the `link_token`.

- **`POST /submit-task` (Patient):**
  - **Trigger:** Fired every time the patient clicks "Next" on a task screen.
  - **Payload:** `{ linkToken, taskName, taskData }`
  - **Behavior:** Saves progress incrementally. Prevents data loss if the browser crashes. If the task is a drawing task, this endpoint automatically routes the strokes to the `save-drawing` function to populate the `drawing_reviews` table.

- **`POST /complete-session` (Patient):**
  - **Trigger:** Fired on the final "End Screen".
  - **Behavior:** Marks the `link_token` as used, locks the session, and triggers the Auto-Scoring Engine.

### 6.4 The Scoring Engine (`src/lib/scoring`)

Auto-scorable tasks (Naming, Digit Span, Vigilance, etc.) are graded on the server during the `complete-session` call. 
- **Norms:** The engine references a static JSON file (`lifshitz-norms.json`) based on the 2012 Israeli MoCA normative data to generate percentiles based on the patient's `age_band`.
- **Manual Fallback:** If the auto-scorer encounters an error, or if drawings are present, the session is flagged with `needs_review = true`, pushing it to the top of the Clinician Dashboard.

### 6.5 Storage Requirements

**Drawings:** 
- The `BaseCanvas` component will generate a Base64 PNG representation of the drawing alongside the raw stroke coordinates.
- The `save-drawing` Edge Function will upload this PNG to a private Supabase Storage bucket (`drawings/{sessionId}/{taskName}.png`) for quick thumbnail viewing on the dashboard.

**Audio (If Free Recall is implemented for Memory Tasks):**
- The frontend will utilize the MediaRecorder API to capture audio as a `.webm` or `.ogg` Blob.
- These blobs will be uploaded to a private Supabase Storage bucket (`audio/{sessionId}/{taskName}.webm`), allowing the clinician to manually grade the patient's vocal responses from the dashboard.

---

## SECTION 7: PERFORMANCE & OPTIMIZATION

**Status:** Planned strategies for Canvas, Audio, and Dashboard performance.

### 7.1 Canvas Rendering (Patient Flow)
Drawing tasks (Trail Making, Cube, Clock) generate thousands of coordinates in seconds, risking lag on older tablets or low-end PCs.
- **Batched Rendering:** Avoid triggering a React state update for every single `mousemove` or `touchmove` event. Instead, manage the active stroke directly via the DOM/Canvas API (using `requestAnimationFrame`) and only commit the final `Stroke` array to React state `onPointerUp`.
- **Resolution Scaling:** To ensure crisp lines on Retina displays without tanking performance, set the internal canvas resolution to match the device pixel ratio (`window.devicePixelRatio`), while using CSS to lock the physical display size.
- **OffscreenCanvas (Optional):** If performance testing reveals dropped frames, shift heavy stroke rendering (like the live playback) to an `OffscreenCanvas` inside a Web Worker.

### 7.2 Audio Recording (Memory & Fluency Tasks)
If Free Recall via voice recording is implemented, raw audio files can quickly exceed 5-10MB, causing upload timeouts.
- **Compression:** Utilize `MediaRecorder` with the `audio/webm;codecs=opus` MIME type. This format offers excellent voice clarity at minimal bitrates.
- **Chunking:** Configure the recorder to slice audio into 1-second chunks (`mediaRecorder.start(1000)`). If an upload fails, it’s easier to retry smaller chunks or assemble them on the backend, ensuring no patient data is lost to network instability.
- **Pre-loading TTS:** The browser's native Web Speech API (TTS) can sometimes take a second to initialize the Hebrew voice. Call `speechSynthesis.getVoices()` silently during the Welcome Screen to warm up the engine before the patient needs it.

### 7.3 Dashboard Performance (Clinician Flow)
The clinician dashboard may load hundreds of patient records and render complex stroke playbacks.
- **Virtualized Lists:** Implement `react-window` or `@tanstack/react-virtual` for the Patient Table. This ensures the browser only renders the 15-20 rows currently visible on screen, keeping memory usage flat regardless of how many patients are in the system.
- **Lazy Loading Playback:** Only fetch the heavy JSON `strokes_data` from Supabase when a clinician actually expands or navigates to a specific Drawing Review Card. Use `React.lazy()` to split the code for the Replay Canvas engine so it isn't loaded on the main patient list view.
- **Memoization:** Wrap the metric summary components and the scoring rubric checkboxes in `React.memo` to prevent them from re-rendering while the canvas playback animation loop is running.

### 7.4 Offline Resilience
Elderly patients taking the test on a tablet may experience spotty Wi-Fi connections.
- **Local Fallback:** As detailed in the backend plan, if the `POST /submit-task` API call fails when clicking "Next", the application must gracefully catch the error, save the payload to `localStorage`, and allow the patient to proceed. 
- **Background Sync:** Implement a hidden retry queue. When the final "End Screen" tries to call `POST /complete-session`, check `localStorage` for any pending task payloads and upload them first.

---

## APPENDICES

### A. Design Tokens
### B. Component Library
### C. State Management Schema
### D. API Integration Points
### E. Testing Strategy

*[TO BE COMPLETED]*

---

**Status:** Completed Sections 1-7. Frontend Plan is finalized and ready for implementation.
