import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(credentials);
      setLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred during login. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050a15] via-[#0a0e1a] to-[#0f1628] px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#10b981]/[0.06] blur-[100px]"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#a855f7]/[0.04] blur-[100px]"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#06b6d4]/[0.03] blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center mx-auto mb-4 shadow-glow">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">RISK.SIM</h1>
          <p className="text-emerald-400 text-sm mt-1 tracking-wide">Enterprise Edition</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#162d47]/40 backdrop-blur-2xl rounded-2xl p-8 border border-[#10b981]/10 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-emerald-300 mb-6">Sign in to access your risk dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5 uppercase tracking-widest">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-[#050a15]/60 border border-[#10b981]/15 rounded-xl text-white text-sm placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]/40 transition-all"
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#050a15]/60 border border-[#10b981]/15 rounded-xl text-white text-sm placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]/40 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl">
                <p className="text-sm text-[#ef4444]">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-50 mt-2 shadow-glow"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-emerald-400/70">Demo credentials: <span className="text-white/80">admin / admin123</span></p>
          </div>
        </div>

        <p className="text-center text-2xs text-emerald-400/50 mt-6">
          © 2026 RISK.SIM Enterprise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;