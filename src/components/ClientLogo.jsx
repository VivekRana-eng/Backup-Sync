import React from 'react';
import westernLogo from '../assets/western.jpg';
import northernLogo from '../assets/northern.jpg';
import easternLogo from '../assets/eastern.jpg';
import centralLogo from '../assets/central.png';

export default function ClientLogo({ name = '', size = 'md', className = '' }) {
  const lowerName = name.toLowerCase().trim();

  let sizeClass = 'w-10 h-10 rounded-xl'; // default md
  if (size === 'lg') {
    sizeClass = 'w-12 h-12 rounded-2xl';
  } else if (size === 'sm') {
    sizeClass = 'w-8 h-8 rounded-xl';
  } else if (size === 'xs') {
    sizeClass = 'w-6 h-6 rounded-lg';
  }

  let logoSrc = null;
  if (lowerName.includes('western railway')) {
    logoSrc = westernLogo;
  } else if (lowerName.includes('northern railway')) {
    logoSrc = northernLogo;
  } else if (lowerName.includes('eastern railway')) {
    logoSrc = easternLogo;
  } else if (lowerName.includes('central railway') || lowerName.includes('centrel railway')) {
    logoSrc = centralLogo;
  }

  if (logoSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] shrink-0 select-none overflow-hidden ${sizeClass} ${className}`}
      >
        <img
          src={logoSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback to generic Indian Railways Tricolour logo if name contains 'railway' but not the specific 4
  if (lowerName.includes('railway')) {
    return (
      <div
        className={`flex items-center justify-center bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] shrink-0 select-none overflow-hidden ${sizeClass} ${className}`}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/81/Indian_Railways_Tricolour_Logo.svg"
          alt="Official Indian Railways Logo"
          className="w-[85%] h-[85%] object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Fallback initials gradient logo for non-railway clients
  const trimmed = name.trim();
  let initials = 'CL';

  if (trimmed) {
    const words = trimmed.split(/\s+/);
    if (words.length > 1) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else {
      initials = trimmed.substring(0, 2).toUpperCase();
    }
  }

  // Modern, high-end SaaS gradients
  const gradients = [
    'from-red-900/90 to-red-950',
    'from-blue-900/90 to-blue-950',
    'from-emerald-800/90 to-emerald-950',
    'from-amber-700/90 to-amber-900',
    'from-indigo-850 to-indigo-950',
    'from-violet-800/90 to-violet-950',
    'from-rose-800/90 to-rose-950',
  ];

  // Stable hashing of client name to choose color gradient
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientClass = gradients[Math.abs(hash) % gradients.length];

  let textClass = 'text-sm font-extrabold';
  if (size === 'lg') {
    textClass = 'text-base font-extrabold';
  } else if (size === 'sm') {
    textClass = 'text-xs font-extrabold';
  } else if (size === 'xs') {
    textClass = 'text-[9px] font-extrabold';
  }

  return (
    <div
      className={`flex items-center justify-center text-white bg-gradient-to-br ${gradientClass} shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),_0_4px_12px_rgba(15,23,42,0.08)] shrink-0 tracking-wider select-none ${sizeClass} ${textClass} ${className}`}
    >
      {initials}
    </div>
  );
}
