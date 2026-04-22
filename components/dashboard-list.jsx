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
