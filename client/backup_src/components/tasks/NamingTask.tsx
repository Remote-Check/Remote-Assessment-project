import React, { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { BigButton } from '../layout/BigButton';
import { ListenButton } from '../layout/ListenButton';
import { MocaArt } from '../../assets/drawings/MocaArt';

interface Props {
  onComplete: (answers: (string | null)[]) => void;
}

export const NamingTask: React.FC<Props> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);
  const [playing, setPlaying] = useState(false);

  const items = [
    { id: 'lion',  name: 'אריה',  Art: MocaArt.Lion,   options: ['כלב', 'אריה', 'חתול', 'נמר'] },
    { id: 'rhino', name: 'קרנף',  Art: MocaArt.Rhino,  options: ['פיל', 'סוס', 'קרנף', 'פרה'] },
    { id: 'camel', name: 'גמל',   Art: MocaArt.Camel,  options: ['סוס', 'חמור', 'ג׳ירפה', 'גמל'] },
  ];

  const item = items[current];
  const answered = answers[current] != null;
  const correct = answered && answers[current] === item.name;

  const selectAnswer = (opt: string) => {
    const next = [...answers];
    next[current] = opt;
    setAnswers(next);
  };

  const goNext = () => {
    if (current < items.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete && onComplete(answers);
    }
  };

  return (
    <div className="naming-task" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Task header with listen button */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1.25rem', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--ink-500)',
            marginBottom: '0.375rem',
          }}>
            משימת שיום · פריט {current + 1} מתוך 3
          </div>
          <h2 style={{
            fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.015em',
            margin: 0
          }}>
            מה שם החיה בתמונה?
          </h2>
        </div>
        <ListenButton playing={playing} onClick={() => setPlaying(p => !p)} size="lg"/>
      </div>

      {/* Progress pips */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {items.map((it, i) => (
          <div key={it.id} style={{
            width: i === current ? '3rem' : '2rem', height: '0.5rem', borderRadius: '0.25rem',
            background: answers[i] != null
              ? (answers[i] === it.name ? 'var(--accent-success)' : 'var(--ink-700)')
              : (i === current ? 'var(--ink-900)' : 'var(--ink-200)'),
            transition: 'all 200ms var(--ease)',
          }}/>
        ))}
      </div>

      {/* Stimulus card */}
      <div style={{
        background: '#fff',
        border: '2px solid var(--ink-900)',
        borderRadius: 'var(--r-xl)',
        padding: '3rem 3rem 2rem',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem',
        alignItems: 'center',
        minHeight: 420,
      }}>
        {/* Drawing */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
          background: 'var(--bg-color)',
          borderRadius: 'var(--r-lg)',
        }}>
          <item.Art width={360}/>
        </div>

        {/* Answer options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            fontSize: '1.0625rem', fontWeight: 600, color: 'var(--ink-500)',
            marginBottom: '0.25rem',
          }}>
            בחר תשובה, או אמור את השם בקול רם
          </div>
          {item.options.map((opt) => {
            const selected = answers[current] === opt;
            const isItemAnswered = answers[current] != null;
            const isCorrect = isItemAnswered && opt === item.name;
            const isWrong = isItemAnswered && selected && !correct;
            
            return (
              <button key={opt}
                onClick={() => !isItemAnswered && selectAnswer(opt)}
                disabled={isItemAnswered}
                style={{
                  minHeight: 72, padding: '0 1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', fontSize: '1.5rem', fontWeight: 600,
                  background: isCorrect ? '#ecfdf5'
                            : isWrong ? '#fef2f2'
                            : selected ? 'var(--ink-900)'
                            : '#fff',
                  color: isCorrect ? 'var(--accent-success)'
                       : isWrong ? 'var(--accent-error)'
                       : selected ? '#fff' : 'var(--ink-900)',
                  border: `2px solid ${
                    isCorrect ? 'var(--accent-success)' :
                    isWrong ? 'var(--accent-error)' :
                    selected ? 'var(--ink-900)' : 'var(--border-color)'
                  }`,
                  borderRadius: 'var(--r-lg)',
                  cursor: isItemAnswered ? 'default' : 'pointer',
                  transition: 'all 160ms var(--ease)',
                  textAlign: 'right',
                }}>
                <span>{opt}</span>
                {isCorrect && <Check size={28} data-testid="check-icon" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <BigButton variant={answered ? 'primary' : 'secondary'}
                   disabled={!answered} onClick={goNext}
                   iconEnd={<ArrowLeft size={24}/>}
                   style={{ minWidth: 260 }}>
          {current < items.length - 1 ? 'לפריט הבא' : 'סיים משימה'}
        </BigButton>
      </div>
    </div>
  );
};
