import React, { useState } from 'react';
import Icon from './Icon';

export default function Login({ users, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const userRecord = users[trimmedEmail];

    if (userRecord && userRecord.password === password) {
      setIsLoading(true);
      window.setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess({
          email: trimmedEmail,
          role: userRecord.role,
          name: userRecord.name,
          avatar: userRecord.avatar,
          status: 'online',
        });
      }, 300);
      return;
    }

    setError('Invalid email or password. Please try again.');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f2] text-slate-700 font-sans p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-4 shadow-sm">
            <Icon name="Cloud" className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Backup & Sync</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Use your email and password to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4.5 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-3">
            <Icon name="AlertCircle" className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="User" className="w-4.5 h-4.5" />
              </span>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email address"
                autoComplete="username"
                className="w-full text-xs font-semibold bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white outline-none rounded-xl py-3 pl-11 pr-4 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="Lock" className="w-4.5 h-4.5" />
              </span>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full text-xs font-semibold bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white outline-none rounded-xl py-3 pl-11 pr-4 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-2xl shadow-md tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>Sign In</span>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-150 pt-5 font-semibold">
          Secure storage and synchronization panel
        </div>
      </div>
    </div>
  );
}
