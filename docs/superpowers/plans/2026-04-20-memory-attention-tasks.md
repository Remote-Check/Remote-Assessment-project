# MoCA Memory & Attention Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the MoCA Memory (Learning) and Attention tasks (Digit Span, Vigilance, Serial 7s) using high-fidelity UI primitives and TDD.

**Architecture:** 
1. **MemoryTask:** A state-managed component for the learning phase (2 trials of 5 words).
2. **DigitSpanTask:** A component supporting forward and backward digit repetition with a large numeric keypad.
3. **VigilanceTask:** A timed letter-tapping task (tapping on 'א').
4. **Serial7sTask:** A numeric subtraction task with keyboard input.
5. **Integration:** Update `BatteryPlayer` to include these new modules.

**Tech Stack:** React, TypeScript, Vitest, React Testing Library, Lucide React.

---

### Task 1: Word Learning Task (Memory Learning)

**Files:**
- Create: `client/src/components/tasks/MemoryLearningTask.tsx`
- Test: `client/src/components/tasks/__tests__/MemoryLearningTask.test.tsx`

- [ ] **Step 1: Write failing test for MemoryLearningTask**
Verify it displays words one by one and flows through two learning trials.

- [ ] **Step 2: Implement MemoryLearningTask**
Use `InstructionBox` for setup. Words: פנים, קטיפה, כנסייה, ציפורן, אדום.
Implement 1-second display per word followed by a "Recall" step (where the clinician/patient selects what was remembered).

- [ ] **Step 3: Run tests to verify it passes**
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add client/src/components/tasks/MemoryLearningTask.tsx client/src/components/tasks/__tests__/MemoryLearningTask.test.tsx
git commit -m "feat: implement MoCA Memory Learning task"
```

---

### Task 2: Digit Span Task (Attention)

**Files:**
- Create: `client/src/components/tasks/DigitSpanTask.tsx`
- Test: `client/src/components/tasks/__tests__/DigitSpanTask.test.tsx`

- [ ] **Step 1: Write failing test for DigitSpanTask**
Verify forward and backward modes and numeric input.

- [ ] **Step 2: Implement DigitSpanTask**
Sequence 1 (Forward): 2-1-8-5-4.
Sequence 2 (Backward): 7-4-2.
Include a large numeric keypad optimized for the 60+ population.

- [ ] **Step 3: Run tests to verify it passes**
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add client/src/components/tasks/DigitSpanTask.tsx client/src/components/tasks/__tests__/DigitSpanTask.test.tsx
git commit -m "feat: implement MoCA Digit Span task (Forward/Backward)"
```

---

### Task 3: Vigilance Task (Attention)

**Files:**
- Create: `client/src/components/tasks/VigilanceTask.tsx`
- Test: `client/src/components/tasks/__tests__/VigilanceTask.test.tsx`

- [ ] **Step 1: Write failing test for VigilanceTask**
Verify it iterates through the letter list and records taps.

- [ ] **Step 2: Implement VigilanceTask**
Sequence: פ-ב-א-כ-ל-נ-א-א-ב-מ-ו-א-א-ב-א-פ-ר-א-ב-א-מ-ו-פ-א-א-ב.
Criteria: 1 tap for every 'א'.
Large central tap button for easy interaction.

- [ ] **Step 3: Run tests to verify it passes**
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add client/src/components/tasks/VigilanceTask.tsx client/src/components/tasks/__tests__/VigilanceTask.test.tsx
git commit -m "feat: implement MoCA Vigilance task (Letter Tapping)"
```

---

### Task 4: Serial 7s Task (Attention)

**Files:**
- Create: `client/src/components/tasks/Serial7sTask.tsx`
- Test: `client/src/components/tasks/__tests__/Serial7sTask.test.tsx`

- [ ] **Step 1: Write failing test for Serial7sTask**
Verify it asks for 5 subtractions starting from 100.

- [ ] **Step 2: Implement Serial7sTask**
Prompts: 100 - 7 = ?, [Result] - 7 = ?, etc.
Use numeric input/keypad.

- [ ] **Step 3: Run tests to verify it passes**
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add client/src/components/tasks/Serial7sTask.tsx client/src/components/tasks/__tests__/Serial7sTask.test.tsx
git commit -m "feat: implement MoCA Serial 7s task"
```

---

### Task 5: Integration & Final MoCA Manifest

**Files:**
- Modify: `client/src/components/BatteryPlayer.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/types/battery.ts`

- [ ] **Step 1: Update TestType and BatteryPlayer**
Include `moca-memory-learning`, `moca-digit-span`, `moca-vigilance`, and `moca-serial-7s`.

- [ ] **Step 2: Finalize MOCA_MANIFEST**
Orientation -> Naming -> Trails -> Clock -> Memory Learning -> Digit Span -> Vigilance -> Serial 7s.

- [ ] **Step 3: Manual smoke test and final build**
Run: `cd client && npm run build`

- [ ] **Step 4: Commit**
```bash
git add client/src/components/BatteryPlayer.tsx client/src/App.tsx client/src/types/battery.ts
git commit -m "feat: integrate all MoCA Attention and Memory Learning tasks"
```
