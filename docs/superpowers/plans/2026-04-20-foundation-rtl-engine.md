# Foundation & i18n RTL Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a React/TypeScript frontend with full RTL (Hebrew) support, internationalization (i18n), and a JSON-driven "Battery Engine" for managing neuropsychological tests.

**Architecture:** Use a "Playlist" pattern where a JSON manifest defines the sequence of tests. The `AssessmentLayout` provides a high-contrast, accessible shell with oversized navigation, while `useBatteryEngine` manages the state of the active test.

**Tech Stack:** React, TypeScript, Vite, `react-i18next`, Lucide React (Icons).

---

### Task 1: Project Scaffolding

**Files:**
- Create: `client/` (via Vite)
- Modify: `package.json` (add dependencies)

- [ ] **Step 1: Initialize Vite Project**

Run: `npm create vite@latest client -- --template react-ts`
Expected: `client/` directory created with React/TS boilerplate.

- [ ] **Step 2: Install Dependencies**

Run: `cd client && npm install react-i18next i18next lucide-react`
Expected: Packages installed successfully.

- [ ] **Step 3: Clean boilerplate and verify build**

Run: `cd client && rm src/App.css src/index.css && npm run build`
Expected: Successful build with clean output.

- [ ] **Step 4: Commit**

```bash
git add client/
git commit -m "chore: scaffold react-ts project with vite"
```

---

### Task 2: RTL & Accessibility Global Styles

**Files:**
- Create: `client/src/styles/global.css`
- Modify: `client/src/main.tsx`

- [ ] **Step 1: Create RTL Global Styles**

```css
/* client/src/styles/global.css */
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --primary-color: #000000;
  --secondary-color: #f3f4f6;
  --border-color: #e5e7eb;
  --target-size: 64px; /* Accessible touch target */
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  direction: rtl; /* RTL by default */
  line-height: 1.5;
  font-size: 20px; /* Base font size for 60+ population */
}

button {
  cursor: pointer;
  font-family: inherit;
  font-size: 1.25rem;
  padding: 12px 24px;
  min-height: var(--target-size);
  min-width: var(--target-size);
}

.high-contrast-btn {
  background-color: var(--primary-color);
  color: #ffffff;
  border: 4px solid var(--primary-color);
  font-weight: bold;
  border-radius: 8px;
}

.high-contrast-btn:disabled {
  background-color: #666;
  border-color: #666;
  cursor: not-allowed;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
```

- [ ] **Step 2: Apply Global Styles**

```tsx
/* client/src/main.tsx */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css' // Import the new styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 3: Commit**

```bash
git add client/src/styles/global.css client/src/main.tsx
git commit -m "style: add RTL global styles and accessible typography"
```

---

### Task 3: i18n Setup (Hebrew)

**Files:**
- Create: `client/src/i18n.ts`
- Create: `client/public/locales/he/translation.json`
- Modify: `client/src/main.tsx`

- [ ] **Step 1: Create i18n configuration**

```tsx
/* client/src/i18n.ts */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'he',
    lng: 'he',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
```

- [ ] **Step 2: Create initial Hebrew translation file**

```json
/* client/public/locales/he/translation.json */
{
  "common": {
    "next": "הבא",
    "back": "חזור",
    "start": "התחל",
    "finish": "סיום",
    "loading": "טוען..."
  },
  "orientation": {
    "title": "הכרת המערכת",
    "welcome": "ברוכים הבאים להערכה הקוגניטיבית. לפני שנתחיל, נלמד איך להשתמש במערכת.",
    "instructions": "לחצו על כפתור 'הבא' למטה כדי להמשיך."
  }
}
```

- [ ] **Step 3: Initialize i18n in entry point**

```tsx
/* client/src/main.tsx */
// ... existing imports
import './i18n'; // Initialize i18n before rendering
// ... rest of file
```

- [ ] **Step 4: Commit**

```bash
git add client/src/i18n.ts client/public/locales/he/translation.json client/src/main.tsx
git commit -m "feat: initialize i18next with Hebrew RTL support"
```

---

### Task 4: The Battery Engine (JSON) State Management

**Files:**
- Create: `client/src/types/battery.ts`
- Create: `client/src/hooks/useBatteryEngine.ts`

- [ ] **Step 1: Define Battery Types**

```tsx
/* client/src/types/battery.ts */
export type TestType = 'orientation' | 'moca-visuospatial' | 'moca-naming' | 'moca-memory';

