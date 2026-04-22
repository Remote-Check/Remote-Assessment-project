
// ===== components/icons.jsx =====
// Icons — simple, professional line icons. stroke-based, high contrast.
// All icons inherit currentColor.

const Icon = {
  Speaker: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M15.5 8.5a5 5 0 010 7"/>
      <path d="M18.5 5.5a9 9 0 010 13"/>
    </svg>
  ),
  Play: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  Pause: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>
    </svg>
  ),
  ArrowRight: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  ArrowLeft: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 18l-6-6 6-6"/>
    </svg>
  ),
  Undo: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14L4 9l5-5"/>
      <path d="M4 9h11a5 5 0 015 5v2"/>
    </svg>
  ),
  Trash: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    </svg>
  ),
  Check: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7"/>
    </svg>
  ),
  Download: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>
    </svg>
  ),
  Search: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M20 20l-3.5-3.5"/>
    </svg>
  ),
  User: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
    </svg>
  ),
  Clock: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  ),
  Grid: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  Chart: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>
    </svg>
  ),
  Settings: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>
    </svg>
  ),
  Eye: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  File: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 2v6h6"/>
    </svg>
  ),
  ChevronLeft: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6"/>
    </svg>
  ),
  ChevronRight: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6"/>
    </svg>
  ),
  Info: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-5M12 8h0"/>
    </svg>
  ),
  Sparkle: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
    </svg>
  ),
};

window.Icon = Icon;


// ===== components/moca-art.jsx =====
// MoCA-style line art — canonical black-and-white animal drawings.
// Matches MoCA convention: side profile, simple line work, high contrast.
// These are placeholders modeled on the MoCA style but must be replaced
// with the official licensed MoCA assets in production.

