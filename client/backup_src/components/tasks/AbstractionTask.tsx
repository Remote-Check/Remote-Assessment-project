import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { InstructionBox } from '../layout/InstructionBox';
import { BigButton } from '../layout/BigButton';

interface Props {
  onComplete: (data: any) => void;
}

export const AbstractionTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'example' | 'pair1' | 'pair2'>('example');
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleScore = (isCorrect: boolean) => {
    const newResults = { ...results, [phase]: isCorrect };
    setResults(newResults);
    
    if (phase === 'pair1') {
      setPhase('pair2');
    } else if (phase === 'pair2') {
      onComplete(newResults);
    }
  };

  const getDisplayText = () => {
    if (phase === 'example') return t('abstraction.pair_example');
    if (phase === 'pair1') return t('abstraction.pair1');
    if (phase === 'pair2') return t('abstraction.pair2');
    return '';
  };

  return (
    <AssessmentLayout
      title={t('abstraction.title')}
      onNext={phase === 'example' ? () => setPhase('pair1') : undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <InstructionBox
          title={t('abstraction.title')}
          steps={[t('abstraction.instr')]}
        />

        <div style={{
          padding: 48,
          background: 'var(--ink-50)',
          borderRadius: 'var(--r-xl)',
          textAlign: 'center',
          fontSize: 'var(--fs-3xl)',
          fontWeight: 800,
          border: '2px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          {getDisplayText()}
        </div>

        {phase === 'example' ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-500)', fontSize: 'var(--fs-lg)', fontWeight: 600 }}>
            {t('abstraction.example_label')}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <BigButton variant="primary" onClick={() => handleScore(true)} style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)', minWidth: 200 }}>
              {t('abstraction.correct')}
            </BigButton>
            <BigButton variant="secondary" onClick={() => handleScore(false)} style={{ color: 'var(--accent-error)', borderColor: 'var(--accent-error)', minWidth: 200 }}>
              {t('abstraction.incorrect')}
            </BigButton>
          </div>
        )}
      </div>
    </AssessmentLayout>
  );
};
