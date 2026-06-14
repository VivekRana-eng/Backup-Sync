import React from 'react';
import Icon from './Icon';

export default function Sidebar({
  activeTab,
  setActiveTab,
  starredCount,
  archivedCount,
  sharedCount,
  isMobileOpen,
  setIsMobileOpen,
  onNewFolderClick
}) {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'My Files', label: 'My Files', icon: 'FileCode' },
    { id: 'Shared', label: 'Shared', icon: 'Users', badge: sharedCount > 0 ? sharedCount : undefined },
    { id: 'Recents', label: 'Recents', icon: 'Clock' },
    { id: 'Starred', label: 'Starred', icon: 'Star', badge: starredCount > 0 ? starredCount : undefined, badgeColor: 'bg-amber-100 text-amber-700 font-semibold' },
    { id: 'Archived', label: 'Archived', icon: 'Archive', badge: archivedCount > 0 ? archivedCount : undefined, badgeColor: 'bg-gray-100 text-gray-700' },
    { id: 'Activity Log', label: 'Activity Log', icon: 'Activity' },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}
      >
        {/* Sidebar Header: Logo & Title */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Icon name="Cloud" className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">Backup & Sync</span>
              <span className="text-[10px] block font-medium text-blue-600 -mt-1 tracking-wider uppercase">Personal</span>
            </div>
          </div>
          <button
            id="close-sidebar-btn"
            className="p-1 px-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Create / Add File */}
        <div className="px-5 pt-5 pb-2">
          <button
            id="create-new-folder-btn"
            onClick={onNewFolderClick}
            className="w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer active:scale-[0.98]"
          >
            <Icon name="Plus" className="w-4 h-4" />
            <span>New folder</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-50/85 text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      item.badgeColor || 'bg-blue-100/70 text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>


      </aside>
    </>
  );
}