const MocaArt = {
  // Lion (אריה) — male lion, side profile, mane
  Lion: ({ width = 320 }) => (
    <svg viewBox="0 0 320 240" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }} aria-label="אריה">
      <g fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Mane — outer tufted halo */}
        <path d="M82 118 C 72 106, 60 96, 56 82 C 58 94, 52 102, 44 112
                 C 54 116, 50 128, 44 138 C 54 140, 52 152, 46 164
                 C 58 162, 58 174, 54 186 C 68 180, 74 190, 76 202
                 C 84 192, 96 196, 104 204 C 108 192, 120 190, 130 198
                 C 130 184, 142 178, 152 184" />
        {/* Mane — top */}
        <path d="M82 118 C 86 100, 102 86, 122 82 C 140 78, 160 82, 172 94" />
        {/* Face outline */}
        <path d="M172 94 C 192 92, 210 98, 222 112 C 232 124, 236 138, 234 152
                 C 232 168, 224 180, 212 188 C 200 196, 184 198, 170 194
                 C 156 190, 146 180, 140 168" />
        {/* Lower jaw/chin */}
        <path d="M140 168 C 134 172, 128 178, 128 186 C 130 194, 140 198, 150 196" />
        {/* Cheek / mane inner border */}
        <path d="M140 168 C 130 158, 122 148, 118 136" />
        <path d="M118 136 C 108 140, 98 136, 92 128" />
        {/* Ear */}
        <path d="M196 96 C 198 86, 206 80, 214 82 C 218 86, 218 94, 212 100" />
        <path d="M204 92 C 206 88, 210 88, 212 92" />
        {/* Eye */}
        <ellipse cx="198" cy="128" rx="5" ry="3.5" fill="#000" stroke="none"/>
        <path d="M190 124 C 195 120, 203 120, 208 124" />
        {/* Nose */}
        <path d="M220 148 C 226 150, 228 156, 224 160 C 220 162, 214 160, 214 156 Z" fill="#000"/>
        {/* Muzzle */}
        <path d="M214 156 C 208 164, 200 170, 192 170" />
        <path d="M192 170 C 196 176, 204 178, 210 174" />
        {/* Mouth */}
        <path d="M196 176 C 200 180, 206 180, 210 176" />
        {/* Whisker dots */}
        <circle cx="200" cy="166" r="0.9" fill="#000"/>
        <circle cx="204" cy="168" r="0.9" fill="#000"/>
        <circle cx="208" cy="168" r="0.9" fill="#000"/>
        {/* Body suggestion — back line */}
        <path d="M234 152 C 252 156, 270 162, 282 176 C 290 186, 290 200, 282 210
                 C 270 220, 250 222, 232 218" />
        {/* Paw */}
        <path d="M150 196 C 148 210, 148 222, 152 230 L 176 230
                 M 158 230 L 158 222 M 166 230 L 166 222 M 174 230 L 174 222" />
        {/* Tail tuft suggestion */}
        <path d="M286 188 C 296 192, 304 200, 302 212 C 298 218, 290 220, 286 214" />
        {/* Mane radiating lines for texture */}
        <path d="M70 110 L 64 106 M 60 124 L 52 124 M 60 144 L 52 148
                 M 66 166 L 60 170 M 80 184 L 76 192
                 M 112 198 L 110 206" />
      </g>
    </svg>
  ),

  // Rhinoceros (קרנף) — side profile, two-horn
  Rhino: ({ width = 320 }) => (
    <svg viewBox="0 0 320 240" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }} aria-label="קרנף">
      <g fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Body — chunky oval */}
        <path d="M60 160 C 50 140, 54 118, 74 108 C 96 100, 124 100, 150 108
                 L 178 112 C 196 112, 208 108, 218 102
                 L 228 110 C 232 118, 236 128, 240 136
                 C 252 138, 262 144, 268 154 C 274 166, 272 180, 264 190
                 C 252 200, 236 200, 224 192
                 L 218 196
                 C 200 202, 180 204, 160 202 L 90 198
                 C 76 196, 64 184, 60 172 Z" />
        {/* Head/face separation line */}
        <path d="M218 102 C 214 120, 212 134, 214 148 C 218 160, 226 166, 236 166" />
        {/* Front horn — large */}
        <path d="M212 108 C 216 92, 224 80, 238 74
                 C 242 82, 244 92, 240 104 C 234 112, 226 116, 218 116" />
        {/* Back horn — smaller */}
        <path d="M196 104 C 198 94, 204 86, 212 84 C 214 92, 212 100, 206 106" />
        {/* Eye */}
        <circle cx="202" cy="124" r="2.4" fill="#000" stroke="none"/>
        <path d="M196 120 C 200 118, 204 118, 208 120" />
        {/* Ear */}
        <path d="M182 98 C 180 86, 184 78, 192 78 C 196 84, 196 94, 192 100" />
        {/* Mouth / jaw line */}
        <path d="M232 146 C 238 150, 244 150, 250 148" />
        <path d="M236 158 C 242 160, 246 158, 250 154" />
        {/* Skin folds — signature rhino */}
        <path d="M88 122 C 108 120, 130 120, 150 124" />
        <path d="M94 140 C 118 138, 142 138, 164 142" />
        <path d="M102 160 C 124 158, 148 158, 170 160" />
        {/* Leg detail */}
        <path d="M84 198 L 84 218 M 100 198 L 100 220 M 200 200 L 200 218 M 220 196 L 220 218" />
        <path d="M74 218 L 96 218 M 90 220 L 112 220 M 190 218 L 212 218 M 210 218 L 232 218" />
        {/* Feet nails */}
        <path d="M78 218 L 78 214 M 86 218 L 86 214 M 94 218 L 94 214
                 M 94 220 L 94 216 M 102 220 L 102 216 M 110 220 L 110 216
                 M 194 218 L 194 214 M 202 218 L 202 214 M 210 218 L 210 214
                 M 214 218 L 214 214 M 222 218 L 222 214 M 230 218 L 230 214" />
        {/* Tail */}
        <path d="M60 160 C 50 158, 42 164, 40 174 C 44 180, 52 178, 56 172" />
        {/* Chest/belly fold */}
        <path d="M70 178 C 86 180, 104 178, 118 174" />
      </g>
    </svg>
  ),

  // Camel (גמל) — dromedary, one hump, side profile
  Camel: ({ width = 320 }) => (
    <svg viewBox="0 0 320 240" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }} aria-label="גמל">
      <g fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Hump + back */}
        <path d="M80 126 C 96 92, 124 70, 152 72 C 176 74, 192 92, 196 116
                 C 200 118, 210 122, 216 130" />
        {/* Neck up */}
        <path d="M216 130 C 228 108, 240 88, 252 74" />
        {/* Head */}
        <path d="M252 74 C 260 66, 272 62, 282 66 C 290 70, 294 80, 290 90
                 C 286 96, 278 98, 272 96" />
        {/* Lower jaw + mouth */}
        <path d="M272 96 C 268 98, 260 98, 252 92" />
        <path d="M252 92 C 254 86, 254 80, 252 74" />
        {/* Mouth split */}
        <path d="M276 92 C 280 92, 284 92, 286 90" />
        {/* Nostril */}
        <path d="M286 76 C 284 74, 280 74, 278 76" />
        {/* Eye */}
        <circle cx="272" cy="80" r="1.8" fill="#000" stroke="none"/>
        {/* Ear */}
        <path d="M262 66 C 258 60, 260 54, 266 54 C 270 58, 270 64, 266 68" />
        {/* Neck down (front) */}
        <path d="M252 92 C 240 114, 232 132, 226 152" />
        <path d="M226 152 C 224 164, 224 176, 228 188" />
        {/* Body underline */}
        <path d="M228 188 L 228 208" />
        {/* Back leg (front) */}
        <path d="M216 130 C 220 152, 222 172, 220 188 L 220 208" />
        {/* Belly */}
        <path d="M220 188 L 140 192" />
        {/* Back legs (rear) */}
        <path d="M140 192 L 140 208 M 124 192 L 124 208" />
        {/* Rear body */}
        <path d="M80 126 C 72 140, 68 160, 72 180 C 76 188, 84 192, 92 192" />
        <path d="M92 192 L 92 208 M 76 180 L 76 208" />
        {/* Tail */}
        <path d="M72 180 C 64 182, 58 186, 58 194 C 62 198, 68 196, 70 192" />
        {/* Hooves — split toe */}
        <g>
          {[76, 92, 124, 140, 220, 228].map((x, i) => (
            <g key={i}>
              <path d={`M${x-5} 208 L ${x+5} 208 L ${x+6} 212 L ${x-6} 212 Z`} />
              <path d={`M${x} 208 L ${x} 212`} />
            </g>
          ))}
        </g>
        {/* Mane hair on neck */}
        <path d="M240 104 C 244 108, 244 112, 242 114
                 M 232 122 C 236 124, 236 128, 234 130
                 M 226 138 C 228 140, 228 144, 226 146" />
        {/* Hump crease */}
        <path d="M120 88 C 128 92, 140 92, 148 90" />
      </g>
    </svg>
  ),
};

window.MocaArt = MocaArt;


// ===== components/shell.jsx =====
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


// ===== components/instruction-box.jsx =====
// Three Instruction Box variants, each fully usable.
// Variant A — "Clinical card": restrained, heavy weight, thick left rule
// Variant B — "Paper card": warm off-white, soft shadow, pulsing listen button
// Variant C — "Focus spotlight": large full-width, centered, numbered steps

