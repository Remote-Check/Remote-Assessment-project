# Remote Check — Hebrew MoCA Platform
## Design Handoff Spec for Gemini CLI

> **Reference prototype:** `Remote Check.html` (self-contained HTML, React+JSX).
> **Bundled source:** `components/bundle.jsx` — all components in one file.
> **Split source (easier to read):** `components/*.jsx`
> **Styles & tokens:** `styles.css`

Gemini: read the reference prototype to see the exact visual treatments, then port them into the existing React/TypeScript app. The source JSX uses inline styles for simplicity — feel free to refactor into CSS modules, styled-components, or your existing pattern. **What matters is the visual spec, token values, copy, and interaction behavior defined here.**

---

## 1. Design Tokens

All tokens are declared in `styles.css` under `:root`. **Preserve the four locked tokens from the product spec:**

```css
--bg-color: #ffffff;
--text-color: #000000;
--primary-color: #000000;
--secondary-color: #f3f4f6;
--border-color: #e5e7eb;
--target-size: 64px;       /* minimum touch target */
--font-size-base: 20px;    /* base body size */
```

Extended tokens (neutrals, clinical accents, type scale, spacing, radii, shadows) are in `styles.css`. Copy verbatim.

### Typography
- **Primary font:** Heebo (loaded from Google Fonts, weights 400–900).
- **Fallbacks:** Assistant, Rubik, system-ui.
- **Tweakable per-user** (see Tweaks section): user can swap between Heebo / Assistant / Rubik.
- `font-feature-settings: "kern"` and `text-rendering: optimizeLegibility` on body.

### Accent colors (use sparingly)
```
--accent-focus:   #1d4ed8   (blue — focus rings, links, ink trace)
--accent-success: #047857   (green — correct, completed)
--accent-warning: #b45309   (amber — attention)
--accent-error:   #b91c1c   (red — error, destructive)
```

---

## 2. Global Rules (non-negotiable)

1. **Direction:** `dir="rtl"` on `<html>`; all layouts flow right-to-left.
2. **Contrast:** Never use grey-on-white for primary text. Body = `#000` on `#fff`.
3. **No thin fonts:** Minimum `font-weight: 400`. Headings `600–800`.
4. **Touch targets:** All interactive elements ≥ `var(--target-size)` (64px default, user-adjustable up to 88px).
5. **Focus states:** Every button/input shows `--shadow-focus` (3px blue ring) on `:focus-visible`.
6. **No emoji** unless it's part of patient-shown content.
7. **No decorative icons** — icons must carry meaning (scoring, audio, export).

---

## 3. Components to Build

### 3.1 AssessmentLayout (persistent patient shell)
**File:** `components/shell.jsx` → `AssessmentLayout`

Structure (top → bottom):
- **Header** (white, `1px` bottom border, `20px 40px` padding):
  - Right: `<BrandMark/>` (logo + "Remote Check" wordmark + Hebrew subtitle)
  - Center: test title + subtitle
  - Left: "שלב X מתוך Y" counter (tabular-nums)
- **Progress bar:** `4px` tall, `--ink-100` bg, fills right-to-left with `--primary-color`, animates on change.
- **Main:** `flex: 1`, `48px 40px` padding, `max-width: 1100px` centered content.
- **Footer:** Sticky bottom, `20px 40px` padding, `1px` top border. Two buttons:
  - Right: "חזרה" (secondary, arrow-right icon)
  - Left: "המשך" (primary, arrow-left icon)
  - Both at `btn-lg` size (80px min-height).

### 3.2 Instruction Box — 3 Variants
**File:** `components/instruction-box.jsx`

User can switch via Tweaks. Export all three; let app code pick by config.

**Variant A — "Clinical"** (default, recommended for production)
- 2px black border, `--r-lg` radius, `32px 36px` padding
- Small uppercase eyebrow "הוראות" with a black dot prefix
- Title: 28px, weight 800
- Numbered steps in black filled circles (32×32)
- Example callout with right-border accent rule (4px, black)
- `<ListenButton size="lg">` in the top-left of the card (RTL = visually left)

**Variant B — "Paper"** (warmer feel)
- Off-white gradient bg (`#fdfcf9 → #faf8f3`), soft shadow
- Title: 30px, weight 700
- Steps separated by dashed divider; large serif numerals (Georgia-style, thin)
- Italic example line below

**Variant C — "Focus"** (onboarding-heavy, centered)
- Max-width 820px, centered
- Uppercase eyebrow, 38px weight-800 title
- Steps as numbered circles (outlined, 48×48) aligned right
- First step highlighted with `--secondary-color` bg
- Listen button centered below

### 3.3 ListenButton
**File:** `components/shell.jsx` → `ListenButton`

Pill-shaped (fully rounded), two states:
- **Idle:** `--secondary-color` bg, `--ink-900` text, speaker icon on right.
- **Playing:** Black bg, white text, animated 4-bar equalizer icon.
- Sizes `md` (52px) and `lg` (64px).
- Integrates with TTS — call `speechSynthesis.speak(new SpeechSynthesisUtterance(text))` with `lang: 'he-IL'`, `rate: 0.9`.

