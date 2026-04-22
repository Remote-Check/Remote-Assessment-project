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
