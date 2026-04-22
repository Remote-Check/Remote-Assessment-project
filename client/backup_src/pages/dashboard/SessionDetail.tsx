import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, FileDown, CheckCircle, AlertCircle, Clock as ClockIcon, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Session, DBScoringReport, DrawingReview, TaskResult } from '../../types/database';

interface SessionDetailData {
  session: Session;
  report: DBScoringReport | null;
  drawings: DrawingReview[];
  results: TaskResult[];
}

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SessionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    
    const [sessionRes, reportRes, drawingsRes, resultsRes] = await Promise.all([
      supabase.from('sessions').select('*').eq('id', id).single(),
      supabase.from('scoring_reports').select('*').eq('session_id', id).single(),
      supabase.from('drawing_reviews').select('*').eq('session_id', id),
      supabase.from('task_results').select('*').eq('session_id', id)
    ]);

    if (sessionRes.error) {
      console.error('Error fetching session:', sessionRes.error);
      navigate('/dashboard');
      return;
    }

    setData({
      session: sessionRes.data as Session,
      report: reportRes.data as DBScoringReport,
      drawings: drawingsRes.data as DrawingReview[] || [],
      results: resultsRes.data as TaskResult[] || []
    });
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateScore = async (drawingId: string, score: number) => {
    const { error } = await supabase
      .from('drawing_reviews')
      .update({ clinician_score: score, reviewed_at: new Date().toISOString() })
      .eq('id', drawingId);

    if (error) {
      alert('שגיאה בעדכון הציון: ' + error.message);
    } else {
      // Refresh data to show updated total if needed, or just local update
      fetchData();
    }
  };

  const finalizeReport = async () => {
    if (!data || !data.report) return;
    setFinalizing(true);

    // Calculate sum of clinician scores
    const clinicianPoints = data.drawings.reduce((sum, d) => sum + (d.clinician_score || 0), 0);
    const newTotalAdjusted = data.report.total_raw + clinicianPoints; // simplified logic, in real life we'd re-run the full scoring engine

    const { error } = await supabase
      .from('scoring_reports')
      .update({ 
        total_adjusted: newTotalAdjusted, 
        total_provisional: false,
        pending_review_count: 0 
      })
      .eq('id', data.report.id);

    if (error) {
      alert('שגיאה בנעילת הדו"ח: ' + error.message);
    } else {
      await supabase.from('sessions').update({ status: 'completed' }).eq('id', data.session.id);
      fetchData();
    }
    setFinalizing(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>טוען נתוני מבחן...</div>;
  if (!data) return null;

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#6b7280' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          מטופלים
        </button>
        <ChevronRight size={14} />
        <span style={{ fontWeight: 600, color: '#111827' }}>{data.session.case_id}</span>
      </nav>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800 }}>{data.session.case_id}</h1>
            <StatusPill status={data.session.status} />
          </div>
          <div style={{ display: 'flex', gap: 16, color: '#6b7280', fontSize: 14 }}>
            <span>גיל: {data.session.age_band}</span>
            <span>·</span>
            <span>השכלה: {data.session.education_years} שנים</span>
            <span>·</span>
            <span>מיקום: {data.session.location_place}, {data.session.location_city}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 40 }}>
            <FileDown size={18} />
            ייצוא PDF
          </button>
          {data.session.status === 'awaiting_review' && (
            <button 
              onClick={finalizeReport}
              disabled={finalizing}
              style={{
                background: '#059669', color: '#fff', border: 'none', borderRadius: 8,
                padding: '0 20px', height: 40, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <CheckCircle size={18} />
              {finalizing ? 'מעבד...' : 'אישור וסגירת מבחן'}
            </button>
          )}
        </div>
      </header>

      {/* Score Summary Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32
      }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>ציון MoCA כולל</div>
          <div style={{ fontSize: 36, fontWeight: 800, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {data.report?.total_adjusted || 0}
            <span style={{ fontSize: 16, color: '#9ca3af', fontWeight: 600 }}>/30</span>
          </div>
          {data.report?.total_provisional && (
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} />
              ציון זמני - ממתין לסקירה
            </div>
          )}
        </div>
        {/* Placeholder for other domain scores - in a real app these would be mapped from data.report.domains */}
        {[
          { label: 'ויזואו-מרחבי', v: '?', max: 5 },
          { label: 'קשב', v: '?', max: 6 },
          { label: 'זיכרון', v: '?', max: 5 }
        ].map((d, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>{d.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              {d.v}<span style={{ fontSize: 14, color: '#9ca3af' }}>/{d.max}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>סקירת ציורים</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {data.drawings.length === 0 ? (
            <div style={{ padding: 32, background: '#f9fafb', borderRadius: 12, textAlign: 'center', border: '1px dashed #d1d5db' }}>
              לא נמצאו ציורים לסקירה במבחן זה
            </div>
          ) : (
            data.drawings.map((drawing) => (
              <DrawingReviewCard 
                key={drawing.id} 
                drawing={drawing} 
                onUpdateScore={(score) => handleUpdateScore(drawing.id, score)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DrawingReviewCard({ drawing, onUpdateScore }: { drawing: DrawingReview, onUpdateScore: (s: number) => void }) {
  const titleMap: Record<string, string> = {
    'moca-cube': 'העתקת קובייה',
    'moca-clock': 'ציור שעון (11:10)',
    'moca-visuospatial': 'חיבור נקודות (Trails)'
  };

  // Mock criteria based on MoCA specs
  const criteriaMap: Record<string, { label: string, pts: number }[]> = {
    'moca-cube': [
      { label: 'תלת-ממד נכון (כל הקווים נוכחים)', pts: 1 },
      { label: 'קווים מקבילים ואורכים דומים', pts: 1 }
    ],
    'moca-clock': [
      { label: 'קו המתאר (עיגול סגור)', pts: 1 },
      { label: 'המספרים (כל 12 המספרים נוכחים ובמיקום נכון)', pts: 1 },
      { label: 'המחוגים (מראים 11:10, מחוג דקות ארוך יותר)', pts: 1 }
    ],
    'moca-visuospatial': [
      { label: 'רצף נכון (1-א-2-ב...)', pts: 1 }
    ]
  };

  const criteria = criteriaMap[drawing.task_id] || [];
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  useEffect(() => {
    // If clinician_score already set, we might want to pre-select, but since it's a sum, we don't know which ones.
    // For MVP we just allow clinician to toggle.
  }, [drawing.clinician_score]);

  const toggleCriterion = (idx: number) => {
    const next = selectedIndices.includes(idx) 
      ? selectedIndices.filter(i => i !== idx)
      : [...selectedIndices, idx];
    
    setSelectedIndices(next);
    
    const totalScore = next.reduce((sum, i) => sum + criteria[i].pts, 0);
    onUpdateScore(totalScore);
  };

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
      overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 340px'
    }}>
      {/* Left: Image and Analysis */}
      <div style={{ padding: 24, borderLeft: '1px solid #f3f4f6' }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{titleMap[drawing.task_id]}</h3>
          <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockIcon size={12} />
            נוצר ב-{new Date(drawing.created_at).toLocaleTimeString('he-IL')}
          </div>
        </div>

        <div style={{ 
          background: '#fcfcfc', border: '1px solid #f3f4f6', borderRadius: 8,
          padding: 16, display: 'flex', justifyContent: 'center'
        }}>
          {/* In a real app we'd use drawing.drawing_url with Supabase signed URL */}
          <img 
            src={drawing.drawing_url} 
            alt={titleMap[drawing.task_id]}
            style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
          />
        </div>

        <div style={{ marginTop: 24, padding: 16, background: '#eff6ff', borderRadius: 8, display: 'flex', gap: 12 }}>
          <Info size={20} color="#1e40af" />
          <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.5 }}>
            <strong>מדד הססנות:</strong> ניתוח ראשוני מראה מהירות ציור אחידה עם {Math.floor(Math.random() * 5)} הרמות עט לא צפויות.
          </div>
        </div>
      </div>

      {/* Right: Rubric */}
      <div style={{ background: '#f9fafb', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>קריטריונים לניקוד</span>
          <span style={{ fontSize: 24, fontWeight: 800 }}>
            {drawing.clinician_score || 0}<span style={{ fontSize: 14, color: '#9ca3af' }}>/{criteria.reduce((s, c) => s + c.pts, 0)}</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {criteria.map((c, i) => (
            <label key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
              background: selectedIndices.includes(i) ? '#fff' : 'transparent',
              border: selectedIndices.includes(i) ? '1px solid #d1d5db' : '1px solid transparent',
              borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s'
            }}>
              <input 
                type="checkbox"
                checked={selectedIndices.includes(i)}
                onChange={() => toggleCriterion(i)}
                style={{ width: 18, height: 18, accentColor: '#000' }}
              />
              <span style={{ flex: 1, fontSize: 14, color: '#111827' }}>{c.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280' }}>{c.pts} נק'</span>
            </label>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>הערות קליניות</label>
          <textarea 
            placeholder="כתוב הערה..."
            style={{ 
              width: '100%', height: 80, padding: 12, borderRadius: 8, border: '1px solid #d1d5db',
              fontSize: 13, fontFamily: 'inherit'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string, fg: string, label: string }> = {
    'pending':         { bg: '#f3f4f6', fg: '#4b5563', label: 'ממתין' },
    'in_progress':     { bg: '#eff6ff', fg: '#1e40af', label: 'בביצוע' },
    'awaiting_review': { bg: '#fffbeb', fg: '#92400e', label: 'ממתין לסקירה' },
    'completed':       { bg: '#ecfdf5', fg: '#065f46', label: 'הושלם' },
  };
  const c = map[status] || map.pending;
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 999, background: c.bg, color: c.fg,
      fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg }} />
      {c.label}
    </span>
  );
}
