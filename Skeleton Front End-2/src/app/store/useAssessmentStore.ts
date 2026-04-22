import { useState, useEffect } from 'react';
import { assessmentStore, type AssessmentState } from './AssessmentStore';

// Hook that subscribes to store changes
export function useAssessmentStore() {
  const [state, setState] = useState<AssessmentState>(assessmentStore.getState());

  useEffect(() => {
    const unsubscribe = assessmentStore.subscribe(() => {
      setState(assessmentStore.getState());
    });
    return unsubscribe;
  }, []);

  return {
    state,
    startNewAssessment: () => assessmentStore.startNewAssessment(),
    resumeAssessment: () => {}, // Placeholder for future API fetch
    updateTaskData: (taskName: keyof AssessmentState['tasks'], data: any) =>
      assessmentStore.updateTaskData(taskName, data),
    setLastPath: (path: string) => assessmentStore.setLastPath(path),
    completeAssessment: () => assessmentStore.completeAssessment(),
    hasInProgressAssessment: state.id !== null && !state.isComplete,
  };
}
