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
