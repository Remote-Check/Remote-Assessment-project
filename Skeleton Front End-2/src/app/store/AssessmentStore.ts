// Simple store implementation without React Context
// This avoids context provider conflicts in Figma Make's environment

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

type Listener = () => void;

class AssessmentStore {
  private state: AssessmentState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AssessmentState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load assessment state from local storage', e);
    }
    return DEFAULT_STATE;
  }

  private saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private notify() {
    this.saveState();
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): AssessmentState {
    return this.state;
  }

  startNewAssessment() {
    this.state = {
      ...DEFAULT_STATE,
      id: Date.now().toString(),
    };
    this.notify();
  }

  updateTaskData(taskName: keyof AssessmentState['tasks'], data: any) {
    if (this.state.tasks[taskName] === data) return;
    this.state = {
      ...this.state,
      tasks: {
        ...this.state.tasks,
        [taskName]: data,
      },
    };
    this.notify();
  }

  setLastPath(path: string) {
    if (this.state.lastPath === path) return;
    this.state = { ...this.state, lastPath: path };
    this.notify();
  }

  completeAssessment() {
    if (this.state.isComplete) return;
    this.state = { ...this.state, isComplete: true };
    this.notify();
  }

  hasInProgressAssessment(): boolean {
    return this.state.id !== null && !this.state.isComplete;
  }
}

// Singleton instance
export const assessmentStore = new AssessmentStore();
