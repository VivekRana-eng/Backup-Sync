import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { DEFAULT_RAILWAY_CLIENT, formatStorageSize, RAILWAY_CLIENTS } from '../lib/workspace';

export default function Header({
  activeTab,
  currentUser,
  searchQuery,
  setSearchQuery,
  clientShiftFilter,
  setClientShiftFilter,
  onSettingsClick,
  openSideMenu,
  totalStorageUsedGB,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Upload complete',
      text: 'Annual_Feedback_Report_2026.xlsx finished uploading.',
      time: 'Just now',
      unread: true,
      type: 'success'
    },
    {
      id: 'n2',
      title: 'Shared file updated',
      text: 'Alex Rivera edited Project_Financial_Report_2026.',
      time: '2 hours ago',
      unread: true,
      type: 'info'
    },
    {
      id: 'n3',
      title: 'Storage reminder',
      text: 'Your document folder is getting close to its limit.',
      time: '1 day ago',
      unread: false,
      type: 'warning'
    }
  ]);

  const profileRef = useRef(null);
  const bellRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;
  const storageLabel = formatStorageSize(totalStorageUsedGB * 1024 * 1024 * 1024);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header id="app-header" className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Page Title & Hamburger section */}
      <div className="flex items-center gap-3">
        <button
          id="toggle-mobile-sidebar"
          onClick={openSideMenu}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
        >
          <Icon name="Menu" className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block">
          {activeTab === 'Dashboard' ? (
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                Backup & Sync
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Keep your files, uploads, and folders in one place
              </p>
            </div>
          ) : (
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {activeTab}
            </h1>
          )}
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-6 md:mx-12">
        <div className="relative">
          <Icon name="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files, folders, members..."
            className="w-full text-sm bg-slate-50/85 hover:bg-slate-100/75 focus:bg-white text-slate-700 placeholder-slate-400 border border-transparent focus:border-blue-400/80 outline-none rounded-xl py-2 pl-10 pr-4 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5">
          <Icon name="Filter" className="w-4 h-4 text-slate-400" />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Client shift</span>
            <select
              id="client-shift-select"
              value={clientShiftFilter}
              onChange={(e) => setClientShiftFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer max-w-[180px]"
            >
              <option value={DEFAULT_RAILWAY_CLIENT}>{DEFAULT_RAILWAY_CLIENT}</option>
              {RAILWAY_CLIENTS.filter((client) => client !== DEFAULT_RAILWAY_CLIENT).map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Settings button */}
        <button
          id="theme-settings-toggle-btn"
          onClick={onSettingsClick}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative"
          title="Settings"
        >
          <Icon name="Settings" className="w-5.5 h-5.5" />
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={bellRef}>
          <button
            id="notifications-bell-btn"
            onClick={() => setBellOpen(!bellOpen)}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative"
          >
            <Icon name="Bell" className="w-5.5 h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-bounce" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {bellOpen && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <span className="font-bold text-sm text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                    <Icon name="CheckCircle2" className="w-8 h-8 text-slate-350" />
                    <p>all quiet, no new alerts</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 flex gap-3 hover:bg-slate-50/70 transition-colors relative ${
                        notif.unread ? 'bg-blue-50/15' : ''
                      }`}
                    >
                      {notif.type === 'success' && (
                        <Icon name="CheckCircle2" className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {notif.type === 'info' && (
                        <Icon name="CheckCircle2" className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      {notif.type === 'warning' && (
                        <Icon name="AlertCircle" className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs block ${notif.unread ? 'font-bold text-slate-800' : 'font-semibold text-slate-600'}`}>
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{notif.text}</p>
                      </div>

                      <button
                        onClick={(e) => removeNotification(notif.id, e)}
                        className="text-slate-350 hover:text-slate-500 text-xs self-start p-1 rounded-sm hover:bg-slate-100 cursor-pointer"
                        title="Dismiss"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-2 border-t border-slate-50 text-center">
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 py-1.5 w-full rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    Clear All Alerts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Trigger */}
        <div className="relative" ref={profileRef}>
          <button
            id="profile-dropdown-trigger"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-50 cursor-pointer"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-50"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-slate-700 block max-w-[100px] truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate font-light leading-none">
                Personal Plan
              </span>
            </div>
            <Icon name="ChevronDown" className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div
              id="profile-dropdown-card"
              className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200"
            >
              {/* Profile Card Header */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-50">
                <div className="flex gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-slate-800 block truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-slate-400 block truncate mt-0.5">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                {/* Storage Quick Info */}
                <div className="mt-3.5 bg-white border border-slate-100 rounded-xl p-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">Your Storage</span>
                    <span className="font-bold text-slate-800">{storageLabel}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onSettingsClick();
                  }}
                  className="w-full text-slate-600 hover:text-slate-900 flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all text-left cursor-pointer"
                >
                  <Icon name="User" className="w-4 h-4 text-slate-400" />
                  <span>My Profile Details</span>
                </button>
                <button
                  onClick={() => alert('Billing settings are not connected yet.')}
                  className="w-full text-slate-600 hover:text-slate-900 flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all text-left cursor-pointer"
                >
                  <Icon name="CreditCard" className="w-4 h-4 text-slate-400" />
                  <span>Billing & Subscription</span>
                </button>
                <button
                  onClick={() => alert('Security settings are not connected yet.')}
                  className="w-full text-slate-600 hover:text-slate-900 flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all text-left cursor-pointer"
                >
                  <Icon name="Shield" className="w-4 h-4 text-slate-400" />
                  <span>Security & API Keys</span>
                </button>
              </div>

              {/* Logout Action */}
              <div className="p-1 border-t border-slate-50">
                <button
                  id="sign-out-btn"
                  onClick={() => alert('Sign out is not connected yet.')}
                  className="w-full text-rose-500 hover:text-rose-600 flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold hover:bg-rose-50 transition-all text-left cursor-pointer"
                >
                  <Icon name="LogOut" className="w-4 h-4" />
                  <span>Sign Out Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
