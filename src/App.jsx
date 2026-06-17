import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import Icon from './components/Icon';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StorageCards from './components/StorageCards';
import FileUploader from './components/FileUploader';
import UploadingPanel from './components/UploadingPanel';
import FilesTable from './components/FilesTable';
import FilePreviewModal from './components/FilePreviewModal';
import UploadDestinationModal from './components/UploadDestinationModal';
import AddMemberModal from './components/AddMemberModal';
import AddClientModal from './components/AddClientModal';
import ProfileModal from './components/ProfileModal';
import ClientsView from './components/ClientsView';

import { CURRENT_USER } from './data/mockFiles';
import { useWorkspace } from './hooks/useWorkspace';
import { buildUploadQueue, formatStorageSize } from './lib/workspace';

const DEFAULT_USERS = {
  'admin@example.com': {
    password: 'admin',
    role: 'admin',
    name: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  },
  'viewer@example.com': {
    password: 'viewer',
    role: 'viewer',
    name: 'Viewer Only',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
  'uploader@example.com': {
    password: 'uploader',
    role: 'uploader',
    name: 'Uploader',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop',
  },
};

const DEFAULT_CLIENT_SHIFTS = [
  'Northern Railway',
  'Eastern Railway',
  'Central Railway',
  'Western Railway',
];

function WorkspaceScreen({ currentUser, onLogout, users, setUsers, clientShiftOptions, setClientShiftOptions }) {
  const {
    activeTab,
    setActiveTab,
    files,
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
    archivedFilesCount,
    handleToggleArchive,
    handleDeleteFile,
    handleRenameFile,
    handleTriggerDownload,
    enqueueUploads,
    handleCancelUpload,
    handleClearAllCompleted,
    handleCreateNewFolder,
    clearActivityLog,
  } = useWorkspace(currentUser);

  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [isUploadDestinationOpen, setIsUploadDestinationOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pendingUploadsRef = useRef([]);

  const userRole = currentUser.role || 'viewer';
  const canUpload = userRole !== 'viewer';
  const canDownload = true;
  const storageUsageLabel = formatStorageSize(totalStorageUsedGB * 1024 * 1024 * 1024);

  const handleOpenPreview = (file) => setSelectedFile(file);

  const handlePrepareUploads = (selectedFiles) => {
    const uploads = buildUploadQueue(selectedFiles, clientShiftFilter);
    pendingUploadsRef.current = uploads;
    setPendingUploads(uploads);
    setIsUploadDestinationOpen(true);
  };

  const handleUpdatePendingUploadDestination = (fileId, folderCategory) => {
    setPendingUploads((currentUploads) => {
      const nextUploads = currentUploads.map((file) => (file.id === fileId ? { ...file, folderCategory } : file));
      pendingUploadsRef.current = nextUploads;
      return nextUploads;
    });
  };

  const handleUpdatePendingUploadDate = (fileId, uploadDate) => {
    setPendingUploads((currentUploads) => {
      const nextUploads = currentUploads.map((file) => (file.id === fileId ? { ...file, uploadDate } : file));
      pendingUploadsRef.current = nextUploads;
      return nextUploads;
    });
  };

  const handleConfirmPendingUploads = () => {
    enqueueUploads(pendingUploadsRef.current);
    setPendingUploads([]);
    pendingUploadsRef.current = [];
    setIsUploadDestinationOpen(false);
  };

  const handleClosePendingUploads = () => {
    setPendingUploads([]);
    pendingUploadsRef.current = [];
    setIsUploadDestinationOpen(false);
  };

  const handleDeleteAndClosePreview = (id) => {
    setSelectedFile((current) => (current?.id === id ? null : current));
    handleDeleteFile(id);
  };

  const handleCreateClient = async ({ name, org, department }) => {
    const trimmedName = name.trim();
    const trimmedOrg = org.trim();
    const trimmedDepartment = department.trim();

    if (!trimmedName || !trimmedOrg || !trimmedDepartment) {
      return { ok: false, message: 'Please fill in name, ORG, and department.' };
    }

    const clientLabel = `${trimmedName} ${trimmedDepartment.toLowerCase()}`;
    const duplicate = clientShiftOptions.some(
      (client) => client.toLowerCase() === clientLabel.toLowerCase(),
    );

    if (duplicate) {
      return { ok: false, message: 'That client already exists.' };
    }

    setClientShiftOptions((current) => [...current, clientLabel]);
    setClientShiftFilter(clientLabel);
    setActiveTab('Dashboard');
    setToast({
      id: Date.now().toString(),
      message: `Added client: ${clientLabel} (${trimmedOrg})`,
      type: 'success',
    });

    return { ok: true, clientLabel };
  };

  const handleCreateMember = async ({ name, email, password, role }) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      return { ok: false, message: 'Please fill in all member fields.' };
    }

    // Keep member data local to the session for now.
    // This mirrors the previous behavior and avoids touching auth scope.
    return { ok: true };
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    const storedUser = users[currentUser.email];
    if (!storedUser || storedUser.password !== currentPassword) {
      return { ok: false, message: 'Current password is incorrect.' };
    }

    setUsers((current) => ({
      ...current,
      [currentUser.email]: {
        ...current[currentUser.email],
        password: newPassword,
      },
    }));

    return { ok: true };
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#f4f4f2] font-sans text-slate-700 antialiased">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        archivedCount={archivedFilesCount}
        isMobileOpen={isSidebarMobileOpen}
        setIsMobileOpen={setIsSidebarMobileOpen}
      onAddClientClick={() => setIsAddClientOpen(true)}
      clientShiftFilter={clientShiftFilter}
      setClientShiftFilter={setClientShiftFilter}
      clientShiftOptions={clientShiftOptions}
      userRole={userRole}
      onLogoutClick={onLogout}
    />

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
          openSideMenu={() => setIsSidebarMobileOpen(true)}
          totalStorageUsedGB={totalStorageUsedGB}
          userRole={userRole}
          onLogOut={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3.5 rounded-xl border border-slate-200 shadow-xl bg-white text-xs sm:text-sm font-semibold max-w-sm"
              >
                <p className="text-slate-800 font-bold leading-normal flex-1">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="text-slate-300 hover:text-slate-500 leading-none text-base font-bold cursor-pointer p-0.5"
                >
                  &times;
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <Icon name="Cloud" className="w-4.5 h-4.5 text-red-900" />
                    Storage overview
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {visibleFiles.length} items are currently shown for this client shift.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Used Space</span>
                    <span className="text-sm font-extrabold text-slate-900">{storageUsageLabel}</span>
                  </div>
                </div>
              </div>

              <StorageCards filesStats={computedStats} activeFilter={fileTypeFilter} setActiveFilter={setFileTypeFilter} />

              {userRole === 'admin' && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-900">Admin access</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">Manage team members and clients from this dashboard.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddClientOpen(true)}
                      className="rounded-xl border border-red-200 bg-red-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-black cursor-pointer"
                    >
                      Add client
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddMemberOpen(true)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-50 cursor-pointer"
                    >
                      Add member
                    </button>
                  </div>
                </div>
              )}

              {canUpload && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Upload files</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">Recent uploads</span>
                    </div>
                    <FileUploader onFilesSelected={handlePrepareUploads} />
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
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 text-slate-500">Files</h3>
                  {fileTypeFilter !== 'all' && (
                    <button type="button" onClick={() => setFileTypeFilter('all')} className="text-[10px] font-bold text-slate-900 hover:underline">
                      Clear filter
                    </button>
                  )}
                </div>
                <FilesTable
                  files={visibleFiles.filter((file) => !file.isArchived)}
                  onToggleStar={() => {}}
                  onToggleArchive={handleToggleArchive}
                  onDeleteFile={handleDeleteAndClosePreview}
                  onRenameFile={handleRenameFile}
                  onTriggerDownload={handleTriggerDownload}
                  onFileSelect={handleOpenPreview}
                  fileTypeFilter={fileTypeFilter}
                  setFileTypeFilter={setFileTypeFilter}
                  userRole={userRole}
                />
              </div>
            </div>
          )}

          {activeTab === 'Clients' && (
            <ClientsView
              files={files}
              clientShiftOptions={clientShiftOptions}
              onAddClientClick={() => setIsAddClientOpen(true)}
              setClientShiftFilter={setClientShiftFilter}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'My Files' && (
            <FilesTable
              files={visibleFiles.filter((file) => !file.isArchived)}
              onToggleStar={() => {}}
              onToggleArchive={handleToggleArchive}
              onDeleteFile={handleDeleteAndClosePreview}
              onRenameFile={handleRenameFile}
              onTriggerDownload={handleTriggerDownload}
              onFileSelect={handleOpenPreview}
              fileTypeFilter={fileTypeFilter}
              setFileTypeFilter={setFileTypeFilter}
              userRole={userRole}
            />
          )}

          {activeTab === 'Archived' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 px-2.5 py-1 bg-slate-100 rounded-lg">
                  Archived
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-4">Archived Records</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  These records are excluded from standard search listings and dashboard grids.
                </p>
              </div>

              <FilesTable
                files={visibleFiles.filter((file) => file.isArchived)}
                onToggleStar={() => {}}
                onToggleArchive={handleToggleArchive}
                onDeleteFile={handleDeleteAndClosePreview}
                onRenameFile={handleRenameFile}
                onTriggerDownload={handleTriggerDownload}
                onFileSelect={handleOpenPreview}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
                userRole={userRole}
              />
            </div>
          )}

          {activeTab === 'Activity Log' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Recent activity</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">A quick look at what changed recently.</p>
                </div>
                <button
                  type="button"
                  onClick={clearActivityLog}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 hover:bg-slate-50 cursor-pointer"
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
                    <div key={act.id} className="bg-white border border-slate-100 rounded-2xl p-4.5 flex gap-4 hover:border-slate-200 transition-all shadow-xs">
                      <img
                        src={act.user.avatar}
                        alt={act.user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <span className="text-xs font-bold text-slate-800">{act.user.name === CURRENT_USER.name ? 'You' : act.user.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                        </div>
                        <p className="text-slate-600 text-xs mt-1 leading-normal font-medium">
                          <span className="text-slate-400">{act.action}</span>{' '}
                          <span className="font-bold text-slate-750">{act.target}</span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isUploadDestinationOpen && (
          <UploadDestinationModal
            isOpen={isUploadDestinationOpen}
            files={pendingUploads}
            onClose={handleClosePendingUploads}
            onConfirm={handleConfirmPendingUploads}
            onUpdateDestination={handleUpdatePendingUploadDestination}
            onUpdateUploadDate={handleUpdatePendingUploadDate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4.5 border-b border-slate-50 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Database" className="w-5 h-5 text-slate-900" />
                  <span className="font-extrabold text-sm text-slate-800 tracking-tight">Storage settings</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 leading-none text-xl p-1 cursor-pointer hover:bg-slate-100 rounded-lg"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl bg-white">
                  <div className="flex items-center justify-between p-3.5">
                    <div className="min-w-0 pr-4">
                      <span className="block text-xs font-bold text-slate-700">Faster uploads</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">Keep multiple file transfers moving together.</span>
                    </div>
                    <input aria-label="Toggle faster uploads" type="checkbox" defaultChecked className="w-4.5 h-4.5 text-slate-900 border-slate-300 rounded-sm focus:ring-slate-500 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-3.5">
                    <div className="min-w-0 pr-4">
                      <span className="block text-xs font-bold text-slate-700">Auto-clean deleted files</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">Send deleted files to archive after 30 days.</span>
                    </div>
                    <input aria-label="Toggle Automatic Trash Clean-up" type="checkbox" className="w-4.5 h-4.5 text-slate-900 border-slate-300 rounded-sm focus:ring-slate-500 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4.5 bg-white border-t border-slate-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    triggerToast('Workspace settings saved', 'success');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFolderModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-50 bg-white flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800">Create New Folder</span>
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="text-slate-400 hover:text-slate-600 leading-none text-xl p-1 cursor-pointer">
                  &times;
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="relative">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 text-slate-500">Parent Storage Section</label>
                  <select
                    value={newFolderCategory}
                    onChange={(e) => setNewFolderCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-9 text-xs font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                  >
                    <option value="Docs">Docs (Documents)</option>
                    <option value="Images">Images (Designs & Assets)</option>
                    <option value="Videos">Videos (Marketing clips)</option>
                    <option value="Audio">Audio (Raw Media files)</option>
                    <option value="Backups">Backups (Compressed systems)</option>
                    <option value="Vectors">Vectors</option>
                  </select>
                  <Icon name="ChevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 text-slate-500">Folder Name</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. DesignSpecs, Finance2026, Releases"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateNewFolder();
                    }}
                  />
                </div>
              </div>
              <div className="px-5 py-3.5 bg-white border-t border-slate-50 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewFolder}
                  disabled={!newFolderName.trim()}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl text-white shadow-xs cursor-pointer ${newFolderName.trim() ? 'bg-slate-900 hover:bg-black' : 'bg-slate-300 pointer-events-none'}`}
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
            canDownload={canDownload}
          />
        )}
      </AnimatePresence>

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onCreateClient={handleCreateClient}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onCreateMember={handleCreateMember}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileOpen(false)}
        onChangePassword={handleChangePassword}
      />

    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [clientShiftOptions, setClientShiftOptions] = useState(DEFAULT_CLIENT_SHIFTS);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginResetKey, setLoginResetKey] = useState(0);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginResetKey((value) => value + 1);
  };

  if (!currentUser) {
    return <Login key={loginResetKey} users={users} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <WorkspaceScreen
      key={currentUser.email}
      currentUser={currentUser}
      onLogout={handleLogout}
      users={users}
      setUsers={setUsers}
      clientShiftOptions={clientShiftOptions}
      setClientShiftOptions={setClientShiftOptions}
    />
  );
}
