import React from 'react';

interface Props {
  size?: number;
}

export const BrandMark: React.FC<Props> = ({ size = 28 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
           xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#000"/>
        <path d="M10 16 L 14 20 L 22 12" stroke="#fff" strokeWidth="2.8"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="23" cy="9" r="2" fill="#fff"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: 'var(--text-color)' }}>Remote Check</span>
        <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
          הערכה נוירופסיכולוגית
        </span>
      </div>
    </div>
  );
};
