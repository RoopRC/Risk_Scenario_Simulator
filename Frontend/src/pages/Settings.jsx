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
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your preferences and account settings</p>
      </div>

      {/* Profile Section */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
                {user?.name || 'User'}
              </div>
            </div>
            <div>
              <label className="label">Role</label>
              <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="input w-full sm:w-64"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode (Coming Soon)</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="label">Items Per Page</label>
            <select
              name="itemsPerPage"
              value={settings.itemsPerPage}
              onChange={handleChange}
              className="input w-full sm:w-64"
            >
              <option value={5}>5 items</option>
              <option value={10}>10 items</option>
              <option value={25}>25 items</option>
              <option value={50}>50 items</option>
            </select>
          </div>

          <div>
            <label className="label">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="input w-full sm:w-64"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Enable Notifications</p>
              <p className="text-sm text-slate-400">Receive alerts for critical risks</p>
            </div>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {settings.notifications && (
            <div className="ml-4 border-l-2 border-blue-200 pl-4">
              <label className="label">Email Digest</label>
              <select
                name="emailDigest"
                value={settings.emailDigest}
                onChange={handleChange}
                className="input w-full sm:w-64"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Summary</option>
                <option value="weekly">Weekly Summary</option>
                <option value="never">Never</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Risk Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Risk Management</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Default Risk Score Threshold: {settings.defaultRiskScore.toFixed(1)}</label>
            <input
              type="range"
              name="defaultRiskScore"
              min="1"
              max="10"
              step="0.5"
              value={settings.defaultRiskScore}
              onChange={handleChange}
              className="w-full sm:w-96"
            />
            <p className="text-xs text-slate-400 mt-1">Risks above this score will be highlighted</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Security</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Auto Logout After (minutes)</label>
            <select
              name="autoLogout"
              value={settings.autoLogout}
              onChange={handleChange}
              className="input w-full sm:w-64"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={0}>Never</option>
            </select>
          </div>

          <div className="pt-4 border-t">
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
