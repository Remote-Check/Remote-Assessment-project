import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrientationTask } from '../OrientationTask';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

describe('OrientationTask', () => {
  it('renders all 6 orientation inputs', () => {
    const onComplete = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <OrientationTask onComplete={onComplete} />
      </I18nextProvider>
    );
    
    expect(screen.getByLabelText('orientation_task.date')).toBeInTheDocument();
    expect(screen.getByLabelText('orientation_task.month')).toBeInTheDocument();
    expect(screen.getByLabelText('orientation_task.year')).toBeInTheDocument();
    expect(screen.getByLabelText('orientation_task.day')).toBeInTheDocument();
    expect(screen.getByLabelText('orientation_task.place')).toBeInTheDocument();
    expect(screen.getByLabelText('orientation_task.city')).toBeInTheDocument();
  });

  it('submits form data when "Next" is clicked', () => {
    const onComplete = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <OrientationTask onComplete={onComplete} />
      </I18nextProvider>
    );
    
    fireEvent.change(screen.getByLabelText('orientation_task.date'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('orientation_task.month'), { target: { value: 'אפריל' } });
    fireEvent.change(screen.getByLabelText('orientation_task.year'), { target: { value: '2026' } });
    fireEvent.change(screen.getByLabelText('orientation_task.day'), { target: { value: 'שני' } });
    fireEvent.change(screen.getByLabelText('orientation_task.place'), { target: { value: 'בית' } });
    fireEvent.change(screen.getByLabelText('orientation_task.city'), { target: { value: 'תל אביב' } });
    
    // Find Next button - translation is 'common.finish' because isLastStep=true
    const nextBtn = screen.getByText('common.finish');
    fireEvent.click(nextBtn);
    
    expect(onComplete).toHaveBeenCalledWith({
      date: '20',
      month: 'אפריל',
      year: '2026',
      day: 'שני',
      place: 'בית',
      city: 'תל אביב'
    });
  });
});
