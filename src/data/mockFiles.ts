import { CloudFile, User, Member, Activity, UploadingFile } from '../types';

// Avatars
export const CURRENT_USER: User = {
  name: 'Admin',
  email: 'singharshh351@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  status: 'online'
};

export const MOCK_USERS = {
  sofia: {
    name: 'Sofia Davis',
    email: 'sofia.d@backupsync.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    status: 'online'
  } as User,
  alex: {
    name: 'Alex Rivera',
    email: 'alex.r@backupsync.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    status: 'away'
  } as User,
  marcus: {
    name: 'Marcus Chen',
    email: 'marcus.c@backupsync.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    status: 'online'
  } as User,
  elena: {
    name: 'Elena Rostova',
    email: 'elena.r@backupsync.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    status: 'offline'
  } as User
};

export const MOCK_MEMBERS: Member[] = [
  { name: 'Sofia Davis', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
  { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
  { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' },
  { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' },
  { name: 'Jane Doe', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop' },
  { name: 'John Smith', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop' },
  { name: 'Claire Vance', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop' }
];

function createMockTextFile(filename: string, content: string, mimeType = 'text/markdown') {
  if (typeof File === 'undefined') return undefined;

  return new File([content], filename, { type: mimeType });
}

export const INITIAL_FILES: CloudFile[] = [
  {
    id: 'file-nr-001',
    name: 'operations_summary_q2',
    extension: 'md',
    category: 'document',
    clientShift: 'Northern Railway',
    size: '2.4 MB',
    sizeBytes: 2_514_944,
    folder: 'Docs > Reports',
    folderChain: ['Docs', 'Reports'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-15 09:17',
    isStarred: true,
    isArchived: false,
    isShared: false,
    downloadCount: 12,
    mimeType: 'text/markdown',
    sourceFile: createMockTextFile(
      'operations_summary_q2.md',
      `# Operations Summary Q2

## Northern Railway
- Shift handover completed for all active routes.
- Maintenance windows approved for the afternoon.
- No open incidents reported at this time.`,
    ),
  },
  {
    id: 'file-nr-002',
    name: 'trackside_briefing_overview',
    extension: 'mp4',
    category: 'video',
    clientShift: 'Northern Railway',
    size: '19.4 MB',
    sizeBytes: 20_348_928,
    folder: 'Videos > Briefings',
    folderChain: ['Videos', 'Briefings'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-14 16:42',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 7,
    mimeType: 'video/mp4',
    previewUrl: 'https://samplelib.com/mp4/sample-5s.mp4',
  },
  {
    id: 'file-nr-003',
    name: 'northern_shift_notes',
    extension: 'txt',
    category: 'document',
    clientShift: 'Northern Railway',
    size: '8 KB',
    sizeBytes: 8_192,
    folder: 'Docs > Notes',
    folderChain: ['Docs', 'Notes'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-14 18:20',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 4,
    mimeType: 'text/plain',
    sourceFile: createMockTextFile(
      'northern_shift_notes.txt',
      'Northern Railway shift notes:\n- Ticketing sync verified.\n- Platform checklist closed.\n- Spare parts inventory updated.',
      'text/plain',
    ),
  },
  {
    id: 'file-er-001',
    name: 'eastern_line_dispatch_clip',
    extension: 'mp4',
    category: 'video',
    clientShift: 'Eastern Railway',
    size: '18.2 MB',
    sizeBytes: 19_079_168,
    folder: 'Videos > Dispatch',
    folderChain: ['Videos', 'Dispatch'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-13 11:05',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 3,
    mimeType: 'video/mp4',
    previewUrl: 'https://samplelib.com/mp4/sample-10s.mp4',
  },
  {
    id: 'file-er-002',
    name: 'eastern_dispatch_brief',
    extension: 'txt',
    category: 'document',
    clientShift: 'Eastern Railway',
    size: '9 KB',
    sizeBytes: 9_216,
    folder: 'Docs > Briefings',
    folderChain: ['Docs', 'Briefings'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-12 08:30',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 1,
    mimeType: 'text/plain',
    sourceFile: createMockTextFile(
      'eastern_dispatch_brief.txt',
      'Eastern Railway dispatch brief:\n- Yard handoff completed.\n- Route timings confirmed.\n- Weather alert posted to the control room.',
      'text/plain',
    ),
  },
  {
    id: 'file-cr-001',
    name: 'central_asset_manifest',
    extension: 'csv',
    category: 'document',
    clientShift: 'Central Railway',
    size: '1.1 MB',
    sizeBytes: 1_150_976,
    folder: 'Docs > Inventory',
    folderChain: ['Docs', 'Inventory'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-15 07:58',
    isStarred: true,
    isArchived: false,
    isShared: false,
    downloadCount: 9,
    mimeType: 'text/csv',
    sourceFile: createMockTextFile(
      'central_asset_manifest.csv',
      'asset_id,status,location\nCR-104,checked,Depot A\nCR-219,queued,Depot B\nCR-331,approved,Depot C',
      'text/csv',
    ),
  },
  {
    id: 'file-cr-002',
    name: 'central_ops_roundup',
    extension: 'mp4',
    category: 'video',
    clientShift: 'Central Railway',
    size: '14.8 MB',
    sizeBytes: 15_523_840,
    folder: 'Videos > Operations',
    folderChain: ['Videos', 'Operations'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-11 13:24',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 5,
    mimeType: 'video/mp4',
    previewUrl: 'https://samplelib.com/mp4/sample-15s.mp4',
  },
  {
    id: 'file-wr-001',
    name: 'western_network_backup',
    extension: 'zip',
    category: 'other',
    clientShift: 'Western Railway',
    size: '24.6 MB',
    sizeBytes: 25_787_392,
    folder: 'Backups > Nightly',
    folderChain: ['Backups', 'Nightly'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-10 22:11',
    isStarred: false,
    isArchived: true,
    isShared: false,
    downloadCount: 2,
  },
  {
    id: 'file-wr-002',
    name: 'western_training_notes',
    extension: 'txt',
    category: 'document',
    clientShift: 'Western Railway',
    size: '10 KB',
    sizeBytes: 10_240,
    folder: 'Docs > Training',
    folderChain: ['Docs', 'Training'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-09 15:33',
    isStarred: true,
    isArchived: false,
    isShared: false,
    downloadCount: 14,
    mimeType: 'text/plain',
    sourceFile: createMockTextFile(
      'western_training_notes.txt',
      'Western Railway training notes:\n- Safety drills completed.\n- Crew roster updated.\n- New signage rollout pending approval.',
      'text/plain',
    ),
  },
  {
    id: 'file-cr-003',
    name: 'central_handover_notes',
    extension: 'md',
    category: 'document',
    clientShift: 'Central Railway',
    size: '12 KB',
    sizeBytes: 12_288,
    folder: 'Docs > Handover',
    folderChain: ['Docs', 'Handover'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-15 10:05',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 4,
    mimeType: 'text/markdown',
    sourceFile: createMockTextFile(
      'central_handover_notes.md',
      `# Central Railway Handover Notes

## Summary
- Station checks completed for the morning shift.
- Asset logs synced to the central archive.
- Pending item: confirm signal board calibration.

## Action Items
1. Review inspection photos.
2. Sign off the route summary.
3. Share updates with operations.`,
    ),
  },
  {
    id: 'file-wr-003',
    name: 'western_route_review',
    extension: 'mp4',
    category: 'video',
    clientShift: 'Western Railway',
    size: '16.2 MB',
    sizeBytes: 16_982_016,
    folder: 'Videos > Reviews',
    folderChain: ['Videos', 'Reviews'],
    owner: CURRENT_USER,
    members: [],
    lastModified: '2026-06-08 19:45',
    isStarred: false,
    isArchived: false,
    isShared: false,
    downloadCount: 6,
    mimeType: 'video/mp4',
    previewUrl: 'https://samplelib.com/mp4/sample-15s.mp4',
  },
];

export const INITIAL_UPLOADS: UploadingFile[] = [];

export const INITIAL_ACTIVITIES: Activity[] = [];
