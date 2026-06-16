import React from 'react';
import { CiFolderOn } from 'react-icons/ci';
import { IoDocumentsOutline } from 'react-icons/io5';
import { MdOutlineAudiotrack } from 'react-icons/md';
import { PiFilePdfDuotone, PiFileZipDuotone, PiImagesLight, PiVideoLight } from 'react-icons/pi';
import documentIcon from '../assets/icons/ic-document.svg';
import audioIcon from '../assets/icons/ic-audio.svg';
import aiIcon from '../assets/icons/ic-ai.svg';
import excelIcon from '../assets/icons/ic-excel.svg';
import fileIcon from '../assets/icons/ic-file.svg';
import folderIcon from '../assets/icons/ic-folder.svg';
import pdfIcon from '../assets/icons/ic-pdf.svg';
import imageIcon from '../assets/icons/ic-img.svg';
import pptIcon from '../assets/icons/ic-power-point.svg';
import zipIcon from '../assets/icons/ic-zip.svg';
import wordIcon from '../assets/icons/ic-word.svg';
import videoIcon from '../assets/icons/ic-video.svg';
import txtIcon from '../assets/icons/ic-txt.svg';
import ptsIcon from '../assets/icons/ic-pts.svg';

const FILE_ICONS = {
  FileText: IoDocumentsOutline,
  FilePdf: PiFilePdfDuotone,
  FileZip: PiFileZipDuotone,
  FileImage: PiImagesLight,
  FileVideo: PiVideoLight,
  FileAudio: MdOutlineAudiotrack,
  FolderMinus: CiFolderOn,
  FolderOpen: CiFolderOn,
  Folder: CiFolderOn,
  File: fileIcon,
  FileCode: fileIcon,
  FileSpreadsheet: excelIcon,
  FileWord: wordIcon,
  FilePowerPoint: pptIcon,
  FilePpt: ptsIcon,
  Image: PiImagesLight,
  Video: PiVideoLight,
  Music: MdOutlineAudiotrack,
};

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function LineIcon({ className, title, children, viewBox = '0 0 24 24' }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden={!title}
      role={title ? 'img' : 'presentation'}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="11" cy="11" r="6.5" {...strokeProps} />
      <path d="M16.2 16.2L21 21" {...strokeProps} />
    </LineIcon>
  );
}

function SettingsIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="3.2" {...strokeProps} />
      <path
        d="M12 2.8v2.2M12 19v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.8 12h2.2M19 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
        {...strokeProps}
      />
    </LineIcon>
  );
}

function BellIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M8 17h8" {...strokeProps} />
      <path d="M7 17V11a5 5 0 0 1 10 0v6" {...strokeProps} />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" {...strokeProps} />
    </LineIcon>
  );
}

function MenuIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" {...strokeProps} />
    </LineIcon>
  );
}

function ChevronDownIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M6 9l6 6 6-6" {...strokeProps} />
    </LineIcon>
  );
}

function ChevronRightIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M9 6l6 6-6 6" {...strokeProps} />
    </LineIcon>
  );
}

function XIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M6 6l12 12M18 6L6 18" {...strokeProps} />
    </LineIcon>
  );
}

function PlusIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M12 5v14M5 12h14" {...strokeProps} />
    </LineIcon>
  );
}

function CheckIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M5.5 12.5l4 4L18.5 7.5" {...strokeProps} />
    </LineIcon>
  );
}

function CheckCircleIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M8.5 12.5l2.4 2.4 4.7-5.4" {...strokeProps} />
    </LineIcon>
  );
}

function InfoIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M12 10.2v6" {...strokeProps} />
      <path d="M12 7.3h.01" {...strokeProps} />
    </LineIcon>
  );
}

function TrashIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M4.8 7.2h14.4M9.5 7.2V5.6h5V7.2M9 10v7M15 10v7M7.5 7.2l.7 11h7.6l.7-11" {...strokeProps} />
    </LineIcon>
  );
}

function HardDriveIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="3.5" y="6.2" width="17" height="11.5" rx="2.2" {...strokeProps} />
      <path d="M7.2 15.2h9.6" {...strokeProps} />
      <circle cx="17" cy="13.8" r="0.8" fill="currentColor" />
    </LineIcon>
  );
}

function DatabaseIcon(props) {
  return (
    <LineIcon {...props}>
      <ellipse cx="12" cy="5.5" rx="6.5" ry="2.7" {...strokeProps} />
      <path d="M5.5 5.5v5.5c0 1.5 2.9 2.7 6.5 2.7s6.5-1.2 6.5-2.7V5.5" {...strokeProps} />
      <path d="M5.5 11v5.5c0 1.5 2.9 2.7 6.5 2.7s6.5-1.2 6.5-2.7V11" {...strokeProps} />
    </LineIcon>
  );
}

function CloudIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M7.5 17.5h8.7a3.8 3.8 0 0 0 .2-7.6 5.5 5.5 0 0 0-10.7 1.3A3.1 3.1 0 0 0 7.5 17.5Z" {...strokeProps} />
    </LineIcon>
  );
}

function StarIcon(props) {
  return (
    <LineIcon {...props}>
      <path
        d="M12 4.8l2.3 4.7 5.2.8-3.8 3.7.9 5.2L12 16.8l-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L12 4.8z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </LineIcon>
  );
}

function UsersIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="9" cy="8.2" r="2.2" {...strokeProps} />
      <circle cx="15.5" cy="9.5" r="1.8" {...strokeProps} />
      <path d="M4.8 18a4.2 4.2 0 0 1 8.4 0" {...strokeProps} />
      <path d="M12.2 17a3.2 3.2 0 0 1 6.4 0" {...strokeProps} />
    </LineIcon>
  );
}

function ClockIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="8.5" {...strokeProps} />
      <path d="M12 7.5V12l3 2" {...strokeProps} />
    </LineIcon>
  );
}

function ArchiveIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="4.5" y="6" width="15" height="4" rx="1.5" {...strokeProps} />
      <path d="M6 10v7.2h12V10" {...strokeProps} />
      <path d="M10 13h4" {...strokeProps} />
    </LineIcon>
  );
}

function ActivityIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M4 13h3l2-5 3 10 2.2-6H20" {...strokeProps} />
    </LineIcon>
  );
}

function SparklesIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M12 3.8l.8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8.8-2.7Z" fill="currentColor" />
      <path d="M18.2 12.2l.5 1.7 1.7.5-1.7.5-.5 1.7-.5-1.7-1.7-.5 1.7-.5.5-1.7Z" fill="currentColor" />
    </LineIcon>
  );
}

function ArrowRightIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M5 12h12M13 6l6 6-6 6" {...strokeProps} />
    </LineIcon>
  );
}

function ArrowUpRightIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M7 17L17 7M10 7h7v7" {...strokeProps} />
    </LineIcon>
  );
}

function ChevronUpIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M6 15l6-6 6 6" {...strokeProps} />
    </LineIcon>
  );
}

function FilterIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M4 6h16l-6 6v5l-4 2v-7L4 6Z" {...strokeProps} />
    </LineIcon>
  );
}

function MoreHorizontalIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M6 12h.01M12 12h.01M18 12h.01" {...strokeProps} />
    </LineIcon>
  );
}

function DownloadIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M12 4v8M8.5 9.5L12 13l3.5-3.5" {...strokeProps} />
      <path d="M5 16.5h14" {...strokeProps} />
    </LineIcon>
  );
}

function EditIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M5 15.5V19h3.5L17.8 9.7l-3.5-3.5L5 15.5Z" {...strokeProps} />
    </LineIcon>
  );
}

function ListIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M8 7h12M8 12h12M8 17h12" {...strokeProps} />
      <path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" {...strokeProps} />
    </LineIcon>
  );
}

function LayoutGridIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="4.5" y="4.5" width="6" height="6" rx="1.2" {...strokeProps} />
      <rect x="13.5" y="4.5" width="6" height="6" rx="1.2" {...strokeProps} />
      <rect x="4.5" y="13.5" width="6" height="6" rx="1.2" {...strokeProps} />
      <rect x="13.5" y="13.5" width="6" height="6" rx="1.2" {...strokeProps} />
    </LineIcon>
  );
}

function CalendarIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="4.5" y="5.5" width="15" height="14" rx="2" {...strokeProps} />
      <path d="M4.5 9h15M8 3.8v3.2M16 3.8v3.2" {...strokeProps} />
    </LineIcon>
  );
}

function LayersIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M12 5l7 3.5-7 3.5L5 8.5 12 5Z" {...strokeProps} />
      <path d="M5 12l7 3.5 7-3.5" {...strokeProps} />
      <path d="M5 16l7 3.5 7-3.5" {...strokeProps} />
    </LineIcon>
  );
}

function ShareIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="6" cy="12" r="2" {...strokeProps} />
      <circle cx="18" cy="7" r="2" {...strokeProps} />
      <circle cx="18" cy="17" r="2" {...strokeProps} />
      <path d="M7.8 11.2l8.4-3.7M7.8 12.8l8.4 3.7" {...strokeProps} />
    </LineIcon>
  );
}

function UserIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="8.5" r="3" {...strokeProps} />
      <path d="M5.8 18a6.2 6.2 0 0 1 12.4 0" {...strokeProps} />
    </LineIcon>
  );
}

function CreditCardIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" {...strokeProps} />
      <path d="M4 10h16" {...strokeProps} />
      <path d="M7 14h3" {...strokeProps} />
    </LineIcon>
  );
}

function ShieldIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M12 3.5 19 6v5.2c0 4.8-3 7.7-7 9.3-4-1.6-7-4.5-7-9.3V6l7-2.5Z" {...strokeProps} />
    </LineIcon>
  );
}

function LogOutIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M10 7V5.5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 19 5.5v13A1.5 1.5 0 0 1 17.5 20h-6A1.5 1.5 0 0 1 10 18.5V17" {...strokeProps} />
      <path d="M13 12h-8M7 9l-3 3 3 3" {...strokeProps} />
    </LineIcon>
  );
}

function UserPlusIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="9" cy="8.5" r="3" {...strokeProps} />
      <path d="M5.8 18a6.2 6.2 0 0 1 6.4-4.6" {...strokeProps} />
      <path d="M17 8v6M14 11h6" {...strokeProps} />
    </LineIcon>
  );
}

function ExternalLinkIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M10 14L19 5" {...strokeProps} />
      <path d="M14 5h5v5" {...strokeProps} />
      <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" {...strokeProps} />
    </LineIcon>
  );
}

function CloudUploadIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M7.5 17.5h8.7a3.8 3.8 0 0 0 .2-7.6 5.5 5.5 0 0 0-10.7 1.3A3.1 3.1 0 0 0 7.5 17.5Z" {...strokeProps} />
      <path d="M12 10.5v5M9.8 12.7 12 10.5l2.2 2.2" {...strokeProps} />
    </LineIcon>
  );
}

function FileSpreadsheetIcon(props) {
  return <img src={excelIcon} alt="" className={props.className} aria-hidden="true" />;
}

function FileImageIcon(props) {
  return <PiImagesLight className={props.className} aria-hidden="true" />;
}

function FileVideoIcon(props) {
  return <PiVideoLight className={props.className} aria-hidden="true" />;
}

function FileAudioIcon(props) {
  return <MdOutlineAudiotrack className={props.className} aria-hidden="true" />;
}

function FileArchiveIcon(props) {
  return <PiFileZipDuotone className={props.className} aria-hidden="true" />;
}

function FileCodeIcon(props) {
  return <img src={fileIcon} alt="" className={props.className} aria-hidden="true" />;
}

function FileTextIcon(props) {
  return <IoDocumentsOutline className={props.className} aria-hidden="true" />;
}

