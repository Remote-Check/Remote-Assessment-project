import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Session, DBScoringReport } from '../../types/database';

interface SessionWithReport extends Session {
  scoring_reports: DBScoringReport | null;
}

export default function PatientList() {
  const [sessions, setSessions] = useState<SessionWithReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*, scoring_reports(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
    } else {
      setSessions(data as SessionWithReport[]);
    }
    setLoading(false);
  };

  const filteredSessions = sessions.filter(s => 
    s.case_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 32 }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 32
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>מטופלים</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>
            {sessions.length} מבחנים בסה"כ · {sessions.filter(s => s.status === 'awaiting_review').length} דורשים סקירה
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 8, padding: '0 12px', width: 300
          }}>
            <Search size={18} color="#9ca3af" />
            <input 
              placeholder="חיפוש לפי מזהה..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                outline: 'none', height: 40, fontSize: 14
              }}
            />
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#000', color: '#fff', border: 'none',
              borderRadius: 8, padding: '0 20px', height: 42,
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            מבחן חדש
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
        marginBottom: 32
      }}>
        {[
          { label: 'מבחנים השבוע', v: sessions.filter(s => new Date(s.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length, icon: <FileText size={20}/> },
          { label: 'דורשים סקירה', v: sessions.filter(s => s.status === 'awaiting_review').length, color: '#92400e' },
          { label: 'הושלמו', v: sessions.filter(s => s.status === 'completed').length, color: '#065f46' },
          { label: 'בביצוע', v: sessions.filter(s => s.status === 'in_progress').length, color: '#1e40af' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 12, padding: 20
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>{s.label}</div>
            <div style={{ 
              fontSize: 28, fontWeight: 800, color: s.color || '#111827',
              fontVariantNumeric: 'tabular-nums' 
            }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 12, overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 100px 120px 140px 120px 80px',
          padding: '12px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
          fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase'
        }}>
          <div>מזהה מטופל</div>
          <div>גיל</div>
          <div>תאריך</div>
          <div>סטטוס</div>
          <div>ציון</div>
          <div />
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>טוען נתונים...</div>
        ) : filteredSessions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>לא נמצאו מבחנים</div>
        ) : (
          filteredSessions.map((s) => (
            <div 
              key={s.id} 
              onClick={() => navigate(`/dashboard/session/${s.id}`)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 100px 120px 140px 120px 80px',
                padding: '16px 24px', borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer', transition: 'background 0.2s',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600, color: '#111827' }}>{s.case_id}</div>
              <div style={{ color: '#4b5563' }}>{s.age_band}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>
                {new Date(s.created_at).toLocaleDateString('he-IL')}
              </div>
              <div>
                <StatusPill status={s.status} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {s.scoring_reports ? (
                  <>
                    {s.scoring_reports.total_adjusted}
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>/30</span>
                    {s.scoring_reports.total_provisional && <span style={{ fontSize: 10, color: '#92400e', marginRight: 4 }}>(זמני)</span>}
                  </>
                ) : '-'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ChevronLeft size={18} color="#9ca3af" />
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateSessionModal 
          onClose={() => setShowCreateModal(false)} 
          onCreated={fetchSessions} 
        />
      )}
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

function CreateSessionModal({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
  const [formData, setFormData] = useState({
    case_id: '',
    age_band: '60-69' as const,
    education_years: 12,
    location_place: 'בית',
    location_city: ''
  });
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        ...formData,
        clinician_id: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      alert('Error creating session: ' + error.message);
      setLoading(false);
    } else {
      const link = `${window.location.origin}/assess/${data.link_token}`;
      setCreatedLink(link);
      onCreated();
      setLoading(false);
    }
  };

  if (createdLink) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        direction: 'rtl'
      }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 500 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>הקישור נוצר בהצלחה</h2>
          <p style={{ color: '#4b5563', marginBottom: 24 }}>שלח קישור זה למטופל כדי להתחיל את ההערכה:</p>
          
          <div style={{
            display: 'flex', gap: 8, background: '#f3f4f6', padding: 12, borderRadius: 8,
            marginBottom: 24, alignItems: 'center'
          }}>
            <code style={{ flex: 1, fontSize: 13, wordBreak: 'break-all' }}>{createdLink}</code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(createdLink);
                alert('הקישור הועתק!');
              }}
              style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer' }}
            >
              העתק
            </button>
          </div>

          <button 
            onClick={onClose}
            style={{ width: '100%', padding: 12, background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
          >
            סגור
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      direction: 'rtl'
    }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 500 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>יצירת קישור למבחן חדש</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>מזהה מטופל (Case ID)</label>
            <input 
              required
              value={formData.case_id}
              onChange={e => setFormData({ ...formData, case_id: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              placeholder="למשל: PT-1234"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>קבוצת גיל</label>
              <select 
                value={formData.age_band}
                onChange={e => setFormData({ ...formData, age_band: e.target.value as any })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              >
                <option value="60-69">60-69</option>
                <option value="70-79">70-79</option>
                <option value="80+">80+</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>שנות השכלה</label>
              <input 
                type="number" min="0" max="30"
                value={formData.education_years}
                onChange={e => setFormData({ ...formData, education_years: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>מיקום (למשל: בית)</label>
              <input 
                value={formData.location_place}
                onChange={e => setFormData({ ...formData, location_place: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>עיר</label>
              <input 
                value={formData.location_city}
                onChange={e => setFormData({ ...formData, location_city: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                placeholder="למשל: תל אביב"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button 
              type="button" onClick={onClose}
              style={{ flex: 1, padding: 12, background: '#f3f4f6', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            >
              ביטול
            </button>
            <button 
              type="submit" disabled={loading}
              style={{ flex: 1, padding: 12, background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              {loading ? 'יוצר...' : 'צור קישור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
