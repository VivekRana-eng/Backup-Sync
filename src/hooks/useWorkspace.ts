import { useEffect, useMemo, useState } from 'react';
import type { Activity, CloudFile, FileCategory, SidebarTab, UploadingFile } from '../types';
import {
  buildUploadQueue,
  computeStats,
  computeTotalStorageUsedGB,
  createActivity,
  createFolderPlaceholder,
  createToastId,
  createUploadedFile,
  type ToastMessage,
} from '../lib/workspace';
import {
  CURRENT_USER,
  INITIAL_ACTIVITIES,
  INITIAL_FILES,
  INITIAL_UPLOADS,
} from '../data/mockFiles';

export function useWorkspace() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Dashboard');
  const [files, setFiles] = useState<CloudFile[]>(INITIAL_FILES);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>(INITIAL_UPLOADS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<FileCategory | 'all'>('all');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCategory, setNewFolderCategory] = useState('Docs');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const triggerToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({
      id: createToastId(),
      message,
      type,
    });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setUploadingFiles((currentUploads) => {
        const hasActiveUpload = currentUploads.some((file) => file.status === 'uploading');
        if (!hasActiveUpload) return currentUploads;

        return currentUploads.map((file) => {
          if (file.status !== 'uploading') return file;

          const progressIncrement = Math.floor(Math.random() * 20) + 10;
          const nextProgress = Math.min(file.progress + progressIncrement, 100);
          const nextStatus = nextProgress === 100 ? 'completed' : 'uploading';

          if (nextStatus === 'completed') {
            const uploadedFile = createUploadedFile(file, CURRENT_USER);

            window.setTimeout(() => {
              setFiles((currentFiles) => [uploadedFile, ...currentFiles]);
              setActivities((currentActivities) => [
                createActivity(CURRENT_USER, 'uploaded standard asset', file.name, 'upload'),
                ...currentActivities,
              ]);
              triggerToast(`Successfully uploaded ${file.name}! Added to ${uploadedFile.folder}`, 'success');
            }, 100);
          }

          return {
            ...file,
            progress: nextProgress,
            status: nextStatus,
          };
        });
      });
    }, 1500);

    return () => window.clearInterval(interval);
  }, []);

  const computedStats = useMemo(() => computeStats(files), [files]);
  const totalStorageUsedGB = useMemo(() => computeTotalStorageUsedGB(files), [files]);

  const starredFilesCount = files.filter((file) => file.isStarred && !file.isArchived).length;
  const archivedFilesCount = files.filter((file) => file.isArchived).length;
  const sharedFilesCount = files.filter((file) => file.isShared && !file.isArchived).length;

  const handleToggleStar = (id: string) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (file.id !== id) return file;

        const nextState = !file.isStarred;
        triggerToast(
          nextState ? `Starred "${file.name}.${file.extension}"` : `Removed star from "${file.name}.${file.extension}"`,
          'info',
        );
        setActivities((currentActivities) => [
          createActivity(
            CURRENT_USER,
            nextState ? 'starred the file' : 'unstarred the file',
            `${file.name}.${file.extension}`,
            'star',
          ),
          ...currentActivities,
        ]);

        return { ...file, isStarred: nextState };
      }),
    );
  };

  const handleToggleArchive = (id: string) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (file.id !== id) return file;

        const nextState = !file.isArchived;
        triggerToast(
          nextState
            ? `Archived "${file.name}.${file.extension}". View in Archived tab.`
            : `Restored "${file.name}.${file.extension}" to Dashboard.`,
          'success',
        );
        setActivities((currentActivities) => [
          createActivity(
            CURRENT_USER,
            nextState ? 'archived file item' : 'restored file item',
            `${file.name}.${file.extension}`,
            'archive',
          ),
          ...currentActivities,
        ]);

        return { ...file, isArchived: nextState };
      }),
    );
  };

  const handleDeleteFile = (id: string) => {
    const fileToDelete = files.find((file) => file.id === id);
    if (!fileToDelete) return;

    if (window.confirm(`Are you sure you want to permanently delete "${fileToDelete.name}.${fileToDelete.extension}"?`)) {
      setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id));
      triggerToast(`Successfully deleted ${fileToDelete.name}.${fileToDelete.extension}`, 'error');
      setActivities((currentActivities) => [
        createActivity(
          CURRENT_USER,
          'deleted file from server',
          `${fileToDelete.name}.${fileToDelete.extension}`,
          'delete',
        ),
        ...currentActivities,
      ]);
    }
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (file.id !== id) return file;

        triggerToast(`Renamed to "${newName}.${file.extension}"`, 'info');
        setActivities((currentActivities) => [
          createActivity(
            CURRENT_USER,
            `renamed file from "${file.name}" to`,
            `${newName}.${file.extension}`,
            'rename',
          ),
          ...currentActivities,
        ]);

        return { ...file, name: newName };
      }),
    );
  };

  const handleTriggerDownload = (file: CloudFile) => {
    triggerToast(`Starting download: ${file.name}.${file.extension} (${file.size})...`, 'success');
    setFiles((currentFiles) =>
      currentFiles.map((currentFile) =>
        currentFile.id === file.id
          ? { ...currentFile, downloadCount: currentFile.downloadCount + 1 }
          : currentFile,
      ),
    );
    setActivities((currentActivities) => [
      createActivity(CURRENT_USER, 'downloaded cloud asset', `${file.name}.${file.extension}`, 'download'),
      ...currentActivities,
    ]);
  };

  const handleFilesSelected = (selectedFiles: FileList | File[]) => {
    const tempUploads = buildUploadQueue(selectedFiles);
    setUploadingFiles((currentUploads) => [...tempUploads, ...currentUploads]);
    triggerToast(`Added ${selectedFiles.length} file(s) to transfer queue`, 'info');
  };

  const handleCancelUpload = (id: string) => {
    setUploadingFiles((currentUploads) =>
      currentUploads.map((file) => (file.id === id ? { ...file, status: 'cancelled' as const } : file)),
    );
    triggerToast('Upload job dismissed.', 'info');
  };

  const handleClearAllCompleted = () => {
    setUploadingFiles((currentUploads) => currentUploads.filter((file) => file.status === 'uploading'));
    triggerToast('Cleared all finished transfers from panel history.', 'info');
  };

  const handleCreateNewFolder = () => {
    const trimmedFolderName = newFolderName.trim();
    if (!trimmedFolderName) return;

    triggerToast(`Created folder directory: "${newFolderCategory} > ${trimmedFolderName}"`, 'success');

    const placeholderFile = createFolderPlaceholder(newFolderCategory, trimmedFolderName, CURRENT_USER);
    setFiles((currentFiles) => [placeholderFile, ...currentFiles]);
    setActivities((currentActivities) => [
      createActivity(
        CURRENT_USER,
        'created empty directory structure',
        `${newFolderCategory} > ${trimmedFolderName}`,
        'rename',
      ),
      ...currentActivities,
    ]);

    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const clearActivityLog = () => {
    setActivities([]);
    triggerToast('Activity history cleared successfully!', 'error');
  };

  return {
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
  };
}
