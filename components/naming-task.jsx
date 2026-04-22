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
