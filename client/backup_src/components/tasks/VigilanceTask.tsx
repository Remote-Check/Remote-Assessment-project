import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { InstructionBox } from '../layout/InstructionBox';

interface Props {
  onComplete: (data: any) => void;
}

const SEQUENCE = 'פבאכלנאאבמואאבאפר אב א מ ו פ א א ב'.replace(/\s/g, '').split('');

export const VigilanceTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'instructions' | 'active'>('instructions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taps, setTaps] = useState<number[]>([]); // Indices of letters where user tapped

  useEffect(() => {
    if (phase === 'active') {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < SEQUENCE.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            // End task
            const results = {
              sequence: SEQUENCE,
              taps,
              score: calculateScore(SEQUENCE, taps)
            };
            onComplete(results);
            return prev;
          }
        });
      }, 1000); // 1 letter per second
      return () => clearInterval(timer);
    }
  }, [phase, taps, onComplete]);

  const handleTap = () => {
    if (phase === 'active') {
      setTaps((prev) => [...prev, currentIndex]);
    }
  };

  const calculateScore = (seq: string[], taps: number[]) => {
    let errors = 0;
    seq.forEach((char, idx) => {
      const isTarget = char === 'א';
      const didTap = taps.includes(idx);
      if ((isTarget && !didTap) || (!isTarget && didTap)) {
        errors++;
      }
    });
    return errors <= 1 ? 1 : 0; // 1 point if 0 or 1 errors
  };

  return (
    <AssessmentLayout
      title={t('attention.vigilance_title')}
      onNext={phase === 'instructions' ? () => setPhase('active') : undefined}
      hideBack={phase !== 'instructions'}
    >
      {phase === 'instructions' && (
        <InstructionBox
          title={t('attention.vigilance_title')}
          steps={[t('attention.vigilance_instr')]}
        />
      )}

      {phase === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64, padding: '40px 0' }}>
          <div style={{
            fontSize: '120px',
            fontWeight: 800,
            minHeight: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-color)'
          }}>
            {SEQUENCE[currentIndex]}
          </div>

          <button
            onClick={handleTap}
            className="btn btn-primary"
            style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              fontSize: 'var(--fs-2xl)',
              fontWeight: 800,
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              transition: 'transform 0.1s'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {t('attention.vigilance_tap_btn')}
          </button>
        </div>
      )}
    </AssessmentLayout>
  );
};
