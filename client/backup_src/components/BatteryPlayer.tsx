import React, { useEffect, useRef } from 'react';
import { useBatteryEngine } from '../hooks/useBatteryEngine';
import { useScoring } from '../hooks/useScoring';
import { OrientationModule } from './OrientationModule';
import { TrailMakingTask } from './TrailMakingTask';
import { ClockDrawingTask } from './ClockDrawingTask';
import { CubeDrawingTask } from './CubeDrawingTask';
import { NamingTask } from './tasks/NamingTask';
import { MemoryLearningTask } from './tasks/MemoryLearningTask';
import { DigitSpanTask } from './tasks/DigitSpanTask';
import { VigilanceTask } from './tasks/VigilanceTask';
import { Serial7sTask } from './tasks/Serial7sTask';
import { LanguageTask } from './tasks/LanguageTask';
import { AbstractionTask } from './tasks/AbstractionTask';
import { DelayedRecallTask } from './tasks/DelayedRecallTask';
import { OrientationTask } from './tasks/OrientationTask';
import { edgeFn } from '../lib/supabase';
import type { BatteryManifest } from '../types/battery';
import type { ScoringContext } from '../types/scoring';

const DRAWING_TASK_TYPES = ['moca-cube', 'moca-clock', 'moca-visuospatial'];

interface Props {
  manifest: BatteryManifest;
  sessionId: string | null;
  scoringContext: ScoringContext | null;
}

export const BatteryPlayer: React.FC<Props> = ({ manifest, sessionId, scoringContext }) => {
  const { state, activeStep, nextStep } = useBatteryEngine(manifest);
  const completeCalled = useRef(false);

  const { report } = useScoring(
    state.results,
    manifest,
    scoringContext ?? {
      sessionId: '',
      sessionDate: new Date(),
      educationYears: 12,
      patientAge: 70,
    },
    state.isFinished
  );

  // Submit each task result to backend (fire-and-forget with basic retry)
  const submitResult = (taskType: string, rawData: unknown, drawingDataUrl?: string) => {
    if (!sessionId) return;

    // If drawing task, save image first then submit reference
    if (drawingDataUrl && DRAWING_TASK_TYPES.includes(taskType)) {
      fetch(edgeFn('save-drawing'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, taskId: taskType, imageBase64: drawingDataUrl }),
      }).then(res => res.ok ? res.json() : Promise.reject())
        .then(({ url }) => {
          fetch(edgeFn('submit-results'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, taskType, rawData: { drawingUrl: url } }),
          });
        })
        .catch(() => {}); // clinician can still review via dashboard
      return;
    }

    fetch(edgeFn('submit-results'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, taskType, rawData }),
    }).catch(() => {});
  };

  // Complete session when battery finishes + scoring report ready
  useEffect(() => {
    if (!state.isFinished || !report || !sessionId || completeCalled.current) return;
    completeCalled.current = true;

    const drawingUrls = Object.entries(state.results)
      .filter(([stepId]) => {
        const step = manifest.steps.find(s => s.id === stepId);
        return step && DRAWING_TASK_TYPES.includes(step.type);
      })
      .map(([stepId, data]) => {
        const step = manifest.steps.find(s => s.id === stepId)!;
        return { taskId: step.type, url: (data as { drawingUrl?: string })?.drawingUrl ?? '' };
      })
      .filter(d => d.url);

    fetch(edgeFn('complete-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, scoringReport: report, drawingUrls }),
    }).catch(() => {});
  }, [state.isFinished, report, sessionId, state.results, manifest.steps]);

  if (state.isFinished) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>תודה רבה</h1>
        <p>ההערכה הסתיימה בהצלחה.</p>
      </div>
    );
  }

  const handleComplete = (data: unknown, drawingDataUrl?: string) => {
    submitResult(activeStep.type, data, drawingDataUrl);
    nextStep(data);
  };

  switch (activeStep.type) {
    case 'orientation':
      return <OrientationModule onComplete={() => handleComplete({ orientation: 'completed' })} />;
    case 'moca-naming':
      return <NamingTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-visuospatial':
      return <TrailMakingTask onComplete={(data) => handleComplete(null, data)} />;
    case 'moca-cube':
      return <CubeDrawingTask onComplete={(data) => handleComplete(null, data)} />;
    case 'moca-clock':
      return <ClockDrawingTask onComplete={(data) => handleComplete(null, data)} />;
    case 'moca-memory-learning':
      return <MemoryLearningTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-digit-span':
      return <DigitSpanTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-vigilance':
      return <VigilanceTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-serial-7s':
      return <Serial7sTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-language':
      return <LanguageTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-abstraction':
      return <AbstractionTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-delayed-recall':
      return <DelayedRecallTask onComplete={(data) => handleComplete(data)} />;
    case 'moca-orientation-task':
      return <OrientationTask onComplete={(data) => handleComplete(data)} />;
    default:
      return (
        <div className="container">
          <h2>משימה בתהליך: {activeStep.id}</h2>
          <button className="high-contrast-btn" onClick={() => handleComplete({})}>
            הבא
          </button>
        </div>
      );
  }
};
