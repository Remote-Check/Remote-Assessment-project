import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBatteryEngine } from '../useBatteryEngine';
import type { BatteryManifest } from '../../types/battery';

const MOCK_MANIFEST: BatteryManifest = {
  id: 'test-battery',
  version: '1.0',
  steps: [
    { id: 'step1', type: 'orientation', titleKey: 'step1.title' },
    { id: 'step2', type: 'moca-memory', titleKey: 'step2.title' },
  ],
};

describe('useBatteryEngine', () => {
  it('should initialize with the first step', () => {
    const { result } = renderHook(() => useBatteryEngine(MOCK_MANIFEST));
    expect(result.current.activeStep.id).toBe('step1');
    expect(result.current.state.currentIndex).toBe(0);
    expect(result.current.state.isFinished).toBe(false);
  });

  it('should move to the next step and save results', () => {
    const { result } = renderHook(() => useBatteryEngine(MOCK_MANIFEST));
    
    act(() => {
      result.current.nextStep({ score: 10 });
    });

    expect(result.current.activeStep.id).toBe('step2');
    expect(result.current.state.results.step1).toEqual({ score: 10 });
  });

  it('should mark as finished after the last step', () => {
    const { result } = renderHook(() => useBatteryEngine(MOCK_MANIFEST));
    
    act(() => {
      result.current.nextStep(); // Finish step 1
    });
    act(() => {
      result.current.nextStep(); // Finish step 2
    });

    expect(result.current.state.isFinished).toBe(true);
  });

  it('should move back to the previous step', () => {
    const { result } = renderHook(() => useBatteryEngine(MOCK_MANIFEST));
    
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.activeStep.id).toBe('step2');

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.activeStep.id).toBe('step1');
  });
});
