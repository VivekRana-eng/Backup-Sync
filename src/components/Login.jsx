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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f3f4f6] text-slate-700 font-sans p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/logo.png"
            alt="Degree 360"
            className="w-12 h-12 object-contain shrink-0"
          />
          <div>
            <div className="text-base font-bold text-black leading-tight">Degree 360 CMS</div>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-5" />

        <div className="mb-6">
          <h1 className="text-xl font-bold text-black">Sign in</h1>
          <p className="text-xs text-gray-500 mt-1">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2">
            <Icon name="AlertCircle" className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              EMAIL
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="Mail" className="w-4 h-4" />
              </span>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                className="w-full text-xs font-semibold border border-gray-200 focus:border-black outline-none rounded-lg py-3 pl-9 pr-4 transition-colors text-black placeholder-gray-400 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="Lock" className="w-4.5 h-4.5" />
              </span>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full text-xs font-semibold border border-gray-200 focus:border-black outline-none rounded-lg py-3 pl-9 pr-4 transition-colors text-black placeholder-gray-400 bg-white"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-red-900 hover:bg-red-950 text-white text-xs font-bold rounded-lg tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span>Connecting...</span>
            ) : (
              <span>Continue →</span>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
          <Icon name="Shield" className="w-3.5 h-3.5 text-gray-400" />
          <span>Protected by Degree 360 CMS</span>
        </div>
      </div>
    </div>
  );
}
