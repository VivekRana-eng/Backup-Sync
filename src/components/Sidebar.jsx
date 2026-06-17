import React from 'react';
import Icon from './Icon';

export default function Sidebar({
  activeTab,
  setActiveTab,
  archivedCount,
  isMobileOpen,
  setIsMobileOpen,
  onAddClientClick,
  clientShiftFilter,
  setClientShiftFilter,
  clientShiftOptions = [],
  userRole,
  onLogoutClick,
}) {
  const [isClientShiftOpen, setIsClientShiftOpen] = React.useState(false);

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'Clients', label: 'Clients', icon: 'Users' },
    { id: 'My Files', label: 'My Files', icon: 'FileCode' },
    { id: 'Archived', label: 'Archived', icon: 'Archive', badge: archivedCount > 0 ? archivedCount : undefined, badgeColor: 'bg-gray-100 text-gray-700' },
    { id: 'Activity Log', label: 'Activity Log', icon: 'Activity' },
  ].filter((item) => {
    if (userRole === 'viewer' || userRole === 'uploader') {
      return item.id === 'Dashboard' || item.id === 'My Files';
    }
    return true;
  });

  React.useEffect(() => {
    if ((userRole === 'viewer' || userRole === 'uploader') && activeTab !== 'Dashboard' && activeTab !== 'My Files') {
      setActiveTab('Dashboard');
    }
  }, [activeTab, setActiveTab, userRole]);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const handleClientShiftSelect = (client) => {
    setClientShiftFilter(client);
    setIsClientShiftOpen(false);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Degree 360"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">Degree 360 CMS</span>
              <span className="text-[10px] block font-medium text-slate-500 -mt-1 tracking-wider uppercase">Personal</span>
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

        {userRole === 'admin' && (
          <div className="px-5 pt-5 pb-3">
            <button
              id="add-client-btn"
              
              className="group relative w-full h-11 flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-red-900 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(0,0,0,0.18)] transition-all hover:bg-red-950 hover:shadow-[0_22px_40px_rgba(0,0,0,0.22)] active:scale-[0.98]"
            >
              <Icon name="Plus" className="w-4 h-4" />
              <span>Add folder</span>
            </button>
          </div>
        )}

        <div className="px-5 pb-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Client shifter</p>
              <div className="mt-2 h-1.5 w-10 rounded-full bg-red-900" />
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsClientShiftOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                <span className="max-w-[110px] truncate text-xs font-semibold tracking-tight">{clientShiftFilter}</span>
                <Icon
                  name="ChevronDown"
                  className={`h-4 w-4 transition-transform duration-200 ${isClientShiftOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isClientShiftOpen && (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                  {clientShiftOptions.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-400">No clients yet</div>
                  ) : (
                    clientShiftOptions.map((client) => {
                      const isActive = clientShiftFilter === client;

                      return (
                        <button
                          key={client}
                          type="button"
                          onClick={() => handleClientShiftSelect(client)}
                          className={`flex h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-semibold tracking-tight transition-all ${
                            isActive
                              ? 'bg-red-900 text-white shadow-md shadow-black/15'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-3">{client}</span>
                          {isActive ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                              <Icon name="Check" className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-slate-300" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative w-full flex items-center justify-between overflow-hidden px-4 py-3 rounded-2xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-red-50 text-red-900 font-semibold shadow-[0_10px_22px_rgba(0,0,0,0.08)]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-red-900" />}
                <div className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-red-900' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {onLogoutClick && (
          <div className="p-3 border-t border-slate-50">
            <button
              type="button"
              onClick={onLogoutClick}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon name="LogOut" className="w-4 h-4 text-slate-400" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
