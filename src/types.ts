export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'other';
export type RailwayClient =
  | 'Northern Railway'
  | 'Eastern Railway'
  | 'Central Railway'
  | 'Western Railway';

export interface User {
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface Member {
  name: string;
  avatar: string;
}

export interface CloudFile {
  id: string;
  sourceUploadId?: string;
  previewUrl?: string;
  mimeType?: string;
  sourceFile?: File;
  name: string;
  extension: string;
  category: FileCategory;
  clientShift: RailwayClient;
  size: string; // human readable E.g., "1.2 MB"
  sizeBytes: number;
  folder: string; // breadcrumb display string, e.g. "Work > Finance"
  folderChain: string[]; // e.g. ["Work", "Finance"]
  owner: User;
  members: Member[];
  lastModified: string;
  isStarred: boolean;
  isArchived: boolean;
  isShared: boolean;
  downloadCount: number;
}

export interface UploadingFile {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  progress: number; // 0 to 100
  status: 'uploading' | 'completed' | 'cancelled';
  category: FileCategory;
  extension: string;
  clientShift: RailwayClient;
  folderCategory?: FileCategory;
  sourceFile?: File;
}

export interface StorageStats {
  category: FileCategory;
  name: string;
  count: number;
  usedGB: number;
  totalGB: number;
  color: string; // e.g., 'bg-yellow-500'
  textColor: string;
  icon: string;
}

export interface Activity {
  id: string;
  user: User;
  action: string;
  target: string;
  time: string;
  timestamp: string; // Date ISO or standard string
  type: 'upload' | 'delete' | 'share' | 'download' | 'rename' | 'star' | 'archive';
}

export type SidebarTab =
  | 'Dashboard'
  | 'My Files'
  | 'Archived'
  | 'Activity Log'
  | 'Browse Files'
  | 'Downloads'
  | 'Upload Files'
  | 'My Uploads'
  | 'Users'
  | 'Settings'
  | 'Logout';

