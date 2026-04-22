import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { InstructionBox } from '../layout/InstructionBox';
import { BigButton } from '../layout/BigButton';
import { Plus, Minus } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
}

export const LanguageTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'rep1' | 'rep2' | 'fluency_instr' | 'fluency_active' | 'fluency_result'>('rep1');
  const [timer, setTimer] = useState(60);
  const [wordCount, setWordCount] = useState(0);
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 'fluency_active') {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setPhase('fluency_result');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const handleRepetition = (isCorrect: boolean) => {
    const currentResults = { ...results, [phase]: isCorrect };
    setResults(currentResults);
    if (phase === 'rep1') setPhase('rep2');
    else setPhase('fluency_instr');
  };

  const handleFinish = () => {
    onComplete({ ...results, fluencyCount: wordCount });
  };

  return (
    <AssessmentLayout
      title={t('language.title')}
      onNext={phase === 'fluency_instr' ? () => setPhase('fluency_active') : (phase === 'fluency_result' ? handleFinish : undefined)}
      nextLabel={phase === 'fluency_instr' ? t('language.start_timer') : (phase === 'fluency_result' ? t('common.finish') : undefined)}
    >
      {(phase === 'rep1' || phase === 'rep2') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <InstructionBox
            title={t('language.title')}
            steps={[t('language.rep_instr')]}
          />
          <div style={{
            padding: 40,
            background: 'var(--ink-50)',
            borderRadius: 'var(--r-lg)',
            textAlign: 'center',
            fontSize: 'var(--fs-2xl)',
            fontWeight: 700
          }}>
            {t(phase === 'rep1' ? 'language.s1' : 'language.s2')}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <BigButton variant="primary" onClick={() => handleRepetition(true)} style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)' }}>
              {t('language.correct')}
            </BigButton>
            <BigButton variant="secondary" onClick={() => handleRepetition(false)} style={{ color: 'var(--accent-error)', borderColor: 'var(--accent-error)' }}>
              {t('language.incorrect')}
            </BigButton>
          </div>
        </div>
      )}

      {phase === 'fluency_instr' && (
        <InstructionBox
          title={t('language.title')}
          steps={[t('language.fluency_instr')]}
        />
      )}

      {phase === 'fluency_active' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
          <div style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '8px solid var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--fs-4xl)',
            fontWeight: 800
          }}>
            {timer}
          </div>
          <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 600 }}>{t('language.fluency_instr')}</div>
        </div>
      )}

      {phase === 'fluency_result' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <h3 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>{t('language.words_count')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <button
              aria-label="decrement"
              onClick={() => setWordCount(Math.max(0, wordCount - 1))}
              className="btn btn-secondary"
              style={{ width: 80, height: 80, borderRadius: '50%' }}
            >
              <Minus size={32} />
            </button>
            <div style={{ fontSize: 'var(--fs-4xl)', fontWeight: 800, minWidth: 100, textAlign: 'center' }}>
              {wordCount}
            </div>
            <button
              aria-label="increment"
              onClick={() => setWordCount(wordCount + 1)}
              className="btn btn-secondary"
              style={{ width: 80, height: 80, borderRadius: '50%' }}
            >
              <Plus size={32} />
            </button>
          </div>
        </div>
      )}
    </AssessmentLayout>
  );
};
