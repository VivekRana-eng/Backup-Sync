import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Icon from './Icon';
import { CURRENT_USER } from '../data/mockFiles';

function getTypeLabel(file) {
  const extension = file.extension.toUpperCase();

  if (file.mimeType?.startsWith('video/')) return `Video (${extension})`;
  if (file.mimeType?.startsWith('image/')) return `Image (${extension})`;
  if (file.mimeType?.startsWith('audio/')) return `Audio (${extension})`;
  if (file.mimeType === 'application/pdf' || file.extension === 'pdf') return 'PDF Document';
  if (file.mimeType?.startsWith('text/') || ['txt', 'md', 'csv', 'json', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'xml'].includes(file.extension.toLowerCase())) {
    return `Text (${extension})`;
  }

  return `${file.category[0].toUpperCase()}${file.category.slice(1)} (${extension})`;
}

export default function FilePreviewModal({ file, onClose, onDownload, canDownload = true }) {
  const [textContent, setTextContent] = useState('');
  const [docxHtml, setDocxHtml] = useState('');
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingDocx, setIsLoadingDocx] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const isTextLike =
      file.mimeType?.startsWith('text/') ||
      ['txt', 'md', 'csv', 'json', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'xml'].includes(file.extension.toLowerCase());
    const isDocx = file.extension.toLowerCase() === 'docx' || file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (isDocx && file.sourceFile) {
      setIsLoadingDocx(true);
      setDocxHtml('');

      (async () => {
        try {
          const mammoth = await import('mammoth/mammoth.browser');
          const arrayBuffer = await file.sourceFile.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });

          if (cancelled) return;
          setDocxHtml(result.value || '<p>No readable content found.</p>');
          setIsLoadingDocx(false);
        } catch {
          if (cancelled) return;
          setDocxHtml('<p>Unable to extract readable text from this DOCX file.</p>');
          setIsLoadingDocx(false);
        }
      })();

      setTextContent('');
      setIsLoadingText(false);
      return () => {
        cancelled = true;
      };
    }

    if (!isTextLike || !file.sourceFile) {
      setTextContent('');
      setIsLoadingText(false);
      setDocxHtml('');
      setIsLoadingDocx(false);
      return undefined;
    }

    setIsLoadingText(true);
    setDocxHtml('');
    setIsLoadingDocx(false);
    file.sourceFile.text().then((content) => {
      if (cancelled) return;
      setTextContent(content);
      setIsLoadingText(false);
    }).catch(() => {
      if (cancelled) return;
      setTextContent('Unable to preview this text file.');
      setIsLoadingText(false);
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const typeLabel = getTypeLabel(file);
  const isVideo = file.mimeType?.startsWith('video/');
  const isImage = file.mimeType?.startsWith('image/');
  const isAudio = file.mimeType?.startsWith('audio/');
  const isPdf = file.mimeType === 'application/pdf' || file.extension === 'pdf';
  const isDocx =
    file.extension.toLowerCase() === 'docx' ||
    file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isText =
    file.mimeType?.startsWith('text/') ||
    ['txt', 'md', 'csv', 'json', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'xml'].includes(file.extension.toLowerCase());

  const renderPreview = (previewClassName = 'flex aspect-video w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 p-2 sm:p-4 md:aspect-auto md:h-full md:flex-1') => (
    <div className={previewClassName}>
      {isImage && file.previewUrl ? (
        <img
          src={file.previewUrl}
          alt={file.name}
          className="block h-full w-full max-w-full rounded-2xl object-contain"
        />
      ) : isVideo && file.previewUrl ? (
        <video
          src={file.previewUrl}
          controls
          autoPlay
          playsInline
          className="block h-full w-full max-w-full rounded-2xl bg-black object-contain"
        />
      ) : isAudio && file.previewUrl ? (
        <div className="flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl bg-white/5 p-8 text-center">
          <div className="rounded-3xl bg-slate-100 p-5 text-slate-900">
            <Icon name="FileAudio" className="h-12 w-12" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{file.name}.{file.extension}</p>
            <p className="mt-1 text-sm text-white/60">Audio preview ready below</p>
          </div>
          <audio src={file.previewUrl} controls className="w-full" />
        </div>
      ) : isPdf && file.previewUrl ? (
        <iframe
          title={`${file.name}.${file.extension}`}
          src={file.previewUrl}
          className="block h-full w-full max-w-full rounded-2xl bg-white"
        />
      ) : isDocx ? (
        <div className="h-full w-full overflow-auto rounded-2xl bg-[#f8f5ee] p-4 sm:p-6 text-left text-slate-900 shadow-inner">
          {isLoadingDocx ? (
            <div className="text-sm font-medium text-slate-500">Loading DOCX preview...</div>
          ) : (
            <article
              className="mx-auto max-w-3xl rounded-2xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-slate-200"
              style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
            >
              <div
                className="docx-preview prose prose-slate max-w-none prose-p:my-3 prose-headings:tracking-tight prose-ul:my-3 prose-ol:my-3"
                dangerouslySetInnerHTML={{ __html: docxHtml || '<p>No readable DOCX content found.</p>' }}
              />
            </article>
          )}
        </div>
      ) : isText ? (
        <div className="h-full w-full overflow-auto rounded-2xl bg-[#0b1020] p-4 sm:p-5 text-left">
          {isLoadingText ? (
            <div className="text-sm text-white/60">Loading preview...</div>
          ) : (
            <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-100 sm:text-sm">
              {textContent || 'No text preview available.'}
            </pre>
          )}
        </div>
      ) : (
        <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl bg-white/5 p-6 text-center sm:p-10">
          <div className="rounded-3xl bg-white/10 p-5 text-white">
            <Icon name="Folder" className="h-14 w-14" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{typeLabel}</p>
            <p className="mt-1 text-sm text-white/60">
              This file type is saved, but no inline preview is available yet.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
            Upload an image, video, audio, PDF, or text file to preview it here.
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto px-3 py-4 sm:items-center sm:px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative z-10 flex w-[calc(100vw-1rem)] max-w-6xl max-h-[calc(100dvh-2rem)] flex-col overflow-hidden bg-[#f8f8f7] shadow-[0_30px_100px_rgba(15,23,42,0.35)] border border-white/60 rounded-2xl sm:w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl lg:rounded-[28px]"
      >
        <div className="grid min-h-0 min-w-0 grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] md:flex-1">
          <div className="flex min-h-0 min-w-0 flex-col bg-[#111111] p-4 sm:p-7 rounded-t-2xl sm:rounded-t-3xl md:rounded-none md:flex-1 md:h-full">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {file.name}.{file.extension}
                </h2>
                <p className="mt-1 text-xs font-medium text-white/65 sm:text-sm">{file.folder}</p>
              </div>
              <button
                onClick={onClose}
                className="hidden rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                aria-label="Close preview"
              >
                <Icon name="X" className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              {renderPreview()}
            </div>
          </div>

          <aside className="min-h-0 min-w-0 bg-white p-4 sm:p-7 rounded-b-2xl sm:rounded-b-3xl md:rounded-none h-auto md:h-full">
            <div className="flex min-h-0 flex-col justify-between gap-6 h-auto md:h-full md:overflow-y-auto">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">File Inspector</p>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-800">Details</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                    aria-label="Close preview"
                  >
                    <Icon name="X" className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">File Type</p>
                    <p className="mt-2 text-lg font-bold text-slate-800">{typeLabel}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Size</p>
                    <p className="mt-2 text-lg font-bold text-slate-800">{file.size}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Created On</p>
                    <p className="mt-2 text-lg font-bold text-slate-800">{file.lastModified}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Storage Location</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{file.folder}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">System Owner</p>
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={file.owner.avatar}
                        alt={file.owner.name}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-800">
                          {file.owner.name === CURRENT_USER.name ? 'Admin' : file.owner.name}
                        </p>
                        <p className="truncate text-sm text-slate-500">{file.owner.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:gap-3 sm:pb-0">
                {canDownload && (
                  <button
                    onClick={() => onDownload(file)}
                    className="flex-1 rounded-2xl bg-red-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:bg-red-950"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={canDownload ? 'rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50' : 'flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50'}
                >
                  Close
                </button>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
