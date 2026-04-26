import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/risks': 'Risk Scenarios',
  '/risks/new': 'Create Scenario',
  '/analytics': 'Risk Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    if (location.pathname.match(/^\/risks\/\d+\/edit$/)) return 'Edit Scenario';
    if (location.pathname.match(/^\/risks\/\d+$/)) return 'Scenario Details';
    return pageTitles[location.pathname] || 'Dashboard Overview';
  };

  return (
    <header className="h-14 bg-gradient-to-r from-[#050a15]/95 to-[#0a0e1a]/95 backdrop-blur-xl border-b border-emerald-500/10 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left: Hamburger + Page title */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 text-slate-300 hover:text-emerald-400 hover:bg-white/[0.05] rounded-lg transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-white">{getPageTitle()}</h2>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search records..." className="w-40 lg:w-52 pl-9 pr-4 py-1.5 bg-[#162d47] border border-emerald-500/10 rounded-lg text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:bg-[#1e3a5f] focus:border-[#10b981]/30 transition-all" />
        </div>

        {/* Secure badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 rounded-full border border-[#10b981]/15">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
          <span className="text-[#10b981] text-xs font-bold uppercase tracking-wider">Secure</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-300 hover:text-emerald-400 hover:bg-white/[0.05] rounded-lg transition-all">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full shadow-[0_0_6px_rgba(239,68,68,0.5)]"></span>
        </button>

        {/* Create button */}
        <button onClick={() => navigate('/risks/new')} className="flex items-center gap-1.5 bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">Create</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;