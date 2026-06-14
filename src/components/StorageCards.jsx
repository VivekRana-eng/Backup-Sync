import React from 'react';
import {
  FileText,
  Image,
  Video,
  Music,
  FolderMinus,
  RefreshCcw,
  ArrowUpRight
} from 'lucide-react';

export default function StorageCards({
  filesStats,
  activeFilter,
  setActiveFilter
}) {
  // We'll define allocation limits for our cards:
  // Documents: 50GB max, Images: 100GB, Videos: 250GB, Audio: 20GB, Others: 30GB
  const limits = {
    document: 50,
    image: 100,
    video: 250,
    audio: 20,
    other: 30
  };

  // Convert bytes from our calculated stats to GB for UI display
  // 1 GB = 1024 * 1024 * 1024 bytes (1,073,741,824)
  // Let's add a small base simulation size to each so it looks realistic, e.g. base file storage + current files sum
  const getGBUsage = (category, currentBytes) => {
    const baseGB = {
      document: 0,
      image: 0,
      video: 0,
      audio: 0,
      other: 0
    };
    const addedGB = currentBytes / (1024 * 1024 * 1024);
    return Math.min(baseGB[category] + addedGB, limits[category] - 0.1);
  };

  const getFilesCount = (category, currentCount) => {
    const baseCount = {
      document: 0,
      image: 0,
      video: 0,
      audio: 0,
      other: 0
    };
    return baseCount[category] + currentCount;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0.0 MB';
    if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const cardsData = [
    {
      category: 'document',
      name: 'Documents',
      count: getFilesCount('document', filesStats.document.count),
      usedGB: getGBUsage('document', filesStats.document.totalSizeBytes),
      totalGB: limits.document,
      colorClass: 'bg-yellow-500',
      bgColorClass: 'bg-yellow-50 text-yellow-600',
      textColorClass: 'text-yellow-600',
      icon: FileText
    },
    {
      category: 'image',
      name: 'Images',
      count: getFilesCount('image', filesStats.image.count),
      usedGB: getGBUsage('image', filesStats.image.totalSizeBytes),
      totalGB: limits.image,
      colorClass: 'bg-blue-500',
      bgColorClass: 'bg-blue-50 text-blue-600',
      textColorClass: 'text-blue-600',
      icon: Image
    },
    {
      category: 'video',
      name: 'Videos',
      count: getFilesCount('video', filesStats.video.count),
      usedGB: getGBUsage('video', filesStats.video.totalSizeBytes),
      totalGB: limits.video,
      colorClass: 'bg-red-500',
      bgColorClass: 'bg-red-50 text-red-600',
      textColorClass: 'text-red-500',
      icon: Video
    },
    {
      category: 'audio',
      name: 'Audio',
      count: getFilesCount('audio', filesStats.audio.count),
      usedGB: getGBUsage('audio', filesStats.audio.totalSizeBytes),
      totalGB: limits.audio,
      colorClass: 'bg-emerald-500',
      bgColorClass: 'bg-emerald-50 text-emerald-600',
      textColorClass: 'text-emerald-600',
      icon: Music
    },
    {
      category: 'other',
      name: 'Others',
      count: getFilesCount('other', filesStats.other.count),
      usedGB: getGBUsage('other', filesStats.other.totalSizeBytes),
      totalGB: limits.other,
      colorClass: 'bg-slate-400',
      bgColorClass: 'bg-slate-100 text-slate-600',
      textColorClass: 'text-slate-500',
      icon: FolderMinus
    }
  ];

  const handleCardClick = (category) => {
    if (activeFilter === category) {
      setActiveFilter('all'); // toggle off
    } else {
      setActiveFilter(category);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardsData.map((card) => {
        const IconComponent = card.icon;
        const widthPercent = (card.usedGB / card.totalGB) * 100;
        const isSelected = activeFilter === card.category;

        return (
          <div
            key={card.category}
            id={`storage-card-${card.category}`}
            onClick={() => handleCardClick(card.category)}
            className={`bg-white rounded-2xl p-5 border cursor-pointer hover:shadow-md transition-all relative overflow-hidden group ${
              isSelected
                ? 'border-blue-600 ring-2 ring-blue-600/5 shadow-md shadow-blue-500/5 scale-[1.02]'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            {/* Quick Filter Selection Indicator Glow */}
            {isSelected && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
            )}

            <div className="flex items-start justify-between">
              {/* Category Icon Cylinder */}
              <div className={`p-3 rounded-xl ${card.bgColorClass}`}>
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Little stats overlay */}
              <span className="text-[10px] bg-slate-50/80 px-2 py-0.5 rounded-md font-semibold text-slate-550 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Filter <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>

            {/* Metrics */}
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-800 leading-none">
                {card.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {card.count.toLocaleString()} files
              </p>
            </div>

            {/* Storage Progress Area */}
            <div className="mt-4 pt-1">
              <div className="flex items-end justify-between text-xs font-semibold mb-1.5 text-slate-500">
                <span>{formatBytes(filesStats[card.category].totalSizeBytes)}</span>
                <span className="text-slate-400 font-light">{card.totalGB} GB limit</span>
              </div>
              
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.colorClass}`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
