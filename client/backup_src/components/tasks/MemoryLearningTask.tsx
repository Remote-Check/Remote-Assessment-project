import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { InstructionBox } from '../layout/InstructionBox';
import { Check } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
}

const WORDS = ['memory.word1', 'memory.word2', 'memory.word3', 'memory.word4', 'memory.word5'];

export const MemoryLearningTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setStep] = useState<'instructions' | 'display' | 'recall'>('instructions');
  const [trial, setTrial] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (phase === 'display') {
      const timer = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev < WORDS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            setStep('recall');
            return 0;
          }
        });
      }, 1500); // 1.5s per word for older adults
      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleToggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleNextPhase = () => {
    if (phase === 'instructions') {
      setStep('display');
    } else if (phase === 'recall') {
      const currentTrialResults = { trial, recalled: selectedWords };
      const newResults = [...results, currentTrialResults];
      setResults(newResults);
      
      if (trial < 2) {
        setTrial(trial + 1);
        setSelectedWords([]);
        setStep('instructions');
      } else {
        onComplete(newResults);
      }
    }
  };

  return (
    <AssessmentLayout
      title={t('memory.learning_title')}
      subtitle={t('memory.trial_label', { count: trial })}
      onNext={handleNextPhase}
      hideBack={phase !== 'instructions'}
      isLastStep={trial === 2 && phase === 'recall'}
    >
      {phase === 'instructions' && (
        <InstructionBox
          title={t('memory.learning_title')}
          steps={[t('memory.learning_instructions')]}
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
          {t(WORDS[currentWordIndex])}
        </div>
      )}

      {phase === 'recall' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p style={{ fontSize: 'var(--fs-lg)', fontWeight: 600 }}>{t('memory.recall_instruction')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {WORDS.map((w) => {
              const word = t(w);
              const isSelected = selectedWords.includes(word);
              return (
                <button
                  key={w}
                  onClick={() => handleToggleWord(word)}
                  style={{
                    padding: '24px',
                    fontSize: 'var(--fs-lg)',
                    fontWeight: 700,
                    borderRadius: 'var(--r-md)',
                    border: `2px solid ${isSelected ? 'var(--accent-success)' : 'var(--border-color)'}`,
                    background: isSelected ? '#ecfdf5' : '#fff',
                    color: isSelected ? 'var(--accent-success)' : 'var(--text-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {word}
                  {isSelected && <Check size={24} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </AssessmentLayout>
  );
};
