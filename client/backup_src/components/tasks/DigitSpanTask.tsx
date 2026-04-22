import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { InstructionBox } from '../layout/InstructionBox';
import { Delete, Check } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
}

const FORWARD_SEQUENCE = ['2', '1', '8', '5', '4'];
const BACKWARD_SEQUENCE = ['7', '4', '2'];

export const DigitSpanTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'forward' | 'backward'>('forward');
  const [phase, setPhase] = useState<'instructions' | 'display' | 'keypad'>('instructions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});

  const activeSequence = mode === 'forward' ? FORWARD_SEQUENCE : BACKWARD_SEQUENCE;

  useEffect(() => {
    if (phase === 'display') {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < activeSequence.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            setPhase('keypad');
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, activeSequence]);

  const handleKeyPress = (num: string) => {
    setUserInput((prev) => [...prev, num]);
  };

  const handleClear = () => setUserInput([]);

  const handleSubmit = () => {
    const isCorrect = userInput.join('') === (mode === 'forward' ? activeSequence.join('') : [...activeSequence].reverse().join(''));
    const newResults = { ...results, [mode]: { userInput, isCorrect } };
    setResults(newResults);

    if (mode === 'forward') {
      setMode('backward');
      setPhase('instructions');
      setUserInput([]);
    } else {
      onComplete(newResults);
    }
  };

  return (
    <AssessmentLayout
      title={t('attention.digit_span_title')}
      subtitle={mode === 'forward' ? 'קדימה' : 'אחורה'}
      onNext={phase === 'instructions' ? () => setPhase('display') : undefined}
      hideBack={phase !== 'instructions'}
    >
      {phase === 'instructions' && (
        <InstructionBox
          title={t('attention.digit_span_title')}
          steps={[mode === 'forward' ? t('attention.digit_span_forward_instr') : t('attention.digit_span_backward_instr')]}
        />
      )}

      {phase === 'display' && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          fontSize: 'var(--fs-4xl)',
          fontWeight: 800
        }}>
          {activeSequence[currentIndex]}
        </div>
      )}

      {phase === 'keypad' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{
            minHeight: 80,
            width: '100%',
            maxWidth: 400,
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--fs-2xl)',
            fontWeight: 800,
            letterSpacing: '0.5em',
            background: 'var(--ink-50)'
          }}>
            {userInput.join('')}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            width: '100%',
            maxWidth: 400
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="btn btn-secondary"
                style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}
              >
                {num}
              </button>
            ))}
            <button onClick={handleClear} className="btn btn-secondary" style={{ background: '#fef2f2', color: 'var(--accent-error)' }} aria-label={t('attention.keypad_clear')}>
              <Delete size={24} />
            </button>
            <button onClick={handleSubmit} className="btn btn-primary" style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)' }} aria-label={t('attention.keypad_submit')}>
              <Check size={24} />
            </button>
          </div>
        </div>
      )}
    </AssessmentLayout>
  );
};
