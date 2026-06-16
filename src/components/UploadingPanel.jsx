import React from 'react';
import Icon from './Icon';
export default function UploadingPanel({
  uploadingFiles,
  onCancelUpload,
  onClearAllCompleted
}) {
  
  const getFileIcon = (extension) => {
    const ext = extension.toLowerCase();
    if (ext === 'xlsx' || ext === 'csv' || ext === 'xls') {
      return { icon: 'FileSpreadsheet', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    if (ext === 'mp4' || ext === 'mkv' || ext === 'mov' || ext === 'avi') {
      return { icon: 'FileVideo', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp' || ext === 'svg') {
      return { icon: 'FileImage', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    if (ext === 'pdf') {
      return { icon: 'FilePdf', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    if (ext === 'doc' || ext === 'docx' || ext === 'txt') {
      return { icon: 'FileText', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'aac') {
      return { icon: 'FileAudio', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    if (ext === 'zip' || ext === 'rar' || ext === 'tar' || ext === 'gz') {
      return { icon: 'FileZip', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    }
    return { icon: 'Folder', color: 'text-slate-900 bg-slate-100 border-slate-200' };
  };

  const completedCount = uploadingFiles.filter(f => f.status === 'completed').length;
  const activeCount = uploadingFiles.filter(f => f.status === 'uploading').length;

  return (
    <div id="uploading-files-panel" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-64 flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">Uploading Files</h3>
          {activeCount > 0 && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-slate-100 animate-pulse">
              {activeCount} active
            </span>
          )}
        </div>
        
        {completedCount > 0 && (
          <button
            onClick={onClearAllCompleted}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
            title="Clear finished jobs"
          >
            Clear Finished
          </button>
        )}
      </div>

      {/* Files List Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {uploadingFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <Icon name="CheckCircle2" className="w-9 h-9 text-slate-300 mb-1" />
            <p className="text-slate-400 text-xs font-semibold">No active file transfers</p>
            <p className="text-[10px] text-slate-350 mt-0.5 leading-normal">
              Add a file above to start the queue.
            </p>
          </div>
        ) : (
          uploadingFiles.map((file) => {
            const { icon: iconName, color: colorClasses } = getFileIcon(file.extension, file.category);
            const isCompleted = file.status === 'completed';
            const isCancelled = file.status === 'cancelled';

            return (
            <div
              key={file.id}
              id={`upload-item-${file.id}`}
                className={`group border rounded-xl p-3 flex gap-3 items-center transition-all relative overflow-hidden ${
                  isCancelled 
                ? 'border-slate-200 bg-slate-50/20' 
                : isCompleted 
                ? 'border-slate-200 bg-slate-50/10' 
                : 'border-slate-100 hover:border-slate-150 bg-white'
                }`}
              >
                {/* File Category Icon Container */}
                <div className={`p-2 rounded-xl border shrink-0 ${colorClasses}`}>
                  <Icon name={iconName} className="w-4 h-4" />
                </div>

                {/* Name, size, upload progress details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700 block truncate leading-tight">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                      {isCancelled ? 'Aborted' : isCompleted ? 'Completed' : `${file.progress}%`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-light leading-none">
                      {file.size}
                    </span>
                    <span className="text-slate-300 text-[10px]">&bull;</span>
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${
                      isCancelled 
                      ? 'text-slate-500' 
                      : isCompleted 
                      ? 'text-slate-900' 
                      : 'text-slate-900'
                    }`}>
                      {file.status}
                    </span>
                  </div>

                  {/* Transfer progress line */}
                  {!isCancelled && !isCompleted && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {isCompleted && (
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-slate-900 h-full w-full rounded-full" />
                    </div>
                  )}
                </div>

                {/* Cancel or Remove Action Button */}
                {!isCompleted && !isCancelled && (
                  <button
                    id={`cancel-upload-${file.id}`}
                    onClick={() => onCancelUpload(file.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-100 rounded-lg cursor-pointer"
                    title="Cancel upload"
                  >
                    <Icon name="X" className="w-3.5 h-3.5" />
                  </button>
                )}

                {(isCompleted || isCancelled) && (
                  <button
                    onClick={() => onCancelUpload(file.id)}
                    className="p-1 text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Remove from history"
                  >
                    <Icon name="X" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
