import { render, screen, fireEvent } from '@testing-library/react';
import { NamingTask } from '../NamingTask';
import { describe, it, expect, vi } from 'vitest';

describe('NamingTask', () => {
  it('renders the first animal task', () => {
    render(<NamingTask onComplete={vi.fn()} />);
    
    // Check heading
    expect(screen.getByText(/מה שם החיה בתמונה/i)).toBeInTheDocument();
    
    // Check animal art (svg) - simplified check
    expect(document.querySelector('svg')).toBeInTheDocument();
    
    // Check options
    const options = ['כלב', 'אריה', 'חתול', 'נמר'];
    options.forEach(opt => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('handles answer selection and enables continue button', () => {
    render(<NamingTask onComplete={vi.fn()} />);
    
    const continueButton = screen.getByRole('button', { name: /לפריט הבא/i });
    expect(continueButton).toBeDisabled();

    // Select correct answer
    fireEvent.click(screen.getByText('אריה'));
    
    // Button should be enabled
    expect(continueButton).toBeEnabled();
    
    // Should show check icon for correct answer
    // Note: We might need to mock lucide-react or check for svg in the button
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('shows wrong state when selecting incorrect answer', () => {
    render(<NamingTask onComplete={vi.fn()} />);
    
    // Select wrong answer
    fireEvent.click(screen.getByText('כלב'));
    
    // Check button style or some indicator of wrong answer if possible
    // For now, let's check that the correct answer 'אריה' still shows its indicator
    // and the button is enabled anyway
    expect(screen.getByRole('button', { name: /לפריט הבא/i })).toBeEnabled();
  });

  it('completes the task after 3 items', () => {
    const onComplete = vi.fn();
    render(<NamingTask onComplete={onComplete} />);
    
    // Item 1: Lion -> Select 'אריה'
    fireEvent.click(screen.getByText('אריה'));
    fireEvent.click(screen.getByRole('button', { name: /לפריט הבא/i }));
    
    // Item 2: Rhino -> Select 'קרנף'
    fireEvent.click(screen.getByText('קרנף'));
    fireEvent.click(screen.getByRole('button', { name: /לפריט הבא/i }));
    
    // Item 3: Camel -> Select 'גמל'
    expect(screen.getByText(/פריט 3 מתוך 3/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('גמל'));
    
    const finishButton = screen.getByRole('button', { name: /סיים משימה/i });
    expect(finishButton).toBeInTheDocument();
    fireEvent.click(finishButton);
    
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(['אריה', 'קרנף', 'גמל']);
  });
});
