import React from 'react';
import { Volume2 } from 'lucide-react';

interface Props {
  label?: string;
  playing?: boolean;
  onClick?: () => void;
  size?: 'md' | 'lg';
}

const AudioBars: React.FC = () => {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <g fill="currentColor">
        {[4, 8, 12, 16].map((x, i) => (
          <rect key={x} x={x - 1.5} width="3" rx="1.5">
            <animate attributeName="height" dur={`${0.6 + i * 0.15}s`}
                     values="4;14;4" repeatCount="indefinite"/>
            <animate attributeName="y" dur={`${0.6 + i * 0.15}s`}
                     values="9;4;9" repeatCount="indefinite"/>
          </rect>
        ))}
      </g>
    </svg>
  );
};

export const ListenButton: React.FC<Props> = ({ label = 'השמע הוראות', playing, onClick, size = 'md' }) => {
  const big = size === 'lg';
  return (
    <button onClick={onClick} className="btn"
      style={{
        background: playing ? 'var(--ink-900)' : 'var(--secondary-color)',
        color: playing ? '#fff' : 'var(--ink-900)',
        border: `2px solid ${playing ? 'var(--ink-900)' : 'var(--border-color)'}`,
        borderRadius: 'var(--r-full)',
        padding: big ? '0 28px' : '0 20px',
        minHeight: big ? 64 : 52,
        fontSize: big ? 20 : 17,
        fontWeight: 600,
        gap: 12,
        transition: 'all 160ms var(--ease)',
      }}>
      {playing ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <AudioBars />
        </span>
      ) : <Volume2 size={big ? 28 : 22}/>}
      <span>{playing ? 'משמיע…' : label}</span>
    </button>
  );
};