export interface TestStep {
  id: string;
  type: TestType;
  titleKey: string;
  config?: Record<string, any>;
}

export interface BatteryManifest {
  id: string;
  version: string;
  steps: TestStep[];
}

export interface AssessmentState {
  currentIndex: number;
  results: Record<string, any>;
  isFinished: boolean;
}
```

- [ ] **Step 2: Implement the Engine Hook**

```tsx
/* client/src/hooks/useBatteryEngine.ts */
import { useState } from 'react';
import { BatteryManifest, AssessmentState } from '../types/battery';

export function useBatteryEngine(manifest: BatteryManifest) {
  const [state, setState] = useState<AssessmentState>({
    currentIndex: 0,
    results: {},
    isFinished: false,
  });

  const activeStep = manifest.steps[state.currentIndex];

  const nextStep = (stepResult?: any) => {
    setState((prev) => {
      const isLast = prev.currentIndex === manifest.steps.length - 1;
      return {
        ...prev,
        results: { ...prev.results, [activeStep.id]: stepResult },
        currentIndex: isLast ? prev.currentIndex : prev.currentIndex + 1,
        isFinished: isLast,
      };
    });
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  };

  return {
    state,
    activeStep,
    nextStep,
    prevStep,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/types/battery.ts client/src/hooks/useBatteryEngine.ts
git commit -m "feat: add useBatteryEngine hook and manifest types"
```

---

### Task 5: Assessment Shell Layout

**Files:**
- Create: `client/src/components/AssessmentLayout.tsx`
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Create the Accessible Shell Component**

```tsx
/* client/src/components/AssessmentLayout.tsx */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  title: string;
  isLastStep: boolean;
}

export const AssessmentLayout: React.FC<Props> = ({ children, onNext, onBack, title, isLastStep }) => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '20px 0', borderBottom: '2px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h1>
      </header>

      <main style={{ flex: 1, padding: '40px 0' }}>
        {children}
      </main>

      <footer style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        {onBack && (
          <button className="high-contrast-btn" style={{ background: '#fff', color: '#000' }} onClick={onBack}>
            <ChevronRight size={24} style={{ marginLeft: '8px' }} />
            {t('common.back')}
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button className="high-contrast-btn" onClick={onNext}>
          {isLastStep ? t('common.finish') : t('common.next')}
          <ChevronLeft size={24} style={{ marginRight: '8px' }} />
        </button>
      </footer>
    </div>
  );
};
```

- [ ] **Step 2: Wire up App.tsx with a sample manifest**

```tsx
/* client/src/App.tsx */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBatteryEngine } from './hooks/useBatteryEngine';
import { AssessmentLayout } from './components/AssessmentLayout';
import { BatteryManifest } from './types/battery';

const SAMPLE_MANIFEST: BatteryManifest = {
  id: 'moca-hebrew-v1',
  version: '1.0',
  steps: [
    { id: 'orientation', type: 'orientation', titleKey: 'orientation.title' },
    { id: 'memory', type: 'moca-memory', titleKey: 'memory.title' },
  ],
};

function App() {
  const { t } = useTranslation();
  const { state, activeStep, nextStep, prevStep } = useBatteryEngine(SAMPLE_MANIFEST);

  if (state.isFinished) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>תודה רבה</h1>
        <p>ההערכה הסתיימה בהצלחה.</p>
      </div>
    );
  }

  return (
    <AssessmentLayout
      title={t(activeStep.titleKey)}
      onNext={() => nextStep({ completed: true })}
      onBack={state.currentIndex > 0 ? prevStep : undefined}
      isLastStep={state.currentIndex === SAMPLE_MANIFEST.steps.length - 1}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.5rem' }}>{t(`${activeStep.id}.welcome` as any)}</p>
      </div>
    </AssessmentLayout>
  );
}

export default App;
```

- [ ] **Step 3: Run the app and verify RTL/i18n**

Run: `cd client && npm run dev`
Expected: App runs, shows Hebrew text in RTL layout with large black buttons.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/AssessmentLayout.tsx client/src/App.tsx
git commit -m "feat: implement accessible shell with sample Battery Engine flow"
```