### 3.4 Naming Task
**File:** `components/naming-task.jsx`

**Canonical MoCA items (in order): Lion (אריה), Rhinoceros (קרנף), Camel (גמל).**

Layout per item:
- Task header: eyebrow "משימת שיום · פריט X מתוך 3" + H2 "מה שם החיה בתמונה?" + ListenButton
- Progress pips below (3 segments, current = 48×8px, others 32×8px; correct = green)
- **Two-column stimulus card:**
  - Right half: `--bg-color` panel, centered MoCA-style line drawing (~360px)
  - Left half: 4 answer buttons (72px min-height, 24px text, 600 weight)
- Answer selection: selected → black fill; after submission, correct = green tint + check icon, wrong = red tint.

**Drawings:** `components/moca-art.jsx` provides placeholder line art.
> ⚠️ **IMPORTANT:** These are *placeholders modeled on MoCA style*. Standardization is mandatory in cognitive assessment — replace with the officially licensed MoCA animal drawings before deployment. The prototype marks this as a blocker.

### 3.5 BaseCanvas (not in this prototype — referenced for completeness)
Per the product spec: black-on-white drawing surface with Undo + Clear controls. Record per-stroke timing + length + pressure for clinician replay.

### 3.6 Clinician Dashboard
Split into two screens, navigable:

#### 3.6.1 Patient List (`components/dashboard-list.jsx`)
- **Sidebar:** 240px wide, `#0a0a0a` bg, white text, 4 nav items (מטופלים [badge: count], מבחנים אחרונים, ניתוחים, ספריית מבחנים). Bottom: clinician profile card.
- **Main:** `--ink-50` bg, 28px padding.
  - Page header: H1 "מטופלים" + summary ("142 פעילים · 18 דורשים סקירה") + Search input + "+ מטופל חדש" primary button.
  - **Stats row:** 4 KPI cards (weekly tests, avg MoCA score, avg duration, pending reviews). Each card: small grey label, 26px weight-800 number, colored delta text.
  - **Patient table** (white card, `--border-color` outline):
    - Columns: שם (avatar + name + ID), גיל, מבחנים, פעילות אחרונה, סטטוס (pill), ציון MoCA (X/30 + trend arrow), chevron.
    - Row hover: `--ink-50` bg.
    - Click row → patient detail.

#### 3.6.2 Patient Detail (`components/dashboard-detail.jsx`)
- **Breadcrumb:** "מטופלים / [name]"
- **Profile header:** Avatar + name (26px weight-800) + metadata strip (ID, age, sessions, status pill). Right-aligned actions: "PDF", "CSV", "סגור מבחן" (primary).
- **Session summary strip** (6-column grid): MoCA total, viso-spatial, naming, delayed recall, attention, duration. Each with small label + large tabular number. Colors: warn = red, pass = green.
- **Drawing review cards** (one per drawing — Clock, Cube):
  - Two-column layout:
    - **Right column** (light bg): drawing in dashed-border frame, replay + download controls, stroke timeline visualization (vertical bars scaled by duration × length), pressure heatmap (8×8 grid), metrics table (total time, avg stroke, pen lifts, hesitation).
    - **Left column** (`--ink-50` bg): Scoring rubric — checkboxes with criteria and point values, live-totaling score (X/max, 24px weight-800). Clinician comments textarea below.

---

## 4. Interaction Details

### 4.1 Patient flow navigation
- Forward: "המשך" / "לשלב הבא" / "סיים משימה" — disabled until required input complete.
- Back: "חזרה" always enabled except on step 1.
- No back-destructive actions: going back preserves state.

### 4.2 Naming task scoring
- Patient options are shuffled; correct answer always one of them.
- On select: record answer + timestamp. Show correctness inline (green/red). "לפריט הבא" enables.
- After all 3 items: auto-advance or show summary.

### 4.3 Clinician scoring rubric
- Each criterion is a clickable row (entire row is the hitbox, ≥ 40px tall).
- Toggled-on → row turns light green (`#ecfdf5`), checkbox turns green-filled with white check.
- Score header auto-recalculates.
- Save on blur or periodic autosave (clinician never explicitly saves score).

### 4.4 Stroke timeline
- Horizontal bar per stroke; flex-grow = duration; opacity = 0.4 + (length/100)×0.5 (normalized).
- Tooltip on hover: "משיכה N · X.Xs · Ypx".
- Click to scrub replay playback to that stroke's start.

---

## 5. Tweakable Parameters (user-facing settings)

These must be user-adjustable (accessibility critical for age 60+):

| Param | Range | Default | CSS variable |
|---|---|---|---|
| Font family | Heebo / Assistant / Rubik | Heebo | `--font-hebrew` |
| Base font size | 18 – 28 px (step 1) | 20 px | `--font-size-base` |
| Touch target | 56 – 88 px (step 4) | 64 px | `--target-size` |

Expose in a Settings modal; persist to localStorage + (if logged in) server-side user profile.

---

## 6. RTL & Hebrew Typography Notes

