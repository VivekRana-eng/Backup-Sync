import type { Activity, CloudFile, FileCategory, UploadingFile, User } from '../types';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

const CATEGORY_FOLDERS: Record<FileCategory, { folder: string; chain: string[] }> = {
  document: { folder: 'Docs > Uploads', chain: ['Docs', 'Uploads'] },
  image: { folder: 'Images > Uploads', chain: ['Images', 'Uploads'] },
  video: { folder: 'Videos > Uploads', chain: ['Videos', 'Uploads'] },
  audio: { folder: 'Audio > Uploads', chain: ['Audio', 'Uploads'] },
  other: { folder: 'Others > Uploads', chain: ['Others', 'Uploads'] },
};

export function createToastId() {
  return Date.now().toString();
}

export function getFileCategory(extension: string): FileCategory {
  const normalizedExtension = extension.toLowerCase();

  if (['xlsx', 'xls', 'csv', 'doc', 'docx', 'pdf', 'ppt', 'pptx'].includes(normalizedExtension)) {
    return 'document';
  }

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(normalizedExtension)) {
    return 'image';
  }

  if (['mp4', 'mkv', 'mov', 'avi', 'wmv'].includes(normalizedExtension)) {
    return 'video';
  }

  if (['mp3', 'wav', 'ogg', 'aac'].includes(normalizedExtension)) {
    return 'audio';
  }

  return 'other';
}

export function formatStorageSize(bytes: number) {
  if (bytes === 0) return '0.0 MB';
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatUploadSize(bytes: number) {
  if (bytes > 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return '0 KB';
}

export function getFolderDestination(category: FileCategory) {
  return CATEGORY_FOLDERS[category] ?? CATEGORY_FOLDERS.other;
}

export function createActivity(
  user: User,
  action: string,
  target: string,
  type: Activity['type']
): Activity {
  return {
    id: `act-${Date.now()}`,
    user,
    action,
    target,
    time: 'Just now',
    timestamp: new Date().toISOString(),
    type,
  };
}

export function createUploadedFile(
  upload: UploadingFile,
  user: User,
): CloudFile {
  const folderDestination = getFolderDestination(upload.category);

  return {
    id: `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: upload.name.substring(0, upload.name.lastIndexOf('.')) || upload.name,
    extension: upload.extension,
    category: upload.category,
    size: upload.size,
    sizeBytes: upload.sizeBytes,
    folder: folderDestination.folder,
    folderChain: folderDestination.chain,
    owner: user,
    members: [],
    lastModified: new Date().toISOString().replace('T', ' ').substring(0, 16),
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 0,
  };
}

export function createFolderPlaceholder(category: string, folderName: string, user: User): CloudFile {
  return {
    id: `folder-ph-${Date.now()}`,
    name: 'get_started_guide',
    extension: 'pdf',
    category: 'document',
    size: '1.2 MB',
    sizeBytes: 1_258_291,
    folder: `${category} > ${folderName}`,
    folderChain: [category, folderName],
    owner: user,
    members: [],
    lastModified: new Date().toISOString().replace('T', ' ').substring(0, 16),
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 0,
  };
}

export function buildUploadQueue(files: FileList | File[]) {
  return Array.from(files).map((file, index) => {
    const extension = file.name.split('.').pop() || 'dat';
    const category = getFileCategory(extension);

    return {
      id: `upload-${index}-${Date.now()}`,
      name: file.name,
      extension,
      category,
      size: formatUploadSize(file.size),
      sizeBytes: file.size || 1_500_000,
      progress: 0,
      status: 'uploading' as const,
    };
  });
}

export function computeStats(files: CloudFile[]) {
  const stats: Record<FileCategory, { count: number; totalSizeBytes: number }> = {
    document: { count: 0, totalSizeBytes: 0 },
    image: { count: 0, totalSizeBytes: 0 },
    video: { count: 0, totalSizeBytes: 0 },
    audio: { count: 0, totalSizeBytes: 0 },
    other: { count: 0, totalSizeBytes: 0 },
  };

  for (const file of files) {
    stats[file.category].count += 1;
    stats[file.category].totalSizeBytes += file.sizeBytes;
  }

  return stats;
}

export function computeTotalStorageUsedGB(files: CloudFile[]) {
  const totalBytes = files.reduce((sum, file) => sum + file.sizeBytes, 0);
  return totalBytes / (1024 * 1024 * 1024);
}
