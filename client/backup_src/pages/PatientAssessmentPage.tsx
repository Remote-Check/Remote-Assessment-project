import { BatteryPlayer } from '../components/BatteryPlayer';
import { useSession } from '../hooks/useSession';
import type { BatteryManifest } from '../types/battery';

const MOCA_MANIFEST: BatteryManifest = {
  id: 'moca-hebrew-v1',
  version: '1.0',
  steps: [
    { id: 'orientation_intro', type: 'orientation',           titleKey: 'orientation.title' },
    { id: 'trails',            type: 'moca-visuospatial',     titleKey: 'visuospatial.trails' },
    { id: 'cube',              type: 'moca-cube',             titleKey: 'visuospatial.cube' },
    { id: 'clock',             type: 'moca-clock',            titleKey: 'visuospatial.clock' },
    { id: 'naming',            type: 'moca-naming',           titleKey: 'naming.eyebrow' },
    { id: 'memory_learning',   type: 'moca-memory-learning',  titleKey: 'memory.learning_title' },
    { id: 'digit_span',        type: 'moca-digit-span',       titleKey: 'attention.digit_span_title' },
    { id: 'vigilance',         type: 'moca-vigilance',        titleKey: 'attention.vigilance_title' },
    { id: 'serial_7s',         type: 'moca-serial-7s',        titleKey: 'attention.serial_7s_title' },
    { id: 'language',          type: 'moca-language',         titleKey: 'language.title' },
    { id: 'abstraction',       type: 'moca-abstraction',      titleKey: 'abstraction.title' },
    { id: 'delayed_recall',    type: 'moca-delayed-recall',   titleKey: 'memory.title' },
    { id: 'orientation_task',  type: 'moca-orientation-task', titleKey: 'orientation_task.title' },
  ],
};

export default function PatientAssessmentPage() {
  const session = useSession();

  if (session.status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>טוען...</p>
      </div>
    );
  }

  if (session.status === 'already_used') {
    return (
      <div style={{ textAlign: 'center', padding: '100px 40px' }}>
        <h1>הקישור כבר שומש</h1>
        <p>קישור זה חד-פעמי ונעשה בו שימוש. אנא פנה למטפל לקישור חדש.</p>
      </div>
    );
  }

  if (session.status === 'invalid' || session.status === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '100px 40px' }}>
        <h1>קישור לא תקין</h1>
        <p>לא ניתן לפתוח הערכה זו. אנא פנה למטפל.</p>
      </div>
    );
  }

  return (
    <BatteryPlayer
      manifest={MOCA_MANIFEST}
      sessionId={session.sessionId}
      scoringContext={session.scoringContext}
    />
  );
}
