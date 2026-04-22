import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

// Define the shape of our assessment data
export interface AssessmentState {
  id: string | null;
  lastPath: string;
  isComplete: boolean;
  tasks: {
    trailMaking?: any;
    cube?: any;
    clock?: any;
    naming?: any;
    memory?: any;
    digitSpan?: any;
    vigilance?: any;
    serial7?: any;
    language?: any;
    abstraction?: any;
    delayedRecall?: any;
    orientation?: any;
  };
}

const DEFAULT_STATE: AssessmentState = {
  id: null,
  lastPath: '/patient/trail-making',
  isComplete: false,
  tasks: {},
};

const STORAGE_KEY = 'moca_assessment_state';

interface AssessmentContextType {
  state: AssessmentState;
  startNewAssessment: () => void;
  resumeAssessment: () => void;
  updateTaskData: (taskName: keyof AssessmentState['tasks'], data: any) => void;
  setLastPath: (path: string) => void;
  completeAssessment: () => void;
  hasInProgressAssessment: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssessmentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load assessment state from local storage', e);
    }
    return DEFAULT_STATE;
  });

  // Keep localStorage perfectly in sync with our React state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startNewAssessment = useCallback(() => {
    const newState = {
      ...DEFAULT_STATE,
      id: Date.now().toString(), // Generate a unique ID for this session
    };
    setState(newState);
  }, []);

  const resumeAssessment = useCallback(() => {
    // Already in state, just a placeholder for potential API fetch in the future
  }, []);

  const updateTaskData = useCallback((taskName: keyof AssessmentState['tasks'], data: any) => {
    setState((prev) => {
      // Prevent unnecessary state updates if data reference is the same
      if (prev.tasks[taskName] === data) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskName]: data,
        },
      };
    });
  }, []);

  const setLastPath = useCallback((path: string) => {
    setState((prev) => {
      // Prevent unnecessary state updates if path is the same
      if (prev.lastPath === path) return prev;
      return { ...prev, lastPath: path };
    });
  }, []);

  const completeAssessment = useCallback(() => {
    setState((prev) => {
      if (prev.isComplete) return prev;
      return { ...prev, isComplete: true };
    });
  }, []);

  const hasInProgressAssessment = state.id !== null && !state.isComplete;

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      startNewAssessment,
      resumeAssessment,
      updateTaskData,
      setLastPath,
      completeAssessment,
      hasInProgressAssessment,
    }),
    [state, startNewAssessment, resumeAssessment, updateTaskData, setLastPath, completeAssessment, hasInProgressAssessment]
  );

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentStore() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessmentStore must be used within an AssessmentProvider');
  }
  return context;
}
