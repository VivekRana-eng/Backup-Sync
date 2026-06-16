import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { formatStorageSize } from '../lib/workspace';

export default function Header({
  activeTab,
  currentUser,
  searchQuery,
  setSearchQuery,
  onSettingsClick,
  onProfileClick,
  openSideMenu,
  totalStorageUsedGB,
  userRole,
  onLogOut,
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
  const profileMobileRef = useRef(null);
  const bellRef = useRef(null);
  const bellMobileRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedProfile = (profileRef.current && profileRef.current.contains(event.target)) ||
                             (profileMobileRef.current && profileMobileRef.current.contains(event.target));
      if (!clickedProfile) {
        setProfileOpen(false);
      }
      const clickedBell = (bellRef.current && bellRef.current.contains(event.target)) ||
                          (bellMobileRef.current && bellMobileRef.current.contains(event.target));
      if (!clickedBell) {
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
    <header
      id="app-header"
      className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-xs md:px-6 md:py-0 md:h-16 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      {/* Top Row: Mobile menu + search */}
      <div className="flex items-center gap-2 w-full md:w-auto md:justify-start">
        <button
          id="toggle-mobile-sidebar"
          onClick={openSideMenu}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
        >
          <Icon name="Menu" className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block md:hidden">
          {activeTab === 'Dashboard' ? (
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                Backup & Sync
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Keep your files, uploads, and folders in one place
              </p>
            </div>
          ) : (
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {activeTab}
            </h1>
          )}
        </div>

        <div className="flex-1 md:hidden">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="global-search-input-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            className="w-full text-xs bg-slate-50/85 hover:bg-slate-100/75 focus:bg-white text-slate-800 placeholder-slate-400 border border-transparent focus:border-slate-300 outline-none rounded-xl py-2 pl-9 pr-3 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="hidden md:block md:flex-1 md:max-w-md md:mx-12">
        <div className="relative">
          <Icon name="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files, folders, members..."
          className="w-full text-sm bg-slate-50/85 hover:bg-slate-100/75 focus:bg-white text-slate-800 placeholder-slate-400 border border-transparent focus:border-slate-300 outline-none rounded-xl py-2 pl-10 pr-4 transition-all"
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

      {/* Desktop Controls */}
      <div className="hidden md:flex items-center gap-3">


        <button
          id="theme-settings-toggle-btn"
          onClick={onSettingsClick}
          className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer relative"
          title="Settings"
        >
          <Icon name="Settings" className="w-5.5 h-5.5" />
        </button>

        <div className="relative" ref={bellRef}>
          <button
            id="notifications-bell-btn"
            onClick={() => setBellOpen(!bellOpen)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer relative"
          >
            <Icon name="Bell" className="w-5.5 h-5.5" />
            {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-slate-900 rounded-full ring-2 ring-white animate-bounce" />
            )}
          </button>

          {bellOpen && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-sm z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <span className="font-bold text-sm tracking-tight text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold tracking-tight text-slate-900 hover:text-black cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                    <Icon name="CheckCircle2" className="w-8 h-8 text-slate-300" />
                    <p>all quiet, no new alerts</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 flex gap-3 hover:bg-slate-50/70 transition-colors relative ${
                        notif.unread ? 'bg-slate-50' : ''
                      }`}
                    >
                      {notif.type === 'success' && (
                        <Icon name="CheckCircle2" className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                      )}
                      {notif.type === 'info' && (
                        <Icon name="CheckCircle2" className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                      )}
                      {notif.type === 'warning' && (
                        <Icon name="AlertCircle" className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
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
                    className="text-xs font-semibold text-slate-900 hover:text-black py-1.5 w-full rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Clear All Alerts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Badge */}
        {userRole === 'admin' && (
          <span id="role-badge" className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg tracking-wider uppercase shadow-xs">
            Admin
          </span>
        )}
        {userRole === 'viewer' && (
          <span id="role-badge" className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 rounded-lg tracking-wider uppercase shadow-xs">
            View Only
          </span>
        )}
        {userRole === 'uploader' && (
          <span id="role-badge" className="px-2.5 py-1 text-xs font-bold text-white bg-amber-600 rounded-lg tracking-wider uppercase shadow-xs">
            Uploader
          </span>
        )}

        <div className="relative" ref={profileRef}>
          <button
            id="profile-dropdown-trigger"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 cursor-pointer"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-100"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-slate-700 block max-w-[100px] truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate font-light leading-none">
                {userRole === 'admin' ? 'Personal Plan (Admin)' : userRole === 'viewer' ? 'Personal Plan (Viewer)' : 'Personal Plan'}
              </span>
            </div>
            <Icon name="ChevronDown" className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div
              id="profile-dropdown-card"
              className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-sm z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200"
            >
              <div className="p-4 bg-slate-50/60 border-b border-slate-100">
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

                <div className="mt-3.5 rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold tracking-tight text-slate-500">Your Storage</span>
                    <span className="font-bold text-slate-800">{storageLabel}</span>
                  </div>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onProfileClick) onProfileClick();
                  }}
                  className="group w-full text-slate-700 hover:text-white flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all text-left cursor-pointer hover:bg-slate-900"
                >
                  <Icon name="User" className="w-4 h-4 text-slate-400 transition-colors group-hover:text-white" />
                  <span>My Profile Details</span>
                </button>
              </div>

              <div className="p-1 border-t border-slate-50">
                <button
                  id="sign-out-btn"
                  onClick={() => {
                    setProfileOpen(false);
                    if (onLogOut) onLogOut();
                  }}
                  className="group w-full text-slate-900 hover:text-white flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold tracking-tight transition-all text-left cursor-pointer hover:bg-slate-900"
                >
                  <Icon name="LogOut" className="w-4 h-4 transition-colors group-hover:text-white" />
                  <span>Sign Out Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center justify-end gap-2 md:hidden">
        {userRole === 'admin' && (
          <button
            id="theme-settings-toggle-btn-mobile"
            onClick={onSettingsClick}
            className="p-2 text-slate-400 hover:text-slate-650 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative shrink-0"
            title="Settings"
          >
            <Icon name="Settings" className="w-5.5 h-5.5" />
          </button>
        )}

        <div className="relative shrink-0" ref={bellMobileRef}>
          <button
            id="notifications-bell-btn-mobile"
            onClick={() => setBellOpen(!bellOpen)}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative"
          >
            <Icon name="Bell" className="w-5.5 h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-slate-900 rounded-full ring-2 ring-white animate-bounce" />
            )}
          </button>
        </div>

        {onLogOut && (
          <button
            id="sign-out-btn-mobile"
            onClick={onLogOut}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Logout"
          >
            <Icon name="LogOut" className="w-5.5 h-5.5" />
          </button>
        )}

        {/* Dynamic Mobile Badge */}
        {userRole === 'admin' && (
          <span id="role-badge-mobile" className="px-2.5 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-lg tracking-wider uppercase shadow-xs mr-1">
            Admin
          </span>
        )}
        {userRole === 'viewer' && (
          <span id="role-badge-mobile" className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 rounded-lg tracking-wider uppercase shadow-xs mr-1">
            View Only
          </span>
        )}
        {userRole === 'uploader' && (
          <span id="role-badge-mobile" className="px-2.5 py-1 text-[10px] font-bold text-white bg-amber-600 rounded-lg tracking-wider uppercase shadow-xs mr-1">
            Uploader
          </span>
        )}

        <div className="relative shrink-0" ref={profileMobileRef}>
          <button
            id="profile-dropdown-trigger-mobile"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-50 cursor-pointer"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-100"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
