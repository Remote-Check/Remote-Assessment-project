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
