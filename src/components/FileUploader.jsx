import React, { useState, useRef } from 'react';
import Icon from './Icon';
export default function FileUploader({ onFilesSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const onUploaderClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      id="drag-drop-container"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onUploaderClick}
      className={`relative h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group select-none ${
        isDragActive
          ? 'border-blue-600 bg-blue-50/60 shadow-inner'
          : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/40'
      }`}
    >
      {/* Hidden file input */}
      <input
        aria-label="Upload files input"
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Decorative concentric circle backdrop */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors mb-4 ${
        isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
      }`}>
        <Icon name="CloudUpload" className={`w-8 h-8 transition-transform group-hover:scale-110 ${
          isDragActive ? 'animate-bounce' : ''
        }`} />
      </div>

      <div className="max-w-md mx-auto">
        <p className="text-sm font-bold text-slate-700 tracking-tight">
          Drop files here or <span className="text-blue-600 hover:text-blue-700 group-hover:underline font-semibold leading-relaxed">click to browse</span>
        </p>
        <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-normal">
          Supports PDFs, spreadsheets, images, videos, zip files, presentations, and audio up to 2GB.
        </p>
      </div>

      {/* Drag Over Banner */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-600/5 rounded-2xl flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
          <span className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transform scale-110">
            Drop your files now!
          </span>
        </div>
      )}
    </div>
  );
}
