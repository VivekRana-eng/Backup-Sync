import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Icon from './components/Icon';
import { CURRENT_USER } from './data/mockFiles';
import { formatStorageSize } from './lib/workspace';
import { useWorkspace } from './hooks/useWorkspace';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StorageCards from './components/StorageCards';
import FileUploader from './components/FileUploader';
import UploadingPanel from './components/UploadingPanel';
import FilesTable from './components/FilesTable';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    files,
    uploadingFiles,
    activities,
    searchQuery,
    setSearchQuery,
    fileTypeFilter,
    setFileTypeFilter,
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
  } = useWorkspace();
  const storageUsageLabel = formatStorageSize(totalStorageUsedGB * 1024 * 1024 * 1024);

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
      />

      {/* 2. Main Content Container Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* Top Header Controls bar */}
        <Header
          activeTab={activeTab}
          currentUser={CURRENT_USER}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSettingsClick={() => setIsSettingsOpen(true)}
          openSideMenu={() => setIsSidebarMobileOpen(true)}
          totalStorageUsedGB={totalStorageUsedGB}
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

          {/* TAB 1: DASHBOARD VIEW (Default core) */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 motion-preset-fade duration-300">
              {/* Storage Overview Header with limit slider reference */}
              <div className="relative z-10 bg-white/90 backdrop-blur rounded-3xl p-6 border border-slate-200/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <Icon name="HardDrive" className="w-4.5 h-4.5 text-blue-600" /> Storage overview
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {files.length} items are currently in the workspace.
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
                    uploadingFiles={uploadingFiles}
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
                  files={files.filter((f) => !f.isArchived)}
                  onToggleStar={handleToggleStar}
                  onToggleArchive={handleToggleArchive}
                  onDeleteFile={handleDeleteFile}
                  onRenameFile={handleRenameFile}
                  onTriggerDownload={handleTriggerDownload}
                  fileTypeFilter={fileTypeFilter}
                  setFileTypeFilter={setFileTypeFilter}
                />
              </div>
            </div>
          )}

          {/* TAB 2: MY FILES FULL VIEW */}
          {activeTab === 'My Files' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <FilesTable
                files={files.filter((f) => !f.isArchived)}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteFile}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
              />
            </div>
          )}

          {/* TAB 3: SHARED WORKSPACE */}
          {activeTab === 'Shared' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 px-2.5 py-1 bg-blue-50 rounded-lg">Shared Workspace</span>
                <h2 className="text-lg font-bold text-slate-800 mt-4">Shared files</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  These are the items you've marked for team access.
                </p>
              </div>

              <FilesTable
                files={files.filter((f) => f.isShared && !f.isArchived)}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteFile}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
              />
            </div>
          )}

          {/* TAB 4: RECENTS */}
          {activeTab === 'Recents' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-slate-100 rounded-2xl p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-2.5 py-1 bg-indigo-50 rounded-lg">Recent Modifications</span>
                <h2 className="text-lg font-bold text-slate-800 mt-4">Files modified within past week</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl font-medium">
                  Automatically tracking changes made since June 6th, 2026. Sort by last modified date down below.
                </p>
              </div>

              <FilesTable
                files={files.filter((f) => {
                  // Filter out files modified on or of June 6th, 2026 or later
                  const day = parseInt(f.lastModified.substring(8, 10));
                  return f.lastModified.startsWith('2026-06') && day >= 6 && !f.isArchived;
                })}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteFile}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
              />
            </div>
          )}

          {/* TAB 5: STARRED */}
          {activeTab === 'Starred' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-100 rounded-2xl p-6 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 px-2.5 py-1 bg-amber-100/70 rounded-full">Core Favorites</span>
                  <h2 className="text-lg font-bold text-slate-800 mt-3">Starred Assets</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Keep the files you reach for most in one place.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl hidden sm:block">
                  <Icon name="Star" className="w-8 h-8 text-amber-500 fill-current" />
                </div>
              </div>

              <FilesTable
                files={files.filter((f) => f.isStarred && !f.isArchived)}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteFile}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
              />
            </div>
          )}

          {/* TAB 6: ARCHIVED */}
          {activeTab === 'Archived' && (
            <div className="space-y-4 motion-preset-fade duration-300">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2.5 py-1 bg-slate-200/50 rounded-full">Secure Cold Storage</span>
                <h2 className="text-lg font-bold text-slate-800 mt-3">Archived Records</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  These records are excluded from standard search listings and storage dashboard grids to preserve margin negative space. Restore them on-demand via the row menu.
                </p>
              </div>

              <FilesTable
                files={files.filter((f) => f.isArchived)}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteFile}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
              />
            </div>
          )}

          {/* TAB 7: ACTIVITY LOG FEED */}
          {activeTab === 'Activity Log' && (
            <div className="max-w-4xl mx-auto space-y-6 motion-preset-fade duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Recent activity</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">A quick look at what changed recently.</p>
                </div>
                <button
                  onClick={clearActivityLog}
                  className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white text-xs font-bold text-rose-500 hover:bg-rose-50 cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="bg-white border rounded-2xl p-12 text-center text-slate-400">
                    <Icon name="Activity" className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="font-bold">No activity yet</p>
                    <p className="text-xs text-slate-350 max-w-sm mx-auto mt-1">Actions taken on file states or metadata will automatically be recorded here.</p>
                  </div>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-white border border-slate-100 rounded-2xl p-4.5 flex gap-4 hover:border-slate-200 transition-all shadow-xs"
                    >
                      <img
                        src={act.user.avatar}
                        alt={act.user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <span className="text-xs font-bold text-slate-800">
                            {act.user.name === CURRENT_USER.name ? 'You' : act.user.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                        </div>
                        <p className="text-slate-600 text-xs mt-1 leading-normal font-medium">
                          <span className="text-slate-400">{act.action}</span>{' '}
                          <span className="font-bold text-slate-750">{act.target}</span>
                        </p>
                        
                        {/* Status Type Badge */}
                        <div className="mt-2.5 flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                            act.type === 'upload' 
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : act.type === 'delete'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : act.type === 'share'
                              ? 'bg-purple-50 text-purple-600 border border-purple-100'
                              : 'bg-slate-50 text-slate-600 border border-slate-100'
                          }`}>
                            {act.type}
                          </span>
                          <span className="text-[10px] text-slate-350 font-light">Logged automatically</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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

    </div>
  );
}
