import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
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

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-emerald-300 mt-2">Manage your preferences and account settings</p>
      </div>

      {/* Profile Section */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-[#10b981] to-[#06b6d4] rounded"></span>
          Profile Information
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-2 block">Name</label>
              <div className="px-4 py-2 bg-[#162d47]/50 rounded-lg border border-[#10b981]/20 text-white font-medium">
                {user?.name || 'User'}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-2 block">Role</label>
              <div className="px-4 py-2 bg-[#162d47]/50 rounded-lg border border-[#10b981]/20">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#06b6d4]/20 to-[#10b981]/20 text-cyan-300 rounded-full text-sm font-medium border border-[#06b6d4]/30">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-2 block">Email</label>
            <div className="px-4 py-2 bg-[#162d47]/50 rounded-lg border border-[#10b981]/20 text-white">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-[#a855f7] to-[#06b6d4] rounded"></span>
          Display Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-purple-300 mb-2 block">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="w-full sm:w-64 px-4 py-3 bg-gradient-to-r from-[#a855f7]/10 to-[#06b6d4]/10 border-2 border-[#a855f7]/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7]/50 hover:border-[#a855f7]/50 transition-all cursor-pointer"
            >
              <option value="light" className="bg-slate-800 text-white">Light Mode</option>
              <option value="dark" className="bg-slate-800 text-white">Dark Mode (Coming Soon)</option>
              <option value="auto" className="bg-slate-800 text-white">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-purple-300 mb-2 block">Items Per Page</label>
            <select
              name="itemsPerPage"
              value={settings.itemsPerPage}
              onChange={handleChange}
              className="w-full sm:w-64 px-4 py-3 bg-gradient-to-r from-[#a855f7]/10 to-[#06b6d4]/10 border-2 border-[#a855f7]/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7]/50 hover:border-[#a855f7]/50 transition-all cursor-pointer"
            >
              <option value={5} className="bg-slate-800 text-white">5 items</option>
              <option value={10} className="bg-slate-800 text-white">10 items</option>
              <option value={25} className="bg-slate-800 text-white">25 items</option>
              <option value={50} className="bg-slate-800 text-white">50 items</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-purple-300 mb-2 block">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full sm:w-64 px-4 py-3 bg-gradient-to-r from-[#a855f7]/10 to-[#06b6d4]/10 border-2 border-[#a855f7]/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7]/50 hover:border-[#a855f7]/50 transition-all cursor-pointer"
            >
              <option value="en" className="bg-slate-800 text-white">English</option>
              <option value="es" className="bg-slate-800 text-white">Spanish</option>
              <option value="fr" className="bg-slate-800 text-white">French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-[#f59e0b] to-[#ef4444] rounded"></span>
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#162d47]/30 rounded-lg border border-[#f59e0b]/20">
            <div>
              <p className="font-medium text-white">Enable Notifications</p>
              <p className="text-sm text-amber-300">Receive alerts for critical risks</p>
            </div>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer accent-[#10b981]"
            />
          </div>

          {settings.notifications && (
            <div className="ml-4 border-l-2 border-[#06b6d4]/40 pl-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-2 block">Email Digest</label>
              <select
                name="emailDigest"
                value={settings.emailDigest}
                onChange={handleChange}
                className="w-full sm:w-64 px-4 py-3 bg-gradient-to-r from-[#06b6d4]/10 to-[#10b981]/10 border-2 border-[#06b6d4]/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4]/50 hover:border-[#06b6d4]/50 transition-all cursor-pointer"
              >
                <option value="immediate" className="bg-slate-800 text-white">Immediate</option>
                <option value="daily" className="bg-slate-800 text-white">Daily Summary</option>
                <option value="weekly" className="bg-slate-800 text-white">Weekly Summary</option>
                <option value="never" className="bg-slate-800 text-white">Never</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Risk Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-[#ef4444] to-[#a855f7] rounded"></span>
          Risk Management
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-red-300 mb-2 block">Default Risk Score Threshold: <span className="text-white font-bold">{settings.defaultRiskScore.toFixed(1)}</span></label>
            <div className="p-4 bg-gradient-to-r from-[#ef4444]/10 to-[#a855f7]/10 border-2 border-[#ef4444]/20 rounded-lg">
              <input
                type="range"
                name="defaultRiskScore"
                min="1"
                max="10"
                step="0.5"
                value={settings.defaultRiskScore}
                onChange={handleChange}
                className="w-full accent-[#ef4444]"
              />
            </div>
            <p className="text-xs text-emerald-400 mt-1">Risks above this score will be highlighted</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-[#10b981] to-[#a855f7] rounded"></span>
          Security
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-2 block">Auto Logout After (minutes)</label>
            <select
              name="autoLogout"
              value={settings.autoLogout}
              onChange={handleChange}
              className="w-full sm:w-64 px-4 py-3 bg-gradient-to-r from-[#10b981]/10 to-[#a855f7]/10 border-2 border-[#10b981]/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981]/50 hover:border-[#10b981]/50 transition-all cursor-pointer"
            >
              <option value={15} className="bg-slate-800 text-white">15 minutes</option>
              <option value={30} className="bg-slate-800 text-white">30 minutes</option>
              <option value={60} className="bg-slate-800 text-white">1 hour</option>
              <option value={0} className="bg-slate-800 text-white">Never</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#ef4444]/20">
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading || saved}
          className={`btn-primary ${loading || saved ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