function InstructionBox_Clinical({ title, steps, onListen, playing, example }) {
  return (
    <div style={{
      background: '#fff',
      border: '2px solid var(--ink-900)',
      borderRadius: 'var(--r-lg)',
      padding: '32px 36px',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
      alignItems: 'start',
    }}>
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-500)',
          marginBottom: 12,
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ink-900)' }}/>
          הוראות
        </div>
        <h2 style={{
          fontSize: 28, fontWeight: 800, lineHeight: 1.25,
          letterSpacing: '-0.01em', marginBottom: 16,
        }}>{title}</h2>
        <ol style={{
          listStyle: 'none', counterReset: 'step',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {steps.map((s, i) => (
            <li key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              fontSize: 20, lineHeight: 1.5,
            }}>
              <span style={{
                flexShrink: 0,
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--ink-900)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 16, marginTop: 2,
                fontVariantNumeric: 'tabular-nums',
              }}>{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {example && (
          <div style={{
            marginTop: 20, padding: '16px 20px',
            background: 'var(--secondary-color)',
            borderRadius: 'var(--r-md)',
            fontSize: 18, color: 'var(--ink-700)',
            borderRight: '4px solid var(--ink-900)',
          }}>
            <strong style={{ fontWeight: 700 }}>דוגמה: </strong>{example}
          </div>
        )}
      </div>
      <ListenButton playing={playing} onClick={onListen} size="lg"/>
    </div>
  );
}

function InstructionBox_Paper({ title, steps, onListen, playing, example }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #fdfcf9 0%, #faf8f3 100%)',
      border: '1px solid #e8e2d3',
      borderRadius: 'var(--r-xl)',
      padding: '36px 40px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 20px 40px -24px rgba(0,0,0,0.12)',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 20, marginBottom: 20,
      }}>
        <h2 style={{
          fontSize: 30, fontWeight: 700, lineHeight: 1.2,
          letterSpacing: '-0.015em',
        }}>{title}</h2>
        <ListenButton playing={playing} onClick={onListen} size="lg"/>
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 14,
        fontSize: 21, lineHeight: 1.55, color: 'var(--ink-800)',
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', gap: 16, alignItems: 'baseline',
            paddingBottom: 14,
            borderBottom: i < steps.length - 1 ? '1px dashed #d8d1bf' : 'none',
          }}>
            <span style={{
              fontSize: 36, fontWeight: 300, color: '#c9b790',
              fontFamily: 'Georgia, serif', lineHeight: 1, minWidth: 32,
            }}>{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      {example && (
        <div style={{
          marginTop: 20, fontSize: 17, color: 'var(--ink-700)',
          fontStyle: 'italic',
        }}>
          למשל — {example}
        </div>
      )}
    </div>
  );
}

function InstructionBox_Focus({ title, steps, onListen, playing, example }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border-color)',
      borderRadius: 'var(--r-lg)', padding: '40px 48px',
      textAlign: 'center', maxWidth: 820, margin: '0 auto',
    }}>
      <div style={{
        fontSize: 13, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--ink-500)',
        marginBottom: 20,
      }}>הוראות למשימה</div>
      <h2 style={{
        fontSize: 38, fontWeight: 800, lineHeight: 1.2,
        letterSpacing: '-0.02em', marginBottom: 32,
      }}>{title}</h2>
      <ol style={{
        listStyle: 'none', display: 'flex', flexDirection: 'column',
        gap: 20, marginBottom: 32, textAlign: 'right',
      }}>
        {steps.map((s, i) => (
          <li key={i} style={{
            display: 'grid', gridTemplateColumns: '48px 1fr', gap: 20,
            alignItems: 'center', fontSize: 22, lineHeight: 1.45,
            padding: '12px 16px',
            background: i === 0 ? 'var(--secondary-color)' : 'transparent',
            borderRadius: 'var(--r-md)',
          }}>
            <span style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '2px solid var(--ink-900)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 22,
              fontVariantNumeric: 'tabular-nums',
            }}>{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <ListenButton playing={playing} onClick={onListen} size="lg"/>
      {example && (
        <div style={{
          marginTop: 24, fontSize: 17, color: 'var(--ink-500)',
        }}>{example}</div>
      )}
    </div>
  );
}

window.InstructionBox = {
  Clinical: InstructionBox_Clinical,
  Paper: InstructionBox_Paper,
  Focus: InstructionBox_Focus,
};


// ===== components/naming-task.jsx =====
// Naming Task — patient sees 3 animal line drawings, taps to name them.
// Interaction model: patient speaks the name (audio captured), or in this
// prototype, clinician taps the answer. Shows confirmation state.