function FilePdfIcon(props) {
  return <PiFilePdfDuotone className={props.className} aria-hidden="true" />;
}

function FolderOnIcon(props) {
  return <CiFolderOn className={props.className} aria-hidden="true" />;
}

function ActivityIconLine(props) {
  return (
    <LineIcon {...props}>
      <path d="M4 13h3l2-5 3 10 2.2-6H20" {...strokeProps} />
    </LineIcon>
  );
}

function LayoutDashboardIcon(props) {
  return (
    <LineIcon {...props}>
      <rect x="4.5" y="4.5" width="7" height="6.5" rx="1.5" {...strokeProps} />
      <rect x="13.5" y="4.5" width="6" height="6.5" rx="1.5" {...strokeProps} />
      <rect x="4.5" y="13.5" width="6.5" height="6" rx="1.5" {...strokeProps} />
      <rect x="13.5" y="13.5" width="7" height="6" rx="1.5" {...strokeProps} />
    </LineIcon>
  );
}

function CheckCircleFilledIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path d="M8.5 12.5l2.4 2.4 4.7-5.4" stroke="#fff" {...strokeProps} />
    </LineIcon>
  );
}

function AlertCircleIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M12 7.5v6" {...strokeProps} />
      <path d="M12 16.8h.01" {...strokeProps} />
    </LineIcon>
  );
}

function MoreHorizontalFallback(props) {
  return <MoreHorizontalIcon {...props} />;
}

const ICONS = {
  Search: SearchIcon,
  Settings: SettingsIcon,
  Bell: BellIcon,
  Menu: MenuIcon,
  ChevronDown: ChevronDownIcon,
  ChevronRight: ChevronRightIcon,
  X: XIcon,
  Plus: PlusIcon,
  Check: CheckIcon,
  CheckCircle: CheckCircleFilledIcon,
  CheckCircle2: CheckCircleFilledIcon,
  Info: InfoIcon,
  Trash2: TrashIcon,
  HardDrive: HardDriveIcon,
  Database: DatabaseIcon,
  Cloud: CloudIcon,
  Star: StarIcon,
  Users: UsersIcon,
  Clock: ClockIcon,
  Archive: ArchiveIcon,
  Activity: ActivityIconLine,
  Sparkles: SparklesIcon,
  ArrowRight: ArrowRightIcon,
  ArrowUpRight: ArrowUpRightIcon,
  ChevronUp: ChevronUpIcon,
  Filter: FilterIcon,
  MoreHorizontal: MoreHorizontalFallback,
  Download: DownloadIcon,
  Edit3: EditIcon,
  List: ListIcon,
  LayoutGrid: LayoutGridIcon,
  Calendar: CalendarIcon,
  Layers: LayersIcon,
  Share2: ShareIcon,
  User: UserIcon,
  CreditCard: CreditCardIcon,
  Shield: ShieldIcon,
  LogOut: LogOutIcon,
  UserPlus: UserPlusIcon,
  ExternalLink: ExternalLinkIcon,
  LayoutDashboard: LayoutDashboardIcon,
  FolderOpen: FolderOnIcon,
  Folder: FolderOnIcon,
  CloudUpload: CloudUploadIcon,
  FileSpreadsheet: FileSpreadsheetIcon,
  FileVideo: FileVideoIcon,
  FileImage: FileImageIcon,
  FileText: FileTextIcon,
  FileAudio: FileAudioIcon,
  FileArchive: FileArchiveIcon,
  FilePdf: FilePdfIcon,
  FileZip: FileArchiveIcon,
  FileCode: FileCodeIcon,
  File: FileCodeIcon,
};

export default function Icon({ name, className = '', title }) {
  const Component = FILE_ICONS[name] || ICONS[name] || FileCodeIcon;

  if (typeof Component === 'string') {
    return <img src={Component} alt={title || ''} className={className} aria-hidden={!title} />;
  }

  return <Component className={className} title={title} />;
}
