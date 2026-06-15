import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Icon from './components/Icon';
import { formatStorageSize } from './lib/workspace';
import { useWorkspace } from './hooks/useWorkspace';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StorageCards from './components/StorageCards';
import FileUploader from './components/FileUploader';
import UploadingPanel from './components/UploadingPanel';
import FilesTable from './components/FilesTable';
import FilePreviewModal from './components/FilePreviewModal';

const USERS = {
  'admin@example.com':  { password: 'admin',    role: 'admin',    name: 'Admin User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
  'viewer@example.com': { password: 'viewer',   role: 'viewer',   name: 'Viewer User', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
  'uploader@gmail.com': { password: 'uploader', role: 'uploader', name: 'Uploader User', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
};

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(() => {
    const saved = localStorage.getItem('backup_sync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);
  const [emailValue, setEmailValue] = React.useState('');
  const [passwordValue, setPasswordValue] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);

  const {
    activeTab,
    setActiveTab,
    visibleFiles,
    visibleUploadingFiles,
    activities,
    searchQuery,
    setSearchQuery,
    fileTypeFilter,
    setFileTypeFilter,
    clientShiftFilter,
    setClientShiftFilter,
    isSidebarMobileOpen,
    setIsSidebarMobileOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isFolderModalOpen,
    setIsFolderModalOpen,
    newFolderName,
    setNewFolderName,
    newFolderCategory,
    setNewFolderCategory,
    toast,
    setToast,
    triggerToast,
    computedStats,
    totalStorageUsedGB,
    starredFilesCount,
    archivedFilesCount,
    sharedFilesCount,
    handleToggleStar,
    handleToggleArchive,
    handleDeleteFile,
    handleRenameFile,
    handleTriggerDownload,
    handleFilesSelected,
    handleCancelUpload,
    handleClearAllCompleted,
    handleCreateNewFolder,
    clearActivityLog,
  } = useWorkspace(currentUser || undefined);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    if (currentPath === '/') {
      if (currentUser) {
        if (currentUser.role === 'admin') navigate('/dashboard/admin');
        else if (currentUser.role === 'viewer') navigate('/dashboard/view');
        else if (currentUser.role === 'uploader') navigate('/dashboard/upload');
      }
    } else {
      if (!currentUser) {
        navigate('/');
      } else {
        if (currentPath === '/dashboard/admin' && currentUser.role !== 'admin') {
          navigate('/');
        } else if (currentPath === '/dashboard/view' && currentUser.role !== 'viewer') {
          navigate('/');
        } else if (currentPath === '/dashboard/upload' && currentUser.role !== 'uploader') {
          navigate('/');
        } else if (
          currentPath !== '/dashboard/admin' &&
          currentPath !== '/dashboard/view' &&
          currentPath !== '/dashboard/upload'
        ) {
          if (currentUser.role === 'admin') navigate('/dashboard/admin');
          else if (currentUser.role === 'viewer') navigate('/dashboard/view');
          else if (currentUser.role === 'uploader') navigate('/dashboard/upload');
          else navigate('/');
        }
      }
    }
  }, [currentPath, currentUser]);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin' && activeTab !== 'Dashboard' && activeTab !== 'All Files' && activeTab !== 'Users' && activeTab !== 'Settings') {
        setActiveTab('Dashboard');
      } else if (currentUser.role === 'viewer' && activeTab !== 'Browse Files' && activeTab !== 'Downloads') {
        setActiveTab('Browse Files');
      } else if (currentUser.role === 'uploader' && activeTab !== 'Upload Files' && activeTab !== 'My Uploads') {
        setActiveTab('Upload Files');
      }
    }
  }, [currentUser, activeTab]);

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setPasswordError('');

    const trimmedEmail = emailValue.trim().toLowerCase();
    const userRecord = USERS[trimmedEmail];

    if (userRecord && userRecord.password === passwordValue) {
      const loggedUser = {
        email: trimmedEmail,
        role: userRecord.role,
        name: userRecord.name,
        avatar: userRecord.avatar,
        status: 'online'
      };
      localStorage.setItem('backup_sync_user', JSON.stringify(loggedUser));
      setCurrentUser(loggedUser);
    } else {
      setPasswordError('Incorrect email or password. Please try again.');
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('backup_sync_user');
    setCurrentUser(null);
    setEmailValue('');
    setPasswordValue('');
    setPasswordError('');
    navigate('/');
  };

  const storageUsageLabel = formatStorageSize(totalStorageUsedGB * 1024 * 1024 * 1024);
  const handleOpenPreview = (file) => setSelectedFile(file);
  const handleDeleteAndClosePreview = (id) => {
    setSelectedFile((current) => (current?.id === id ? null : current));
    handleDeleteFile(id);
  };

  if (!currentUser || currentPath === '/') {
    return (
      <div className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-slate-50 font-sans text-slate-800 antialiased p-4 select-none">
        <div className="bg-white border border-slate-150 rounded-3xl p-8 max-w-md w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.05),0_30px_50px_-20px_rgba(0,0,0,0.15)] relative z-10">
          {/* Logo header */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-md shadow-black/20 shrink-0">
              <Icon name="Cloud" className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-black tracking-tight leading-none">Backup & Sync</h1>
              <span className="text-[10px] block font-extrabold text-slate-400 uppercase tracking-widest mt-1">Personal Plan</span>
            </div>
          </div>

          {/* Divider line */}
          <div className="border-t border-slate-100 my-5" />

          {/* Heading */}
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold text-black tracking-tight">Sign in</h2>
            <p className="text-xs text-slate-400 font-medium">to access your workspace files and transfers.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {passwordError && (
              <div id="login-error-msg" className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2">
                <Icon name="Trash2" className="w-4 h-4 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400" htmlFor="login-email-input">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Icon name="Mail" className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  id="login-email-input"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 outline-none shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.05)] focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400" htmlFor="login-password-input">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Icon name="Lock" className="w-4.5 h-4.5" />
                </div>
                <input
                  type="password"
                  id="login-password-input"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 outline-none shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.05)] focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              id="login-continue-btn"
              className="w-full py-3 mt-2 bg-black hover:bg-neutral-900 text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <span className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
              Protected by Backup & Sync 🛡️
            </span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#f4f1ea] font-sans text-slate-600 antialiased">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_28%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
      
      {/* 1. Left Sidebar - Persistent on desktop, drawer on mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        starredCount={starredFilesCount}
        archivedCount={archivedFilesCount}
        sharedCount={sharedFilesCount}
        isMobileOpen={isSidebarMobileOpen}
        setIsMobileOpen={setIsSidebarMobileOpen}
        onNewFolderClick={() => setIsFolderModalOpen(true)}
        userRole={currentUser?.role}
        onLogoutClick={handleLogOut}
      />

      {/* 2. Main Content Container Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* Top Header Controls bar */}
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clientShiftFilter={clientShiftFilter}
          setClientShiftFilter={setClientShiftFilter}
          onSettingsClick={() => setIsSettingsOpen(true)}
          openSideMenu={() => setIsSidebarMobileOpen(true)}
          totalStorageUsedGB={totalStorageUsedGB}
          userRole={currentUser?.role}
          onLogOut={handleLogOut}
        />

        {/* Inner Scrollable Workspace Box */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* Toast Notification Box */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3.5 rounded-xl border shadow-xl bg-white text-xs sm:text-sm font-semibold max-w-sm"
              >
                {toast.type === 'success' && (
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Icon name="CheckCircle" className="w-4.5 h-4.5 fill-current text-white bg-emerald-600 rounded-full" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="p-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                    <Icon name="Info" className="w-4.5 h-4.5 fill-current text-white bg-blue-600 rounded-full" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="p-1 rounded-md bg-rose-50 text-rose-500 border border-rose-100">
                    <Icon name="Trash2" className="w-4.5 h-4.5 text-rose-600" />
                  </div>
                )}
                <p className="text-slate-700 font-bold leading-normal flex-1">{toast.message}</p>
                <button
                  onClick={() => setToast(null)}
                  className="text-slate-300 hover:text-slate-500 leading-none text-base font-bold cursor-pointer p-0.5"
                >
                  &times;
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- ADMIN ROLE VIEW TABS --- */}
          {currentUser?.role === 'admin' && activeTab === 'Dashboard' && (
            <div className="space-y-6 motion-preset-fade duration-300">
              {/* Storage Overview Header with limit slider reference */}
              <div className="relative z-10 bg-white/90 backdrop-blur rounded-3xl p-6 border border-slate-200/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <Icon name="HardDrive" className="w-4.5 h-4.5 text-blue-600" /> Storage overview
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {visibleFiles.length} items are currently shown for this client shift.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Used Space</span>
                    <span className="text-sm font-extrabold text-blue-600">{storageUsageLabel}</span>
                  </div>
                  <div className="h-9 w-px bg-slate-100 hidden sm:block" />
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 font-semibold rounded-xl text-xs text-slate-650 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    Workspace settings
                  </button>
                </div>
              </div>

              {/* Storage cards */}
              <StorageCards
                filesStats={computedStats}
                activeFilter={fileTypeFilter}
                setActiveFilter={setFileTypeFilter}
              />

              {/* FILE UPLOAD GRID (Uploader left, Uploading history right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Upload files</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Recent uploads</span>
                  </div>
                  <FileUploader onFilesSelected={handleFilesSelected} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 font-bold text-slate-500">Transfer queue</h3>
                    <span className="text-[10px] text-slate-400 font-semibold text-slate-500">Live progress</span>
                  </div>
                  <UploadingPanel
                    uploadingFiles={visibleUploadingFiles}
                    onCancelUpload={handleCancelUpload}
                    onClearAllCompleted={handleClearAllCompleted}
                  />
                </div>
              </div>

              {/* MAIN CONTENT TABLE: Dashboard List View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 text-slate-500">Files</h3>
                  {fileTypeFilter !== 'all' && (
                    <button
                      onClick={() => setFileTypeFilter('all')}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
                <FilesTable
                  files={visibleFiles.filter((f) => !f.isArchived)}
                  onToggleStar={handleToggleStar}
                  onToggleArchive={handleToggleArchive}
                  onDeleteFile={handleDeleteAndClosePreview}
                  onRenameFile={handleRenameFile}
                  onTriggerDownload={handleTriggerDownload}
                  onFileSelect={handleOpenPreview}
                  fileTypeFilter={fileTypeFilter}
                  setFileTypeFilter={setFileTypeFilter}
                  userRole={currentUser?.role}
                />
              </div>
            </div>
          )}

          {currentUser?.role === 'admin' && activeTab === 'All Files' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">All Files</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore all active assets across this storage partition.</p>
              </div>
              <FilesTable
                files={visibleFiles.filter((f) => !f.isArchived)}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteAndClosePreview}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                onFileSelect={handleOpenPreview}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
                userRole={currentUser?.role}
              />
            </div>
          )}

          {currentUser?.role === 'admin' && activeTab === 'Users' && (
            <div className="space-y-6 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Authorized Users</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage user access control lists and credentials.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.values(USERS).map((user) => (
                      <tr key={user.email} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-xs font-bold text-slate-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-650">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                            user.role === 'admin' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            user.role === 'viewer' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {user.role === 'viewer' ? 'View Only' : user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Online
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentUser?.role === 'admin' && activeTab === 'Settings' && (
            <div className="space-y-6 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Workspace Settings</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Configure system defaults, replication factors, and storage rules.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Storage Preferences</h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-700">Faster Upload Transfers</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Allow concurrent chunked uploads to speed up transfer rates.</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-700">Automatic Cleanup</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Automatically move deleted files to the secure cold vault after 30 days.</span>
                      </div>
                      <input type="checkbox" className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEWER ROLE VIEW TABS --- */}
          {currentUser?.role === 'viewer' && activeTab === 'Browse Files' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Browse Files</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">View and download synced files from this backup volume.</p>
              </div>
              <FilesTable
                files={visibleFiles.filter((f) => !f.isArchived)}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteAndClosePreview}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                onFileSelect={handleOpenPreview}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
                userRole={currentUser?.role}
              />
            </div>
          )}

          {currentUser?.role === 'viewer' && activeTab === 'Downloads' && (
            <div className="space-y-6 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Downloads</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">View and fetch files available for offline usage.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-450 shadow-sm">
                <Icon name="Download" className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">Download History</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Select and download any file from Browse Files. Synced files will be logged here.</p>
              </div>
            </div>
          )}

          {/* --- UPLOADER ROLE VIEW TABS --- */}
          {currentUser?.role === 'uploader' && activeTab === 'Upload Files' && (
            <div className="space-y-6 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Upload Files</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Drag and drop files to securely add them to Backup & Sync.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <FileUploader onFilesSelected={handleFilesSelected} />
                </div>
                <div className="space-y-2">
                  <UploadingPanel
                    uploadingFiles={visibleUploadingFiles}
                    onCancelUpload={handleCancelUpload}
                    onClearAllCompleted={handleClearAllCompleted}
                  />
                </div>
              </div>
            </div>
          )}

          {currentUser?.role === 'uploader' && activeTab === 'My Uploads' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">My Uploads</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">List of files uploaded during this session, with confirmation marks.</p>
              </div>
              <FilesTable
                files={visibleFiles.filter((f) => !f.isArchived && (f.owner.email === 'uploader@gmail.com' || f.owner.email === currentUser?.email))}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteAndClosePreview}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                onFileSelect={handleOpenPreview}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
                userRole={currentUser?.role}
              />
            </div>
          )}

        </main>
      </div>

      {/* --- SETTINGS MODAL DIALOG --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal main content card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Database" className="w-5 h-5 text-blue-600" />
                  <span className="font-extrabold text-sm text-slate-800 tracking-tight">Storage settings</span>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 leading-none text-xl p-1 cursor-pointer hover:bg-slate-100 rounded-lg"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Team Collaboration Toggles */}
                <div>
                  <h3 className="font-bold text-xs text-slate-450 uppercase tracking-wider mb-2 text-slate-500">Workspace settings</h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl bg-white">
                    <div className="flex items-center justify-between p-3.5">
                      <div className="min-w-0 pr-4">
                        <span className="block text-xs font-bold text-slate-700">Faster uploads</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                          Keep multiple file transfers moving together.
                        </span>
                      </div>
                      <input
                        aria-label="Toggle faster uploads"
                        type="checkbox"
                        defaultChecked
                        className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3.5">
                      <div className="min-w-0 pr-4">
                        <span className="block text-xs font-bold text-slate-700">Auto-clean deleted files</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                          Send deleted files to archive after 30 days.
                        </span>
                      </div>
                      <input
                        aria-label="Toggle Automatic Trash Clean-up"
                        type="checkbox"
                        className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4.5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close Settings
                </button>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    triggerToast('Workspace settings saved', 'success');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CREATE NEW FOLDER MODAL --- */}
      <AnimatePresence>
        {isFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFolderModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800">Create New Folder</span>
                <button
                  onClick={() => setIsFolderModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 leading-none text-xl p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Folder Directory Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 text-slate-500">
                    Parent Storage Section
                  </label>
                  <select
                    value={newFolderCategory}
                    onChange={(e) => setNewFolderCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-bold text-slate-650 outline-none"
                  >
                    <option value="Docs">Docs (Documents)</option>
                    <option value="Images">Images (Designs & Assets)</option>
                    <option value="Videos">Videos (Marketing clips)</option>
                    <option value="Audio">Audio (Raw Media files)</option>
                    <option value="Backups">Backups (Compressed systems)</option>
                    <option value="Vectors">Vectors</option>
                  </select>
                </div>

                {/* Folder Text Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 text-slate-500">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. DesignSpecs, Finance2026, Releases"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-semibold text-slate-750 outline-none focus:border-blue-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateNewFolder();
                    }}
                  />
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewFolder}
                  disabled={!newFolderName.trim()}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl text-white shadow-xs cursor-pointer ${
                    newFolderName.trim() 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-slate-300 pointer-events-none'
                  }`}
                >
                  Create Folder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFile && (
          <FilePreviewModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onDownload={handleTriggerDownload}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