function NamingTask({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([null, null, null]);
  const [playing, setPlaying] = useState(false);

  const items = [
    { id: 'lion',  name: 'אריה',  Art: MocaArt.Lion,   options: ['כלב', 'אריה', 'חתול', 'נמר'] },
    { id: 'rhino', name: 'קרנף',  Art: MocaArt.Rhino,  options: ['פיל', 'סוס', 'קרנף', 'פרה'] },
    { id: 'camel', name: 'גמל',   Art: MocaArt.Camel,  options: ['סוס', 'חמור', 'ג׳ירפה', 'גמל'] },
  ];

  const item = items[current];
  const answered = answers[current] != null;
  const correct = answered && answers[current] === item.name;

  const selectAnswer = (opt) => {
    const next = [...answers];
    next[current] = opt;
    setAnswers(next);
  };

  const goNext = () => {
    if (current < items.length - 1) setCurrent(current + 1);
    else onComplete && onComplete(answers);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Task header with listen button */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--ink-500)',
            marginBottom: 6,
          }}>משימת שיום · פריט {current + 1} מתוך 3</div>
          <h2 style={{
            fontSize: 32, fontWeight: 800, letterSpacing: '-0.015em',
          }}>מה שם החיה בתמונה?</h2>
        </div>
        <ListenButton playing={playing} onClick={() => setPlaying(p => !p)} size="lg"/>
      </div>

      {/* Progress pips */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {items.map((it, i) => (
          <div key={it.id} style={{
            width: i === current ? 48 : 32, height: 8, borderRadius: 4,
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
        padding: '48px 48px 32px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        alignItems: 'center',
        minHeight: 420,
      }}>
        {/* Drawing */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
          background: 'var(--bg-color)',
          borderRadius: 'var(--r-lg)',
        }}>
          <item.Art width={360}/>
        </div>

        {/* Answer options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            fontSize: 17, fontWeight: 600, color: 'var(--ink-500)',
            marginBottom: 4,
          }}>בחר תשובה, או אמור את השם בקול רם</div>
          {item.options.map((opt) => {
            const selected = answers[current] === opt;
            const isCorrect = answered && opt === item.name;
            const isWrong = answered && selected && !correct;
            return (
              <button key={opt}
                onClick={() => !answered && selectAnswer(opt)}
                disabled={answered}
                style={{
                  minHeight: 72, padding: '0 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 16, fontSize: 24, fontWeight: 600,
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
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all 160ms var(--ease)',
                  textAlign: 'right',
                }}>
                <span>{opt}</span>
                {isCorrect && <Icon.Check size={28}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        <BigButton variant={answered ? 'primary' : 'secondary'}
                   disabled={!answered} onClick={goNext}
                   iconEnd={<Icon.ArrowLeft size={24}/>}
                   style={{ minWidth: 260 }}>
          {current < items.length - 1 ? 'לפריט הבא' : 'סיים משימה'}
        </BigButton>
      </div>
    </div>
  );
}

window.NamingTask = NamingTask;


// ===== components/dashboard-list.jsx =====
// Clinician Dashboard — DENSE, data-oriented.
// Structure: sidebar nav · patient list · patient detail (drawings + scoring + stroke analysis + export)

// === Mock data ===
const MOCK_PATIENTS = [
  { id: 'p01', name: 'רחל כהן',      age: 72, sessions: 3, last: 'היום · 09:42',  status: 'חדש',    score: 24, trend: 'down' },
  { id: 'p02', name: 'דוד לוי',      age: 68, sessions: 5, last: 'אתמול · 14:15', status: 'בבדיקה', score: 26, trend: 'flat' },
  { id: 'p03', name: 'מרים אברהם',    age: 81, sessions: 2, last: 'לפני 3 ימים',  status: 'חדש',    score: 19, trend: 'down' },
  { id: 'p04', name: 'יוסף פרידמן',   age: 74, sessions: 8, last: 'לפני שבוע',    status: 'הושלם',  score: 28, trend: 'up' },
  { id: 'p05', name: 'שרה ברקוביץ',   age: 69, sessions: 1, last: 'לפני שבועיים', status: 'חדש',    score: 22, trend: 'flat' },
  { id: 'p06', name: 'אברהם שמיר',    age: 77, sessions: 4, last: 'לפני שבועיים', status: 'הושלם',  score: 25, trend: 'up' },
];

// === Sidebar nav ===
function ClinSidebar({ view, setView }) {
  const items = [
    { k: 'patients', label: 'מטופלים', icon: <Icon.User size={18}/>, badge: '142' },
    { k: 'sessions', label: 'מבחנים אחרונים', icon: <Icon.Clock size={18}/> },
    { k: 'analytics', label: 'ניתוחים',  icon: <Icon.Chart size={18}/> },
    { k: 'library',  label: 'ספריית מבחנים', icon: <Icon.Grid size={18}/> },
  ];
  return (
    <aside style={{
      width: 240, background: '#0a0a0a', color: '#fff',
      display: 'flex', flexDirection: 'column', padding: '20px 12px',
      gap: 20, position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ padding: '4px 10px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect x="2" y="2" width="28" height="28" rx="8" fill="#fff"/>
          <path d="M10 16 L 14 20 L 22 12" stroke="#000" strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="23" cy="9" r="2" fill="#000"/>
        </svg>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Remote Check</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>קונסולת קלינאי</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => (
          <button key={it.k} onClick={() => setView(it.k)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8,
              background: view === it.k ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: view === it.k ? '#fff' : 'rgba(255,255,255,0.6)',
              fontSize: 14, fontWeight: 500, textAlign: 'right',
              transition: 'all 120ms var(--ease)',
            }}>
            {it.icon}
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.badge && <span style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 10,
              background: 'rgba(255,255,255,0.1)', fontVariantNumeric: 'tabular-nums',
            }}>{it.badge}</span>}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }}/>

      <div style={{
        padding: '12px', borderRadius: 8,
        background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#fff', color: '#000', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>ד"ר</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ד"ר אלון שמיר</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>נוירופסיכולוג</div>
        </div>
      </div>
    </aside>
  );
}

// === Patient list ===
function PatientList({ onOpen }) {
  const [q, setQ] = useState('');
  const filtered = MOCK_PATIENTS.filter(p => p.name.includes(q));
  return (
    <div style={{ padding: 28 }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.015em' }}>מטופלים</h1>
          <div style={{ fontSize: 14, color: 'var(--ink-500)', marginTop: 2 }}>
            142 פעילים · 18 דורשים סקירה
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--secondary-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 8, padding: '0 12px', height: 40, minWidth: 260,
          }}>
            <Icon.Search size={16}/>
            <input placeholder="חיפוש לפי שם או מזהה…" value={q}
              onChange={e => setQ(e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: 14, fontFamily: 'inherit',
              }}/>
          </div>
          <button className="btn btn-primary" style={{ minHeight: 40, padding: '0 18px', fontSize: 14 }}>
            + מטופל חדש
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
        marginBottom: 24,
      }}>
        {[
          { label: 'מבחנים השבוע', v: '24', d: '+8 מהשבוע שעבר', trend: 'up' },
          { label: 'ממוצע ציון MoCA', v: '24.3', d: '-0.4 מהחודש', trend: 'down' },
          { label: 'זמן ממוצע', v: '11:42', d: 'תוך טווח', trend: 'flat' },
          { label: 'דורשים סקירה',  v: '18', d: '5 דחופים', trend: 'flat' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid var(--border-color)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 500 }}>{s.label}</div>
            <div style={{
              fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
              marginTop: 4, fontVariantNumeric: 'tabular-nums',
            }}>{s.v}</div>
            <div style={{
              fontSize: 12, color: s.trend === 'up' ? 'var(--accent-success)'
                   : s.trend === 'down' ? 'var(--accent-error)' : 'var(--ink-500)',
              marginTop: 2,
            }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', border: '1px solid var(--border-color)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 80px 90px 1.2fr 110px 100px 60px',
          gap: 12, padding: '12px 20px',
          background: 'var(--ink-50)',
          borderBottom: '1px solid var(--border-color)',
          fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <div>שם מטופל</div>
          <div>גיל</div>
          <div>מבחנים</div>
          <div>פעילות אחרונה</div>
          <div>סטטוס</div>
          <div>ציון MoCA</div>
          <div/>
        </div>
        {filtered.map((p, i) => (
          <button key={p.id} onClick={() => onOpen(p)}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 80px 90px 1.2fr 110px 100px 60px',
              gap: 12, padding: '14px 20px', width: '100%',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border-color)' : 'none',
              textAlign: 'right', fontSize: 14,
              transition: 'background 120ms var(--ease)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ink-50)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--ink-100)', color: 'var(--ink-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13,
              }}>{p.name[0]}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.id.toUpperCase()}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontVariantNumeric: 'tabular-nums' }}>{p.age}</div>
            <div style={{ display: 'flex', alignItems: 'center', fontVariantNumeric: 'tabular-nums' }}>{p.sessions}</div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--ink-700)' }}>{p.last}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StatusPill status={p.status}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{p.score}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>/30</span>
              <TrendArrow dir={p.trend}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Icon.ChevronLeft size={18}/>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    'חדש':     { bg: '#dbeafe', fg: '#1e40af' },
    'בבדיקה':  { bg: '#fef3c7', fg: '#92400e' },
    'הושלם':   { bg: '#d1fae5', fg: '#065f46' },
  };
  const c = map[status] || { bg: 'var(--ink-100)', fg: 'var(--ink-700)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      background: c.bg, color: c.fg,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg }}/>
      {status}
    </span>
  );
}

function TrendArrow({ dir }) {
  if (dir === 'up')   return <span style={{ color: 'var(--accent-success)', fontSize: 12 }}>↑</span>;
  if (dir === 'down') return <span style={{ color: 'var(--accent-error)',   fontSize: 12 }}>↓</span>;
  return <span style={{ color: 'var(--ink-400)', fontSize: 12 }}>→</span>;
}

window.ClinSidebar = ClinSidebar;
window.PatientList = PatientList;


// ===== components/dashboard-detail.jsx =====
// Patient detail view — drawings review + scoring rubric + stroke analysis + export

// === Clock drawing (patient sample) — shows subtle errors typical of MoCA ===
function SampleClockDrawing({ width = 280 }) {
  return (
    <svg viewBox="0 0 300 300" width={width} style={{ display: 'block' }}>
      {/* Paper grid */}
      <rect width="300" height="300" fill="#fff"/>
      {/* Patient strokes — slightly wobbly */}
      <g fill="none" stroke="#1e40af" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Circle — hand-drawn, slightly off */}
        <path d="M 150 46
                 C 206 48, 252 96, 250 152
                 C 248 208, 200 252, 146 250
                 C 92 246, 52 198, 54 144
                 C 58 92, 102 48, 150 46 Z"/>
        {/* 12 */}
        <text x="150" y="78" fontSize="18" fontWeight="600" textAnchor="middle" fill="#1e40af" stroke="none">12</text>
        {/* 3 — slightly misplaced */}
        <text x="222" y="158" fontSize="18" fontWeight="600" textAnchor="middle" fill="#1e40af" stroke="none">3</text>
        {/* 6 */}
        <text x="152" y="232" fontSize="18" fontWeight="600" textAnchor="middle" fill="#1e40af" stroke="none">6</text>
        {/* 9 */}
        <text x="78" y="158" fontSize="18" fontWeight="600" textAnchor="middle" fill="#1e40af" stroke="none">9</text>
        {/* Intermediate numbers — clustered on right (typical error) */}
        <text x="200" y="98" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">1</text>
        <text x="224" y="122" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">2</text>
        <text x="222" y="188" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">4</text>
        <text x="200" y="218" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">5</text>
        <text x="106" y="220" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">7</text>
        <text x="80" y="194" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">8</text>
        <text x="82" y="124" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">10</text>
        <text x="108" y="98" fontSize="14" fontWeight="500" textAnchor="middle" fill="#1e40af" stroke="none">11</text>
        {/* Hands — pointing to 11:10 */}
        <path d="M 150 150 L 118 102"/>
        <path d="M 150 150 L 196 150"/>
        <circle cx="150" cy="150" r="3" fill="#1e40af"/>
      </g>
    </svg>
  );
}

