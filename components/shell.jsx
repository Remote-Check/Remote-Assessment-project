// Shared shell, buttons, and assessment-level primitives.

const { useState, useRef, useEffect, useMemo, useCallback } = React;

// === Brand lockup ===
function BrandMark({ size = 28 }) {
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
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>Remote Check</span>
        <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
          הערכה נוירופסיכולוגית
        </span>
      </div>
    </div>
  );
}

// === Large primary / secondary buttons ===
function BigButton({ variant = 'primary', children, onClick, icon, iconEnd, disabled, style }) {
  const cls = `btn btn-lg btn-${variant}${disabled ? ' btn-disabled' : ''}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {icon}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
}

// === AssessmentLayout ===
// Persistent shell: header (test title + progress) + main + footer (Back / Next)
function AssessmentLayout({
  title, subtitle, progress, step, totalSteps,
  onBack, onNext, nextLabel = 'המשך', backLabel = 'חזרה',
  nextDisabled, hideBack, children,
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: 'var(--bg-color)',
    }}>
      {/* HEADER */}
      <header style={{
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 32, background: '#fff',
      }}>
        <BrandMark />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, letterSpacing: '-0.01em' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 15, color: 'var(--ink-500)', marginTop: 2 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ minWidth: 160, textAlign: 'left', direction: 'ltr' }}>
          {step != null && totalSteps != null && (
            <div style={{
              fontSize: 15, color: 'var(--ink-500)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              שלב {step} מתוך {totalSteps}
            </div>
          )}
        </div>
      </header>

      {/* PROGRESS BAR */}
      {progress != null && (
        <div style={{ height: 4, background: 'var(--ink-100)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, height: '100%',
            width: `${progress * 100}%`,
            background: 'var(--primary-color)',
            transition: 'width var(--dur-slow) var(--ease)',
          }}/>
        </div>
      )}

      {/* MAIN */}
      <main style={{ flex: 1, padding: '48px 40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        padding: '20px 40px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, background: '#fff',
      }}>
        {!hideBack ? (
          <BigButton variant="secondary" onClick={onBack} icon={<Icon.ArrowRight size={24}/>}>
            {backLabel}
          </BigButton>
        ) : <div/>}
        <BigButton variant="primary" onClick={onNext} disabled={nextDisabled}
                   iconEnd={<Icon.ArrowLeft size={24}/>}>
          {nextLabel}
        </BigButton>
      </footer>
    </div>
  );
}

// === Audio "Listen" button ===
function ListenButton({ label = 'השמע הוראות', playing, onClick, size = 'md' }) {
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
      ) : <Icon.Speaker size={big ? 28 : 22}/>}
      <span>{playing ? 'משמיע…' : label}</span>
    </button>
  );
}

function AudioBars() {
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
}

Object.assign(window, {
  BrandMark, BigButton, AssessmentLayout, ListenButton, AudioBars,
});
