// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NamingTask } from '../NamingTask';

const updateTaskData = vi.fn();

vi.mock('../../store/AssessmentContext', () => ({
  useAssessmentStore: () => ({
    state: {
      scoringContext: { mocaVersion: '8.3' },
      tasks: {},
    },
    updateTaskData,
  }),
}));

vi.mock('../StimuliManifestProvider', () => ({
  DevStimulusNotice: () => <div>stimulus placeholder</div>,
  useStimuliManifest: () => ({
    getAsset: () => null,
  }),
}));

vi.mock('../ListenButton', () => ({
  ListenButton: () => <button type="button">השמע הוראות</button>,
}));

describe('NamingTask', () => {
  afterEach(() => {
    cleanup();
    updateTaskData.mockClear();
  });

  it('records typed answers without presenting answer choices or revealing correctness', async () => {
    render(<NamingTask />);

    expect(screen.queryByRole('button', { name: 'סוס' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'חמור' })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'סוס');

    expect(screen.getByText('נבחרו 1 מתוך 3')).toBeInTheDocument();
    expect(screen.getByText('התשובה נשמרה. אפשר לעבור לפריט הבא.')).toBeInTheDocument();
    expect(screen.queryByText(/נכון|שגוי/)).not.toBeInTheDocument();
    expect(updateTaskData).toHaveBeenCalledWith('naming', {
      answers: { 'item-1': 'סוס' },
    });
  });

  it('guards item navigation until the current item is answered and allows revisiting answers', async () => {
    render(<NamingTask />);

    expect(screen.getByRole('button', { name: 'לפריט הבא' })).toBeDisabled();

    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'חמור');
    await userEvent.click(screen.getByRole('button', { name: 'לפריט הבא' }));

    expect(screen.getByText('משימת שיום · פריט 2 מתוך 3')).toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'נמר');
    await userEvent.click(screen.getByRole('button', { name: 'לפריט הקודם' }));
    await userEvent.clear(screen.getByRole('textbox', { name: 'שם החיה' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'סוס');

    expect(updateTaskData).toHaveBeenLastCalledWith('naming', {
      answers: { 'item-1': 'סוס', 'item-2': 'נמר' },
    });
  });

  it('announces completion after all three naming items are selected', async () => {
    render(<NamingTask />);

    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'סוס');
    await userEvent.click(screen.getByRole('button', { name: 'לפריט הבא' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'נמר');
    await userEvent.click(screen.getByRole('button', { name: 'לפריט הבא' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'שם החיה' }), 'ברווז');

    expect(screen.getByText('נבחרו 3 מתוך 3')).toBeInTheDocument();
    expect(screen.getByText('כל פריטי השיום נרשמו. אפשר להמשיך למשימה הבאה.')).toBeInTheDocument();
  });
});