// === Cube drawing (patient sample) ===
function SampleCubeDrawing({ width = 280 }) {
  return (
    <svg viewBox="0 0 300 300" width={width} style={{ display: 'block' }}>
      <rect width="300" height="300" fill="#fff"/>
      <g fill="none" stroke="#1e40af" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Front face */}
        <path d="M 80 100 L 80 240 L 210 240 L 210 100 Z"/>
        {/* Back top */}
        <path d="M 80 100 L 130 60 L 250 60 L 210 100"/>
        {/* Back right */}
        <path d="M 210 100 L 250 60 L 250 200 L 210 240"/>
        {/* Partial hidden edge — slightly wobbly */}
        <path d="M 130 60 L 130 200" strokeDasharray="0" opacity="0.4"/>
      </g>
    </svg>
  );
}

// === Stroke timeline (replay scrubber) ===
function StrokeTimeline({ drawing }) {
  const data = drawing.strokes; // [{t, dur, len}]
  const total = data.reduce((s, x) => s + x.dur, 0);
  return (
    <div>
      <div style={{
        fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
      }}>ציר זמן משיכות</div>
      <div style={{
        height: 44, background: 'var(--ink-50)', borderRadius: 6,
        border: '1px solid var(--border-color)',
        position: 'relative', overflow: 'hidden',
        display: 'flex',
      }}>
        {data.map((s, i) => (
          <div key={i} style={{
            flex: s.dur, background: '#1e40af',
            opacity: 0.4 + (s.len / 100) * 0.5,
            borderLeft: i > 0 ? '1px solid #fff' : 'none',
            position: 'relative',
          }} title={`משיכה ${i+1} · ${s.dur.toFixed(1)}s · ${s.len}px`}/>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: 'var(--ink-500)', marginTop: 6,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span>0:00</span>
        <span>{total.toFixed(1)} שניות · {data.length} משיכות</span>
      </div>
    </div>
  );
}

// === Pressure heatmap grid (visualization of stroke density) ===
function PressureHeatmap({ task }) {
  // 8x8 grid of mock pressure values
  const cells = Array.from({ length: 64 }, (_, i) => {
    const seed = (i * 31 + (task === 'clock' ? 7 : 13)) % 100;
    return seed / 100;
  });
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1,
      aspectRatio: '1', background: 'var(--border-color)', padding: 1,
      borderRadius: 6, overflow: 'hidden',
    }}>
      {cells.map((v, i) => (
        <div key={i} style={{
          background: `rgba(30, 64, 175, ${v * 0.9})`,
          aspectRatio: '1',
        }}/>
      ))}
    </div>
  );
}

