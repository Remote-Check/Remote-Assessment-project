import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { InstructionBox } from '../layout/InstructionBox';
import { Delete, Check } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
}

export const Serial7sTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'instructions' | 'active'>('instructions');
  const [step, setStep] = useState(1);
  const [prevValue, setPrevValue] = useState(100);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const handleKeyPress = (num: string) => {
    setUserInput((prev) => [...prev, num]);
  };

  const handleClear = () => setUserInput([]);

  const handleSubmit = () => {
    const value = parseInt(userInput.join(''));
    const isCorrect = value === prevValue - 7;
    const currentResult = { step, userInput: value, isCorrect };
    const newResults = [...results, currentResult];
    
    setResults(newResults);
    
    if (step < 5) {
      setStep(step + 1);
      setPrevValue(value);
      setUserInput([]);
    } else {
      onComplete(newResults);
    }
  };

  return (
    <AssessmentLayout
      title={t('attention.serial_7s_title')}
      subtitle={`חיסור ${step} מתוך 5`}
      onNext={phase === 'instructions' ? () => setPhase('active') : undefined}
      hideBack={phase !== 'instructions'}
    >
      {phase === 'instructions' && (
        <InstructionBox
          title={t('attention.serial_7s_title')}
          steps={[t('attention.serial_7s_instr')]}
        />
      )}

      {phase === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, textAlign: 'center' }}>
            {step === 1 ? t('attention.serial_7s_prompt') : t('attention.serial_7s_next_prompt', { prev: prevValue })}
          </div>

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
