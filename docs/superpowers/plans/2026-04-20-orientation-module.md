# Orientation Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a computer orientation module to train older adults (60+) on using the digital assessment interface, focusing on button navigation and reading instructions.

**Architecture:** A multi-step introductory component that uses visual cues (pulsing animations) to guide the user. It integrates into the existing `useBatteryEngine` flow as the first mandatory step.

**Tech Stack:** React, TypeScript, CSS Animations, `react-i18next`.

---

### Task 1: Orientation Content & Styles

**Files:**
- Modify: `client/public/locales/he/translation.json`
- Create: `client/src/styles/orientation.css`

- [ ] **Step 1: Expand Hebrew translation for orientation**

```json
/* client/public/locales/he/translation.json */
{
  "common": { ... },
  "orientation": {
    "title": "הכרת המערכת",
    "step1_welcome": "שלום. במערכת זו נבצע מספר משימות קצרות.",
    "step1_instruction": "לפני שנתחיל, בואו נלמד איך להשתמש במערכת. שימו לב לכפתור השחור הגדול למטה עם המילה 'הבא'.",
    "step2_navigation": "מצוין! כפתור 'הבא' יעביר אתכם למשימה הבאה.",
    "step2_back": "אם תרצו לחזור ולקרוא שוב הוראה, תוכלו להשתמש בכפתור הלבן 'חזור' שיופיע בצד ימין.",
    "ready_to_start": "עכשיו אנחנו מוכנים להתחיל בהערכה הקוגניטיבית. לחצו על 'הבא' כדי להתחיל במשימה הראשונה."
  }
}
```

- [ ] **Step 2: Create pulsing animation for guidance**

```css
/* client/src/styles/orientation.css */
@keyframes pulse-border {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
}

.guide-pulse {
  animation: pulse-border 2s infinite;
  border-radius: 8px;
}

.instruction-box {
  background: var(--secondary-color);
  padding: 30px;
  border-radius: 12px;
  margin: 20px 0;
  border-right: 8px solid var(--primary-color);
}
```

- [ ] **Step 3: Commit**

```bash
git add client/public/locales/he/translation.json client/src/styles/orientation.css
git commit -m "style: add orientation content and pulsing animations"
```

---

### Task 2: OrientationModule Component (TDD)

**Files:**
- Create: `client/src/components/OrientationModule.tsx`
- Test: `client/src/components/__tests__/OrientationModule.test.tsx`

- [ ] **Step 1: Write failing test for OrientationModule**

```tsx
/* client/src/components/__tests__/OrientationModule.test.tsx */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrientationModule } from '../OrientationModule';

describe('OrientationModule', () => {
  it('should flow through the orientation steps', () => {
    const onComplete = vi.fn();
    render(<OrientationModule onComplete={onComplete} />);

    // Step 1
    expect(screen.getByText('orientation.step1_welcome')).toBeInTheDocument();
    
    // Move to Step 2
    fireEvent.click(screen.getByText('common.next'));
    expect(screen.getByText('orientation.step2_navigation')).toBeInTheDocument();

    // Move to Finish
    fireEvent.click(screen.getByText('common.next'));
    expect(screen.getByText('orientation.ready_to_start')).toBeInTheDocument();

    // Complete
    fireEvent.click(screen.getByText('common.next'));
    expect(onComplete).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd client && npm run test src/components/__tests__/OrientationModule.test.tsx`
Expected: FAIL (Component doesn't exist)

- [ ] **Step 3: Implement OrientationModule**

```tsx
/* client/src/components/OrientationModule.tsx */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from './AssessmentLayout';
import '../styles/orientation.css';

interface Props {
  onComplete: () => void;
}

export const OrientationModule: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = step > 1 ? () => setStep(step - 1) : undefined;

  return (
    <AssessmentLayout
      title={t('orientation.title')}
      onNext={handleNext}
      onBack={handleBack}
      isLastStep={step === 3}
    >
      <div className="instruction-box">
        {step === 1 && (
          <>
            <p>{t('orientation.step1_welcome')}</p>
            <p>{t('orientation.step1_instruction')}</p>
          </>
        )}
        {step === 2 && (
          <>
            <p>{t('orientation.step2_navigation')}</p>
            <p>{t('orientation.step2_back')}</p>
          </>
        )}
        {step === 3 && (
          <p>{t('orientation.ready_to_start')}</p>
        )}
      </div>
    </AssessmentLayout>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd client && npm run test`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add client/src/components/OrientationModule.tsx client/src/components/__tests__/OrientationModule.test.tsx
git commit -m "feat: implement OrientationModule with TDD"
```

---

### Task 3: Integration and "Battery Player" Refactor

**Files:**
- Modify: `client/src/App.tsx`
- Create: `client/src/components/BatteryPlayer.tsx`

- [ ] **Step 1: Create BatteryPlayer to handle component switching**

```tsx
/* client/src/components/BatteryPlayer.tsx */
import React from 'react';
import { useBatteryEngine } from '../hooks/useBatteryEngine';
import { OrientationModule } from './OrientationModule';
import type { BatteryManifest } from '../types/battery';

interface Props {
  manifest: BatteryManifest;
}

export const BatteryPlayer: React.FC<Props> = ({ manifest }) => {
  const { state, activeStep, nextStep } = useBatteryEngine(manifest);

  if (state.isFinished) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>תודה רבה</h1>
        <p>ההערכה הסתיימה בהצלחה.</p>
      </div>
    );
  }

  // Switch based on test type
  switch (activeStep.type) {
    case 'orientation':
      return <OrientationModule onComplete={() => nextStep({ orientation: 'completed' })} />;
    default:
      return (
        <div className="container">
          <h2>משימה בתהליך: {activeStep.id}</h2>
          <button className="high-contrast-btn" onClick={() => nextStep()}>
            הבא
          </button>
        </div>
      );
  }
};
```

- [ ] **Step 2: Simplify App.tsx to use BatteryPlayer**

```tsx
/* client/src/App.tsx */
import { BatteryPlayer } from './components/BatteryPlayer';
import type { BatteryManifest } from './types/battery';

const MOCA_MANIFEST: BatteryManifest = {
  id: 'moca-hebrew-v1',
  version: '1.0',
  steps: [
    { id: 'orientation', type: 'orientation', titleKey: 'orientation.title' },
    { id: 'memory', type: 'moca-memory', titleKey: 'memory.title' },
  ],
};

function App() {
  return <BatteryPlayer manifest={MOCA_MANIFEST} />;
}

export default App;
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: SUCCESS

- [ ] **Step 4: Commit**

```bash
git add client/src/components/BatteryPlayer.tsx client/src/App.tsx
git commit -m "refactor: introduce BatteryPlayer for modular test switching"
```