// === Scoring rubric — checkbox criteria with auto-calculation ===
function ScoringRubric({ title, criteria, maxScore }) {
  const [checks, setChecks] = useState(() => criteria.map(c => c.default || false));
  const score = checks.reduce((s, c, i) => s + (c ? criteria[i].pts : 0), 0);

  const toggle = (i) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: 'var(--ink-500)' }}>
          {title}
        </div>
        <div style={{
          fontSize: 24, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}>
          {score}<span style={{ color: 'var(--ink-400)', fontSize: 16, fontWeight: 600 }}>/{maxScore}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {criteria.map((c, i) => (
          <label key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 6,
            background: checks[i] ? '#ecfdf5' : 'transparent',
            cursor: 'pointer', fontSize: 14,
            transition: 'background 120ms var(--ease)',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 5,
              border: `2px solid ${checks[i] ? 'var(--accent-success)' : 'var(--ink-400)'}`,
              background: checks[i] ? 'var(--accent-success)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 120ms var(--ease)',
            }}>
              {checks[i] && <Icon.Check size={14}/>}
            </span>
            <input type="checkbox" checked={checks[i]} onChange={() => toggle(i)}
                   style={{ display: 'none' }}/>
            <span style={{ flex: 1 }}>{c.label}</span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
              fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'left',
            }}>{c.pts} נק׳</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// === Single drawing review card ===
