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

export const INITIAL_FILES: CloudFile[] = [];

export const INITIAL_UPLOADS: UploadingFile[] = [];

export const INITIAL_ACTIVITIES: Activity[] = [];
