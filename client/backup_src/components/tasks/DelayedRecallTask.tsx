import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';
import { Check } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
}

const WORDS = ['memory.word1', 'memory.word2', 'memory.word3', 'memory.word4', 'memory.word5'];

export const DelayedRecallTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleToggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  return (
    <AssessmentLayout
      title={t('memory.title')}
      onNext={() => onComplete({ recalled: selectedWords })}
      isLastStep={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <p style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, textAlign: 'center' }}>
          {t('memory.recall_instruction')}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {WORDS.map((w) => {
            const word = t(w);
            const isSelected = selectedWords.includes(word);
            return (
              <button
                key={w}
                onClick={() => handleToggleWord(word)}
                style={{
                  padding: '32px 24px',
                  fontSize: 'var(--fs-xl)',
                  fontWeight: 700,
                  borderRadius: 'var(--r-lg)',
                  border: `2px solid ${isSelected ? 'var(--accent-success)' : 'var(--border-color)'}`,
                  background: isSelected ? '#ecfdf5' : '#fff',
                  color: isSelected ? 'var(--accent-success)' : 'var(--text-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 160ms var(--ease)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                }}
              >
                <span>{word}</span>
                {isSelected && <Check size={28} />}
              </button>
            );
          })}
        </div>
      </div>
    </AssessmentLayout>
  );
};