function DrawingCard({ task, title, Drawing, strokes, criteria, maxScore }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border-color)',
      borderRadius: 12, overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1.1fr 1fr',
    }}>
      {/* Left: drawing + controls */}
      <div style={{ padding: 20, borderLeft: '1px solid var(--border-color)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
              {strokes.length} משיכות · {strokes.reduce((s,x)=>s+x.dur,0).toFixed(1)}s
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPlaying(p => !p)}
              style={{
                width: 36, height: 36, borderRadius: 6,
                border: '1px solid var(--border-color)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} title="הפעל שחזור">
              {playing ? <Icon.Pause size={16}/> : <Icon.Play size={16}/>}
            </button>
            <button style={{
                width: 36, height: 36, borderRadius: 6,
                border: '1px solid var(--border-color)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} title="הורדה">
              <Icon.Download size={16}/>
            </button>
          </div>
        </div>

        <div style={{
          background: '#fafafa',
          border: '1px dashed var(--border-color)',
          borderRadius: 8, padding: 8,
          display: 'flex', justifyContent: 'center',
        }}>
          <Drawing width={280}/>
        </div>

        <div style={{ marginTop: 16 }}>
          <StrokeTimeline drawing={{ strokes }}/>
        </div>

        <div style={{
          marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
            }}>מפת לחץ</div>
            <PressureHeatmap task={task}/>
          </div>
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
            }}>מדדים</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['זמן כולל', `${strokes.reduce((s,x)=>s+x.dur,0).toFixed(1)}s`],
                ['ממוצע משיכה', `${(strokes.reduce((s,x)=>s+x.dur,0)/strokes.length).toFixed(2)}s`],
                ['הרמות עט', strokes.length - 1],
                ['הססנות', task === 'clock' ? 'בינונית' : 'נמוכה'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, padding: '4px 0',
                  borderBottom: '1px solid var(--ink-100)',
                }}>
                  <span style={{ color: 'var(--ink-500)' }}>{k}</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: scoring rubric */}
      <div style={{ padding: 20, background: 'var(--ink-50)' }}>
        <ScoringRubric title={`ניקוד · ${title}`} criteria={criteria} maxScore={maxScore}/>

        <div style={{
          marginTop: 20, padding: 14,
          background: '#fff', borderRadius: 8,
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            הערות קלינאי
          </div>
          <textarea placeholder="הוסף הערה…" rows={3}
            style={{
              width: '100%', fontFamily: 'inherit', fontSize: 13,
              border: 'none', outline: 'none', resize: 'vertical',
              background: 'transparent', lineHeight: 1.5,
            }}/>
        </div>
      </div>
    </div>
  );
}

// === Patient detail page ===
function PatientDetail({ patient, onBack }) {
  const clockStrokes = [
    { dur: 2.1, len: 180 }, { dur: 0.6, len: 40 }, { dur: 0.5, len: 30 },
    { dur: 0.5, len: 30 }, { dur: 0.4, len: 25 }, { dur: 0.3, len: 20 },
    { dur: 0.3, len: 20 }, { dur: 0.4, len: 22 }, { dur: 0.3, len: 18 },
    { dur: 0.4, len: 20 }, { dur: 0.5, len: 28 }, { dur: 0.3, len: 22 },
    { dur: 0.4, len: 20 }, { dur: 0.8, len: 45 }, { dur: 0.6, len: 38 },
  ];
  const cubeStrokes = [
    { dur: 1.2, len: 140 }, { dur: 0.9, len: 90 },
    { dur: 1.1, len: 110 }, { dur: 1.0, len: 95 },
    { dur: 0.8, len: 80 }, { dur: 0.7, len: 60 },
  ];

  const clockCriteria = [
    { label: 'קו המתאר (עיגול סגור)', pts: 1, default: true },
    { label: 'כל 12 המספרים נוכחים', pts: 1, default: true },
    { label: 'מספרים בסדר נכון',     pts: 1, default: false },
    { label: 'מספרים במיקום המדויק', pts: 1, default: false },
    { label: 'מחוגים בנוכחים',       pts: 1, default: true },
    { label: 'זמן נכון (11:10)',    pts: 1, default: true },
  ];
  const cubeCriteria = [
    { label: 'תלת-ממד נכון',         pts: 1, default: true },
    { label: 'כל הקווים מחוברים',     pts: 1, default: true },
    { label: 'צורה יחסית נכונה',      pts: 1, default: false },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 1400 }}>
      {/* Breadcrumb + header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 13, color: 'var(--ink-500)', marginBottom: 16,
      }}>
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: 'var(--ink-500)', fontSize: 13,
        }}>
          <Icon.ChevronRight size={14}/>
          מטופלים
        </button>
        <span>/</span>
        <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{patient.name}</span>
      </div>

      <header style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 24, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--ink-900)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 22,
          }}>{patient.name[0]}</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.015em' }}>
              {patient.name}
            </h1>
            <div style={{
              fontSize: 14, color: 'var(--ink-500)', marginTop: 4,
              display: 'flex', gap: 14,
            }}>
              <span>מזהה: {patient.id.toUpperCase()}</span>
              <span>·</span>
              <span>גיל {patient.age}</span>
              <span>·</span>
              <span>{patient.sessions} מבחנים</span>
              <span>·</span>
              <StatusPill status={patient.status}/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ minHeight: 40, padding: '0 14px', fontSize: 13, gap: 6 }}>
            <Icon.File size={16}/> PDF
          </button>
          <button className="btn btn-secondary" style={{ minHeight: 40, padding: '0 14px', fontSize: 13, gap: 6 }}>
            <Icon.Download size={16}/> CSV
          </button>
          <button className="btn btn-primary" style={{ minHeight: 40, padding: '0 16px', fontSize: 13, gap: 6 }}>
            סגור מבחן
          </button>
        </div>
      </header>

      {/* Session summary strip */}
      <div style={{
        background: '#fff', border: '1px solid var(--border-color)',
        borderRadius: 10, padding: '16px 20px', marginBottom: 20,
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
      }}>
        {[
          { k: 'MoCA כולל',      v: patient.score, s: '/30', warn: patient.score < 26 },
          { k: 'ויזואו-מרחבי',    v: '3', s: '/5' },
          { k: 'שיום',           v: '3', s: '/3', ok: true },
          { k: 'זיכרון מושהה',    v: '2', s: '/5', warn: true },
          { k: 'קשב',            v: '5', s: '/6' },
          { k: 'משך המבחן',      v: '12:14', s: '' },
        ].map(x => (
          <div key={x.k}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)',
                          textTransform: 'uppercase', letterSpacing: '0.06em' }}>{x.k}</div>
            <div style={{
              fontSize: 22, fontWeight: 800, marginTop: 4,
              fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
              color: x.warn ? 'var(--accent-error)' : x.ok ? 'var(--accent-success)' : 'var(--ink-900)',
            }}>
              {x.v}<span style={{ color: 'var(--ink-400)', fontSize: 14, fontWeight: 600 }}>{x.s}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section heading */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>סקירת ציורים · ויזואו-מרחבי</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>סשן #{patient.sessions} · היום 09:42</div>
      </div>

      {/* Drawings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <DrawingCard task="clock" title="ציור שעון · 11:10" Drawing={SampleClockDrawing}
                     strokes={clockStrokes} criteria={clockCriteria} maxScore={6}/>
        <DrawingCard task="cube"  title="העתקת קובייה"       Drawing={SampleCubeDrawing}
                     strokes={cubeStrokes}  criteria={cubeCriteria}  maxScore={3}/>
      </div>
    </div>
  );
}

window.PatientDetail = PatientDetail;


// ===== components/app.jsx =====
// Main app — navigation between: Patient flow (instructions → naming task) and Clinician dashboard

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('rc_mode') || 'instructions');
  const [instructionVariant, setInstructionVariant] = useState(() => localStorage.getItem('rc_iv') || 'clinical');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { localStorage.setItem('rc_mode', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('rc_iv', instructionVariant); }, [instructionVariant]);

  // Tweak state
  const [font, setFont] = useState('Heebo');
  const [fontSize, setFontSize] = useState(20);
  const [targetSize, setTargetSize] = useState(64);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-hebrew',
      `"${font}", -apple-system, system-ui, sans-serif`);
    document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
    document.documentElement.style.setProperty('--target-size', `${targetSize}px`);
  }, [font, fontSize, targetSize]);

  // Edit mode integration
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const nav = [
    { k: 'instructions', label: 'תיבת הוראות', screen: 'patient' },
    { k: 'naming',       label: 'משימת שיום',  screen: 'patient' },
    { k: 'dashboard-list',   label: 'דשבורד · רשימה',  screen: 'clinician' },
    { k: 'dashboard-detail', label: 'דשבורד · פרטי מטופל', screen: 'clinician' },
  ];

  return (
    <div data-screen-label={mode}>
      {/* Top nav — prototype frame */}
      <ProtoNav mode={mode} setMode={setMode} nav={nav}/>

      <div style={{ paddingTop: 48 }}>
        {mode === 'instructions' && (
          <InstructionsScreen variant={instructionVariant} setVariant={setInstructionVariant}
                              onNext={() => setMode('naming')} playing={playing} setPlaying={setPlaying}/>
        )}
        {mode === 'naming' && (
          <NamingScreen onBack={() => setMode('instructions')}
                        onNext={() => setMode('dashboard-list')}/>
        )}
        {mode === 'dashboard-list' && (
          <DashboardFrame>
            <PatientList onOpen={(p) => { setSelectedPatient(p); setMode('dashboard-detail'); }}/>
          </DashboardFrame>
        )}
        {mode === 'dashboard-detail' && (
          <DashboardFrame>
            <PatientDetail patient={selectedPatient || {
              id: 'p01', name: 'רחל כהן', age: 72, sessions: 3, status: 'בבדיקה', score: 24
            }} onBack={() => setMode('dashboard-list')}/>
          </DashboardFrame>
        )}
      </div>

      {tweaksOpen && (
        <TweaksPanel
          font={font} setFont={setFont}
          fontSize={fontSize} setFontSize={setFontSize}
          targetSize={targetSize} setTargetSize={setTargetSize}
          instructionVariant={instructionVariant} setInstructionVariant={setInstructionVariant}
          onClose={() => setTweaksOpen(false)}
        />
      )}
    </div>
  );
}

