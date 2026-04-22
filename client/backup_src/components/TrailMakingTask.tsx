import React, { useState } from 'react';
import { BaseCanvas } from './BaseCanvas';
import '../styles/canvas.css';

interface Stimulus {
  id: string;
  label: string;
  xPct: number; // % of canvas width
  yPct: number; // % of canvas height
}

// Sequence: 1 → א → 2 → ב → 3 → ג → 4 → ד → 5 → ה
// Positions approximate the canonical MoCA trail-making layout
const STIMULI: Stimulus[] = [
  { id: '1',  label: '1',  xPct: 14, yPct: 18 },
  { id: 'א',  label: 'א',  xPct: 42, yPct: 10 },
  { id: '2',  label: '2',  xPct: 72, yPct: 20 },
  { id: 'ב',  label: 'ב',  xPct: 85, yPct: 48 },
  { id: '3',  label: '3',  xPct: 63, yPct: 68 },
  { id: 'ג',  label: 'ג',  xPct: 38, yPct: 78 },
  { id: '4',  label: '4',  xPct: 12, yPct: 62 },
  { id: 'ד',  label: 'ד',  xPct: 24, yPct: 38 },
  { id: '5',  label: '5',  xPct: 52, yPct: 44 },
  { id: 'ה',  label: 'ה',  xPct: 76, yPct: 84 },
];

interface TrailMakingTaskProps {
  onComplete: (dataUrl: string) => void;
}

export const TrailMakingTask: React.FC<TrailMakingTaskProps> = ({ onComplete }) => {
  const [currentDataUrl, setCurrentDataUrl] = useState('');

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.25rem' }}>חיבור מספרים ואותיות</h3>
        <p style={{ fontSize: '1.05rem', color: 'var(--ink-500)' }}>
          חברו את העיגולים לפי הסדר: <strong>1 ← א ← 2 ← ב ← 3 ← ג ← 4 ← ד ← 5 ← ה</strong>
        </p>
      </div>
      <BaseCanvas onSave={setCurrentDataUrl}>
        {STIMULI.map((s) => (
          <div
            key={s.id}
            className="stimulus-circle"
            style={{ left: `${s.xPct}%`, top: `${s.yPct}%` }}
          >
            {s.label}
          </div>
        ))}
      </BaseCanvas>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={() => onComplete(currentDataUrl)}
          disabled={!currentDataUrl}
          className="primary-btn"
          style={{ minWidth: 180, minHeight: 56, fontSize: '1.1rem', fontWeight: 700 }}
        >
          סיימתי
        </button>
      </div>
    </div>
  );
};
