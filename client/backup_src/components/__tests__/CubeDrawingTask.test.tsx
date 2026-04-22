import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CubeDrawingTask } from '../CubeDrawingTask';

// Mock BaseCanvas
vi.mock('../BaseCanvas', () => ({
  BaseCanvas: ({ onSave }: { onSave: (data: string) => void }) => (
    <button data-testid="save-btn" onClick={() => onSave('test-data')}>Save</button>
  ),
}));

describe('CubeDrawingTask', () => {
  it('renders cube drawing instructions and SVG stimulus', () => {
    const onComplete = vi.fn();
    render(<CubeDrawingTask onComplete={onComplete} />);
    
    expect(screen.getByText('ציור קובייה')).toBeInTheDocument();
    expect(screen.getByText('העתק את הקובייה הבאה במדויק ככל האפשר:')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('completes the task when done button clicked after drawing', () => {
    const onComplete = vi.fn();
    render(<CubeDrawingTask onComplete={onComplete} />);

    // onSave from canvas sets state but does NOT call onComplete
    fireEvent.click(screen.getByTestId('save-btn'));
    expect(onComplete).not.toHaveBeenCalled();

    // explicit done button triggers onComplete with the saved dataUrl
    fireEvent.click(screen.getByText('סיימתי לצייר'));
    expect(onComplete).toHaveBeenCalledWith('test-data');
  });

  it('switches between digital drawing and photo upload', () => {
    const onComplete = vi.fn();
    render(<CubeDrawingTask onComplete={onComplete} />);
    
    // Switch to photo upload
    fireEvent.click(screen.getByText('אני מעדיף לצייר על דף ולצלם'));
    expect(screen.getByText('ציירו את הקובייה על דף חלק, צלמו אותה והעלו כאן:')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).not.toBeInTheDocument();

    // Switch back to digital
    fireEvent.click(screen.getByText('חזרה לציור דיגיטלי'));
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
  });
});
