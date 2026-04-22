import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Clock, BarChart2, LayoutGrid, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface ClinicianLayoutProps {
  children: React.ReactNode;
}

export const ClinicianLayout: React.FC<ClinicianLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'מטופלים', icon: <Users size={18}/> },
    { to: '/dashboard/sessions', label: 'מבחנים אחרונים', icon: <Clock size={18}/> },
    { to: '/dashboard/analytics', label: 'ניתוחים', icon: <BarChart2 size={18}/> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: '#0a0a0a', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 8px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: '#fff', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <LayoutGrid size={20} color="#000" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Remote Check</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>קונסולת קלינאי</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontSize: 14,
                fontWeight: 500,
                transition: 'all 0.2s'
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: '#fff', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
            }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>קלינאי מורשה</div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: 14, fontWeight: 500
            }}
          >
            <LogOut size={18} />
            <span>התנתק</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};
