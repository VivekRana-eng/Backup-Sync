import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Icon from './Icon';
import { getFolderDestination } from '../lib/workspace';

const FOLDER_OPTIONS = [
  { value: 'document', label: 'Docs' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'other', label: 'Others' },
];

function getFolderLabel(category) {
  return getFolderDestination(category).folder;
}

function FilePreviewThumb({ file }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file.sourceFile) {
      setPreviewUrl('');
      return undefined;
    }

    const url = URL.createObjectURL(file.sourceFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file.sourceFile]);

  const type = file.sourceFile?.type || '';
  const isImage = type.startsWith('image/');
  const isVideo = type.startsWith('video/');

  if (isImage && previewUrl) {
    return (
      <img
        src={previewUrl}
        alt={file.name}
        className="h-full w-full rounded-3xl border border-white/10 object-cover bg-white"
      />
    );
  }

  if (isVideo && previewUrl) {
    return (
      <video
        src={previewUrl}
        className="h-full w-full rounded-3xl border border-white/10 bg-black object-contain"
        controls
        playsInline
      />
    );
  }

  if (type.startsWith('audio/') && previewUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-950 p-6">
        <audio src={previewUrl} controls className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <Icon name="FileText" className="h-10 w-10" />
        <p className="text-xs font-semibold text-white/70">Preview unavailable</p>
      </div>
    </div>
  );
}

export default function UploadDestinationModal({
  isOpen,
  files,
  onClose,
  onConfirm,
  onUpdateDestination,
}) {
  if (!isOpen || files.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative z-10 flex w-[calc(100vw-0.75rem)] max-w-[72rem] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.35)] sm:w-[calc(100vw-2rem)] sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Before upload</p>
            <h2 className="mt-2 max-w-[16ch] text-[1.35rem] font-extrabold leading-tight tracking-tight text-slate-900 sm:max-w-[18ch] sm:text-[2rem] sm:leading-[1.05]">
              Choose where these files will be added
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-500">
              Preview the file, choose the destination, then add it to the queue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close upload destination modal"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto px-3 py-3 sm:px-6 sm:py-5">
          <div className="space-y-3">
            {files.map((file) => {
              const destination = getFolderLabel(file.folderCategory ?? file.category);

              return (
                <div
                  key={file.id}
                  className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="bg-[#101010] px-4 py-4 text-white sm:px-5 sm:py-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[1.05rem] font-extrabold tracking-tight text-white sm:text-xl">
                            {file.name}
                          </h3>
                          <p className="mt-1 truncate text-xs font-medium text-white/55 sm:text-sm">
                            {getFolderLabel(file.folderCategory ?? file.category)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[20px] border border-white/10 bg-[#171717] p-3 sm:p-4">
                        <div className="overflow-hidden rounded-[18px] bg-black">
                          <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10]">
                            <FilePreviewThumb file={file} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex h-full min-w-0 flex-col gap-4 sm:gap-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">File Inspector</p>
                          <h4 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Details</h4>
                        </div>

                        <div className="grid gap-4 sm:gap-5">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">File type</p>
                            <p className="mt-2 break-words text-base font-bold text-slate-900">
                              {file.category.charAt(0).toUpperCase() + file.category.slice(1)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Size</p>
                            <p className="mt-2 break-words text-base font-bold text-slate-900">{file.size}</p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Current destination</p>
                            <p className="mt-2 break-words text-base font-bold text-slate-900">{destination}</p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Move to</p>
                            <div className="relative mt-2">
                              <select
                                value={file.folderCategory ?? file.category}
                                onChange={(e) => onUpdateDestination(file.id, e.target.value)}
                                className="w-full min-w-0 appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                              >
                                {FOLDER_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <Icon
                                name="ChevronDown"
                                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:bg-black"
                          >
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:min-w-28"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-xs font-medium text-slate-500">
            {files.length} file(s) ready to be added.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
