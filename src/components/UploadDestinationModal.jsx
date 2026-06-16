import React from 'react';
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
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Before upload</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
              Choose where these files will be added
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              You can change each file destination using the dropdown before it enters the queue.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close upload destination modal"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <div className="space-y-3">
            {files.map((file) => {
              const destination = getFolderLabel(file.folderCategory ?? file.category);

              return (
                <div
                  key={file.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {file.size} · Current destination: <span className="font-semibold text-slate-900">{destination}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {file.category}
                      </div>

                      <div className="relative">
                        <select
                          value={file.folderCategory ?? file.category}
                          onChange={(e) => onUpdateDestination(file.id, e.target.value)}
                          className="min-w-[150px] appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-9 text-xs font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                        >
                          {FOLDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Icon
                          name="ChevronDown"
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            {files.length} file(s) ready to be added.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-black"
            >
              Add to queue
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