- Hebrew numbers: prefer Arabic numerals (1, 2, 3) for scores and progress — more universally legible. Hebrew-word numerals (אחד, שניים) only for stimulus content.
- `font-variant-numeric: tabular-nums` on all score/count displays to prevent layout shift.
- Icons that imply direction (arrows, chevrons) must mirror in RTL. The prototype does this manually (e.g. "Back" uses `ArrowRight`, "Next" uses `ArrowLeft` — visually correct in RTL).
- Punctuation: use Hebrew quotation marks (״) for emphasis; `׳` (geresh) for contractions like ד״ר.

---

## 7. Accessibility Requirements

- **WCAG 2.1 AA minimum**; target AAA for patient screens.
- All buttons have visible `:focus-visible` ring (3px blue, 0.35 opacity).
- `sr-only` class available for screen-reader-only labels.
- All icons that carry meaning have adjacent text or `aria-label`.
- `prefers-reduced-motion`: disable pulse/equalizer animations (TODO — add media query).
- Color alone never conveys meaning (status pills have both color and dot + text).
- Minimum 4.5:1 contrast for body, 3:1 for large text.

---

## 8. File Manifest

```
Remote Check.html               ← self-contained demo (open in browser)
styles.css                      ← design tokens + base styles + button system
components/
  icons.jsx                     ← icon set (stroke-based, currentColor)
  moca-art.jsx                  ← Lion/Rhino/Camel line art (PLACEHOLDERS)
  shell.jsx                     ← BrandMark, BigButton, AssessmentLayout, ListenButton
  instruction-box.jsx           ← 3 instruction-box variants
  naming-task.jsx               ← Naming task interaction
  dashboard-list.jsx            ← Clinician sidebar + patient list
  dashboard-detail.jsx          ← Patient detail + drawing review + scoring
  app.jsx                       ← App shell + navigation + Tweaks panel
  bundle.jsx                    ← All of the above concatenated
```

---

## 9. Known Gaps (for you to fill in)

- [ ] Replace placeholder animal drawings with licensed MoCA assets.
- [ ] Wire TTS (Web Speech API, he-IL) to every `ListenButton`.
- [ ] Build `BaseCanvas` (drawing surface with stroke capture) — spec only, not in prototype.
- [ ] Add `Trail Making` screen (numbers 1-5 + אותיות א-ה) — spec only, not in prototype.
- [ ] Add `OrientationModule` with pulsing cues — spec only, not in prototype.
- [ ] Session replay animation (drawing reconstructed over time).
- [ ] Authentication + clinician role handling.
- [ ] Actual PDF/CSV export pipeline (buttons exist; handlers are stubs).
- [ ] `prefers-reduced-motion` support.
- [ ] High-contrast mode toggle.

---

## 10. Copy Reference (Hebrew strings)

| Key | Hebrew | Context |
|---|---|---|
| `brand.name` | Remote Check | Always English |
| `brand.tagline` | הערכה נוירופסיכולוגית | Under logo |
| `nav.back` | חזרה | Back button |
| `nav.next` | המשך | Continue button |
| `nav.start_task` | התחל משימה | Begin test step |
| `nav.next_item` | לפריט הבא | Next item in task |
| `nav.finish_task` | סיים משימה | Complete task |
| `step.counter` | שלב X מתוך Y | Header progress |
| `instructions.eyebrow` | הוראות | Label |
| `instructions.listen` | השמע הוראות | Listen button idle |
| `instructions.playing` | משמיע… | Listen button playing |
| `instructions.example` | דוגמה / למשל | Example intro |
| `naming.eyebrow` | משימת שיום | Task eyebrow |
| `naming.prompt` | מה שם החיה בתמונה? | Patient-facing prompt |
| `naming.helper` | בחר תשובה, או אמור את השם בקול רם | Above answer options |
| `dash.patients` | מטופלים | Nav |
| `dash.recent_tests` | מבחנים אחרונים | Nav |
| `dash.analytics` | ניתוחים | Nav |
| `dash.library` | ספריית מבחנים | Nav |
| `dash.new_patient` | + מטופל חדש | CTA |
| `dash.search_placeholder` | חיפוש לפי שם או מזהה… | Search |
| `dash.status.new` | חדש | Status pill |
| `dash.status.review` | בבדיקה | Status pill |
| `dash.status.completed` | הושלם | Status pill |
| `dash.scoring.title` | ניקוד | Rubric header |
| `dash.notes.placeholder` | הוסף הערה… | Clinician notes |
| `dash.close_session` | סגור מבחן | Primary action |

---

## 11. How to Use This Handoff

1. Open `Remote Check.html` in a browser — click through all 4 screens via the top nav bar.
2. Toggle Tweaks (top-right of the host preview) to see font/size/target/variant controls.
3. Read `styles.css` for tokens. Copy verbatim into your app.
4. Read each `components/*.jsx` file for the exact JSX structure + inline styles. Port to your styling system.
5. Follow the Known Gaps list to implement what the prototype stubs.

**Questions / ambiguity?** Preserve the prototype as the source of truth for visual decisions. If something in this doc contradicts the prototype, the prototype wins.
