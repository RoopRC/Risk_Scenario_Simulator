import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) onClose?.();
  };

  const navItems = [
    {
      path: '/dashboard', label: 'Dashboard',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>),
    },
    {
      path: '/risks', label: 'Risk Scenarios',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
    },
    {
      path: '/risks/new', label: 'New Scenario',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>),
    },
    {
      path: '/analytics', label: 'Analytics',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>),
    },
    {
      path: '/reports', label: 'Reports',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
    },
    {
      path: '/settings', label: 'Settings',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24" /></svg>),
    },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 w-[220px] bg-gradient-to-b from-[#050a15] via-[#0a0e1a] to-[#050a15] flex flex-col z-50 shadow-sidebar transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Logo + Close */}
      <div className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight tracking-wide">RISK.SIM</h1>
            <p className="text-emerald-300/60 text-2xs uppercase tracking-[0.2em] font-medium">Enterprise Edition</p>
          </div>
        </div>
        {/* Close button - mobile only */}
        <button onClick={onClose} className="md:hidden text-emerald-400 hover:text-white p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      {/* Systems label */}
      <div className="px-5 mt-5 mb-3">
        <p className="text-emerald-400/50 text-2xs font-semibold uppercase tracking-[0.2em]">Systems</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/risks/new' || item.path === '/dashboard'}
            onClick={handleNavClick}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Health Index */}
      <div className="px-4 mb-4">
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-2xs font-bold text-white/80 uppercase tracking-wider">Health Index</span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>
          </div>
          <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mb-2">
            <div className="h-full w-[88%] bg-gradient-to-r from-[#10b981] to-[#06b6d4] rounded-full transition-all duration-1000"></div>
          </div>
          <p className="text-2xs text-emerald-400/60">88% Service Availability</p>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/[0.04] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#10b981]/15 flex items-center justify-center ring-1 ring-[#10b981]/20">
          <span className="text-[#10b981] font-bold text-xs">
            {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{user?.name || user?.username || 'admin'}</p>
          <p className="text-emerald-400/60 text-2xs">{user?.role || 'ADMIN'}</p>
        </div>
        <button onClick={handleLogout} className="text-emerald-400/60 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-white/[0.03]" title="Logout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
