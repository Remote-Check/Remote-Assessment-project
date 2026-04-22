# Design Integration & Naming Task Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the high-fidelity design from Claude Design (SPEC.md, styles.css, components/) into the React/TS app and implement the MoCA Naming Task.

**Architecture:** 
1. **Global Styles:** Replace current `global.css` with the comprehensive system from `styles.css`.
2. **Layout Components:** Refactor `AssessmentLayout` and create new UI primitives (`BigButton`, `ListenButton`, `BrandMark`).
3. **Naming Task:** Build the interactive Naming Task module following the two-column stimulus/response design.
4. **Integration:** Update `BatteryPlayer` to include the Naming Task.

**Tech Stack:** React, TypeScript, Vitest, React Testing Library, Lucide React (for icons mirroring the design).

---

### Task 1: Global Style & Design Token Integration

**Files:**
- Modify: `client/src/styles/global.css`
- Modify: `client/index.html` (Add fonts)

- [ ] **Step 1: Add Hebrew Fonts to index.html**
```html
<!-- client/index.html -->
<!-- Inside <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&family=Assistant:wght@400;600;700;800&family=Rubik:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update global.css with design tokens and base styles**
Copy the content from root `styles.css` (the one provided by Claude Design) into `client/src/styles/global.css`. Ensure the locked spec variables are preserved.

- [ ] **Step 3: Verify build**
Run: `cd client && npm run build`
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add client/index.html client/src/styles/global.css
git commit -m "style: integrate high-fidelity design tokens and hebrew fonts"
```

---

### Task 2: Core UI Primitives (Layout & Buttons)

**Files:**
- Create: `client/src/components/layout/BrandMark.tsx`
- Create: `client/src/components/layout/BigButton.tsx`
- Create: `client/src/components/layout/ListenButton.tsx`
- Modify: `client/src/components/AssessmentLayout.tsx` (Refactor to match shell.jsx)

- [ ] **Step 1: Implement BrandMark**
Port logic from `components/shell.jsx`'s `BrandMark`.

- [ ] **Step 2: Implement BigButton**
Port logic from `components/shell.jsx`'s `BigButton`. Use `lucide-react` icons (ArrowRight for Back, ArrowLeft for Next in RTL).

- [ ] **Step 3: Implement ListenButton**
Port logic from `components/shell.jsx`'s `ListenButton` and `AudioBars`. 
*Note:* TTS (Text-to-Speech) will be a separate integration task, for now, handle the `playing` state locally.

- [ ] **Step 4: Refactor AssessmentLayout**
Update `client/src/components/AssessmentLayout.tsx` to match the structure in `components/shell.jsx` (Header with logo/step-counter, Progress Bar, Main, Footer with BigButtons).

- [ ] **Step 5: Verify via unit tests**
Run: `cd client && npm run test src/components/__tests__/AssessmentLayout.test.tsx`
Expected: Update tests to match new labels/structure if they fail.

- [ ] **Step 6: Commit**
```bash
git add client/src/components/layout/ client/src/components/AssessmentLayout.tsx client/src/components/__tests__/AssessmentLayout.test.tsx
git commit -m "feat: implement high-fidelity layout components and buttons"
```

---

### Task 3: Instruction Box Variants

**Files:**
- Create: `client/src/components/layout/InstructionBox.tsx`

- [ ] **Step 1: Implement InstructionBox with Variant A (Clinical)**
Port logic from `components/instruction-box.jsx`. Implement Variant A as the default.

- [ ] **Step 2: Commit**
```bash
git add client/src/components/layout/InstructionBox.tsx
git commit -m "feat: add clinical instruction box component"
```

---

### Task 4: Naming Task Implementation (TDD)

**Files:**
- Create: `client/src/components/tasks/NamingTask.tsx`
- Test: `client/src/components/tasks/__tests__/NamingTask.test.tsx`
- Create: `client/src/assets/drawings/MocaArt.tsx` (Port placeholders)

- [ ] **Step 1: Port Placeholder Art**
Create `client/src/assets/drawings/MocaArt.tsx` based on `components/moca-art.jsx`.

- [ ] **Step 2: Write failing test for NamingTask**
Verify it renders the animal image and 4 answer options. Test that selecting an answer shows the correct/wrong state.

- [ ] **Step 3: Implement NamingTask**
Port logic from `components/naming-task.jsx`. Ensure it follows the two-column stimulus/response design.

- [ ] **Step 4: Run tests to verify it passes**
Run: `cd client && npm run test src/components/tasks/__tests__/NamingTask.test.tsx`

- [ ] **Step 5: Commit**
```bash
git add client/src/components/tasks/NamingTask.tsx client/src/components/tasks/__tests__/NamingTask.test.tsx client/src/assets/drawings/MocaArt.tsx
git commit -m "feat: implement MoCA Naming Task with TDD"
```

---

### Task 5: Integration & Manifest Update

**Files:**
- Modify: `client/src/components/BatteryPlayer.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/types/battery.ts`

- [ ] **Step 1: Add 'moca-naming' to TestType**
Update `client/src/types/battery.ts`.

- [ ] **Step 2: Add NamingTask to BatteryPlayer**
Update the switch statement in `BatteryPlayer.tsx`.

- [ ] **Step 3: Update MOCA_MANIFEST**
Add the naming task to the manifest in `App.tsx`.

- [ ] **Step 4: Manual smoke test and build**
Run: `cd client && npm run build`

- [ ] **Step 5: Commit**
```bash
git add client/src/components/BatteryPlayer.tsx client/src/App.tsx client/src/types/battery.ts
git commit -m "feat: integrate Naming Task into assessment battery"
```
