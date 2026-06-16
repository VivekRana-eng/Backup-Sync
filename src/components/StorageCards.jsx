import React from 'react';
import Icon from './Icon';

export default function StorageCards({
  filesStats,
  activeFilter,
  setActiveFilter
}) {
  const getFilesCount = (category, currentCount) => {
    return currentCount;
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
      usedBytes: filesStats.document.totalSizeBytes,
      bgColorClass: 'bg-slate-100 text-slate-900',
      icon: 'FileText'
    },
    {
      category: 'image',
      name: 'Images',
      count: getFilesCount('image', filesStats.image.count),
      usedBytes: filesStats.image.totalSizeBytes,
      bgColorClass: 'bg-slate-100 text-slate-900',
      icon: 'FileImage'
    },
    {
      category: 'video',
      name: 'Videos',
      count: getFilesCount('video', filesStats.video.count),
      usedBytes: filesStats.video.totalSizeBytes,
      bgColorClass: 'bg-slate-100 text-slate-900',
      icon: 'FileVideo'
    },
    {
      category: 'audio',
      name: 'Audio',
      count: getFilesCount('audio', filesStats.audio.count),
      usedBytes: filesStats.audio.totalSizeBytes,
      bgColorClass: 'bg-slate-100 text-slate-900',
      icon: 'FileAudio'
    },
    {
      category: 'other',
      name: 'Others',
      count: getFilesCount('other', filesStats.other.count),
      usedBytes: filesStats.other.totalSizeBytes,
      bgColorClass: 'bg-slate-100 text-slate-900',
      icon: 'Folder'
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
        const isSelected = activeFilter === card.category;

        return (
          <div
            key={card.category}
            id={`storage-card-${card.category}`}
            onClick={() => handleCardClick(card.category)}
            className={`bg-white rounded-2xl p-5 border cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group ${
              isSelected
                ? 'border-slate-900 ring-2 ring-slate-900/5 shadow-md shadow-black/5 scale-[1.02]'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            {/* Quick Filter Selection Indicator Glow */}
            {isSelected && <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />}

            <div className="flex items-start justify-between">
              {/* Category Icon Cylinder */}
              <div className={`p-3 rounded-xl ${card.bgColorClass}`}>
                <Icon name={card.icon} className="w-5 h-5" />
              </div>

              {/* Little stats overlay */}
                <span className="text-[10px] bg-slate-50/80 px-2 py-0.5 rounded-md font-semibold text-slate-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Filter <Icon name="ArrowUpRight" className="w-2.5 h-2.5" />
                </span>
              </div>

            {/* Metrics */}
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-900 leading-none">
                {card.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {card.count.toLocaleString()} files
              </p>
            </div>

            {/* Storage Usage Area */}
            <div className="mt-4 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Storage used</span>
                <span>{formatBytes(card.usedBytes)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