// === Prototype top nav ===
function ProtoNav({ mode, setMode, nav }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100,
      height: 48, background: '#0a0a0a', color: '#fff',
      display: 'flex', alignItems: 'center', padding: '0 16px',
      gap: 4, fontFamily: 'var(--font-hebrew)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, marginLeft: 16,
                    letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Remote Check · prototype
      </div>
      {nav.map(n => (
        <button key={n.k} onClick={() => setMode(n.k)} style={{
          padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
          background: mode === n.k ? '#fff' : 'transparent',
          color: mode === n.k ? '#000' : 'rgba(255,255,255,0.7)',
          transition: 'all 120ms var(--ease)',
        }}>{n.label}</button>
      ))}
    </div>
  );
}

// === Instructions screen ===
function InstructionsScreen({ variant, setVariant, onNext, playing, setPlaying }) {
  const V = InstructionBox[variant === 'clinical' ? 'Clinical'
         : variant === 'paper' ? 'Paper' : 'Focus'];

  const data = {
    title: 'מבחן יצירת שבילים — חלק א׳',
    steps: [
      'לפניך מעגלים עם מספרים ואותיות בעברית',
      'חבר את המעגלים לפי הסדר: 1 → א → 2 → ב → 3 → ג וכו׳',
      'השתמש באצבע או בעט כדי לצייר את הקו',
      'אם טעית, לחץ על כפתור "ביטול" למחיקת המשיכה האחרונה',
    ],
    example: 'התחל תמיד עם המספר 1, אחר כך האות א׳, ואז המספר 2.',
  };

  return (
    <AssessmentLayout
      title="מבחן MoCA · גרסה עברית"
      subtitle="הערכה קוגניטיבית מקוונת"
      step={2} totalSteps={10} progress={0.18}
      onBack={() => {}} onNext={onNext}
      backLabel="חזרה" nextLabel="התחל משימה"
    >
      {/* Variant picker */}
      <div style={{
        display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32,
        padding: 6, background: 'var(--secondary-color)',
        borderRadius: 999, width: 'fit-content', margin: '0 auto 32px',
      }}>
        {[
          { k: 'clinical', label: 'קליני' },
          { k: 'paper',    label: 'נייר חם' },
          { k: 'focus',    label: 'פוקוס' },
        ].map(v => (
          <button key={v.k} onClick={() => setVariant(v.k)} style={{
            padding: '8px 18px', borderRadius: 999, fontSize: 14, fontWeight: 600,
            background: variant === v.k ? '#fff' : 'transparent',
            color: variant === v.k ? 'var(--ink-900)' : 'var(--ink-500)',
            boxShadow: variant === v.k ? 'var(--shadow-sm)' : 'none',
            transition: 'all 140ms var(--ease)',
          }}>וריאנט · {v.label}</button>
        ))}
      </div>

      <V {...data} playing={playing} onListen={() => setPlaying(p => !p)}/>

      <div style={{
        marginTop: 40, padding: 20,
        background: 'var(--ink-50)', borderRadius: 'var(--r-md)',
        display: 'flex', gap: 14, alignItems: 'flex-start',
        fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6,
        maxWidth: 700, margin: '40px auto 0',
      }}>
        <Icon.Info size={20}/>
        <div>
          <strong>הערה לקלינאי: </strong>
          ניתן להחליף בין שלושת הווריאנטים בלחיצה. בפרודקשן, הוריאנט הנבחר נקבע בהגדרות.
        </div>
      </div>
    </AssessmentLayout>
  );
}

// === Naming screen ===
function NamingScreen({ onBack, onNext }) {
  return (
    <AssessmentLayout
      title="מבחן MoCA · גרסה עברית"
      subtitle="משימת שיום"
      step={5} totalSteps={10} progress={0.5}
      onBack={onBack} onNext={onNext}
      nextLabel="לשלב הבא"
    >
      <NamingTask onComplete={onNext}/>
    </AssessmentLayout>
  );
}

// === Dashboard frame (sidebar + content) ===
function DashboardFrame({ children }) {
  const [view, setView] = useState('patients');
  return (
    <div style={{ display: 'flex', direction: 'rtl', minHeight: 'calc(100vh - 48px)' }}>
      <ClinSidebar view={view} setView={setView}/>
      <div style={{ flex: 1, background: 'var(--ink-50)', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// === Tweaks panel ===
function TweaksPanel({ font, setFont, fontSize, setFontSize, targetSize, setTargetSize,
                       instructionVariant, setInstructionVariant, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, zIndex: 1000,
      width: 300, background: '#fff',
      border: '1px solid var(--border-color)',
      borderRadius: 12, boxShadow: 'var(--shadow-lg)',
      padding: 20, direction: 'rtl', fontFamily: 'var(--font-hebrew)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Tweaks</div>
        <button onClick={onClose} style={{ fontSize: 20, color: 'var(--ink-500)' }}>×</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            גופן
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Heebo', 'Assistant', 'Rubik'].map(f => (
              <button key={f} onClick={() => setFont(f)} style={{
                flex: 1, padding: '8px 4px', fontSize: 13, borderRadius: 6,
                background: font === f ? 'var(--ink-900)' : 'var(--ink-100)',
                color: font === f ? '#fff' : 'var(--ink-700)',
                fontFamily: `"${f}", sans-serif`,
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
                        display: 'flex', justifyContent: 'space-between' }}>
            <span>גודל טקסט בסיס</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fontSize}px</span>
          </div>
          <input type="range" min="18" max="28" step="1" value={fontSize}
                 onChange={e => setFontSize(+e.target.value)}
                 style={{ width: '100%', accentColor: '#000' }}/>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
                        display: 'flex', justifyContent: 'space-between' }}>
            <span>יעד מגע</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{targetSize}px</span>
          </div>
          <input type="range" min="56" max="88" step="4" value={targetSize}
                 onChange={e => setTargetSize(+e.target.value)}
                 style={{ width: '100%', accentColor: '#000' }}/>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            וריאנט תיבת הוראות
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['clinical', 'קליני'], ['paper', 'נייר'], ['focus', 'פוקוס']].map(([k, l]) => (
              <button key={k} onClick={() => setInstructionVariant(k)} style={{
                flex: 1, padding: '8px 4px', fontSize: 13, borderRadius: 6,
                background: instructionVariant === k ? 'var(--ink-900)' : 'var(--ink-100)',
                color: instructionVariant === k ? '#fff' : 'var(--ink-700)',
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

