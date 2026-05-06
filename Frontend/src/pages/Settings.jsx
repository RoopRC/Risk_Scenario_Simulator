import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailDigest: 'daily',
    defaultRiskScore: 5,
    itemsPerPage: 10,
    autoLogout: 30,
    language: 'en',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setSettings(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setLoading(false);
    setSaved(true);
    toast.success('Settings saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )},
    { id: 'display', label: 'Display', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    )},
    { id: 'notifications', label: 'Notifications', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    )},
    { id: 'risk', label: 'Risk Config', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    )},
  ];

  const selectClass = "w-full sm:w-72 px-4 py-2.5 bg-[#0a1628] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all cursor-pointer";
  const optionClass = "bg-[#0a1628] text-white";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="opacity-0 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-300 mt-1">Manage your preferences, notifications, and account configuration.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl opacity-0 animate-fade-in-up stagger-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-[#050a15] shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="opacity-0 animate-fade-in-up stagger-2">

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center text-xl font-bold text-[#050a15] shadow-lg">
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name || 'User'}</h2>
                <p className="text-sm text-slate-400">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Full Name</label>
                <p className="text-white font-medium">{user?.name || 'User'}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Role</label>
                <span className="inline-block px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/25">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <div className="sm:col-span-2 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Email Address</label>
                <p className="text-white font-medium">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <div className="card p-6 animate-fade-in-up">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Display Preferences</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">Theme</label>
                <select name="theme" value={settings.theme} onChange={handleChange} className={selectClass}>
                  <option value="light" className={optionClass}>Light Mode</option>
                  <option value="dark" className={optionClass}>Dark Mode</option>
                  <option value="auto" className={optionClass}>Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">Items Per Page</label>
                <select name="itemsPerPage" value={settings.itemsPerPage} onChange={handleChange} className={selectClass}>
                  <option value={5} className={optionClass}>5 items</option>
                  <option value={10} className={optionClass}>10 items</option>
                  <option value={25} className={optionClass}>25 items</option>
                  <option value={50} className={optionClass}>50 items</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">Language</label>
                <select name="language" value={settings.language} onChange={handleChange} className={selectClass}>
                  <option value="en" className={optionClass}>English</option>
                  <option value="es" className={optionClass}>Spanish</option>
                  <option value="fr" className={optionClass}>French</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card p-6 animate-fade-in-up">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="font-medium text-white text-sm">Push Notifications</p>
                  <p className="text-xs text-slate-400 mt-0.5">Receive alerts for critical risk scenarios</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {settings.notifications && (
                <div className="ml-4 pl-4" style={{ borderLeft: '2px solid rgba(16, 185, 129, 0.3)' }}>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Email Digest Frequency</label>
                  <select name="emailDigest" value={settings.emailDigest} onChange={handleChange} className={selectClass}>
                    <option value="immediate" className={optionClass}>Immediate</option>
                    <option value="daily" className={optionClass}>Daily Summary</option>
                    <option value="weekly" className={optionClass}>Weekly Summary</option>
                    <option value="never" className={optionClass}>Never</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Config Tab */}
        {activeTab === 'risk' && (
          <div className="card p-6 animate-fade-in-up">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Risk Configuration</h2>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-300">Risk Score Alert Threshold</label>
                <span className="text-lg font-bold text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 tabular-nums">
                  {Number(settings.defaultRiskScore).toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input
                  type="range" name="defaultRiskScore" min="1" max="10" step="0.5"
                  value={settings.defaultRiskScore} onChange={handleChange}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider">
                  <span>Low (1)</span><span>Medium (5)</span><span>Critical (10)</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Risks scoring above this threshold will be flagged and highlighted across the dashboard.</p>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card p-6 animate-fade-in-up">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Security Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">Auto Logout Timer</label>
                <select name="autoLogout" value={settings.autoLogout} onChange={handleChange} className={selectClass}>
                  <option value={15} className={optionClass}>15 minutes</option>
                  <option value={30} className={optionClass}>30 minutes</option>
                  <option value={60} className={optionClass}>1 hour</option>
                  <option value={0} className={optionClass}>Never</option>
                </select>
                <p className="text-xs text-slate-500 mt-1.5">Automatically log out after a period of inactivity.</p>
              </div>

              <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Danger Zone</h3>
                <div className="p-4 rounded-lg flex items-center justify-between" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <div>
                    <p className="font-medium text-white text-sm">Sign Out</p>
                    <p className="text-xs text-slate-400 mt-0.5">End your current session and return to login.</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 rounded-lg border border-red-500/25 hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-[0.97]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 py-4 opacity-0 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #162d47, #1e3a5f)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs text-slate-400">
            {saved ? '✓ All changes saved' : 'You have unsaved changes'}
          </p>
          <button
            onClick={handleSave}
            disabled={loading || saved}
            className={`btn-primary flex items-center gap-2 ${loading || saved ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Saving...</>
            ) : saved ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Settings</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
