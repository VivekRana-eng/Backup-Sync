import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { CURRENT_USER } from '../data/mockFiles';

const isAdmin = (userRole) => userRole === 'admin';

export default function FilesTable({
  files,
  onToggleStar,
  onToggleArchive,
  onDeleteFile,
  onRenameFile,
  onTriggerDownload,
  onFileSelect,
  fileTypeFilter,
  setFileTypeFilter,
  userRole,
}) {
  const [viewMode, setViewMode] = useState('list');
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [dateFilterMode, setDateFilterMode] = useState('all');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [sortBy, setSortBy] = useState('modified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const dropdownRef = useRef(null);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);

  const parseFileDate = (value) => {
    const [datePart, timePart = '00:00'] = value.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes || 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFileIcon = (extension) => {
    const ext = extension.toLowerCase();
    if (['xlsx', 'csv', 'xls'].includes(ext)) return { icon: 'FileSpreadsheet', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    if (['mp4', 'mkv', 'mov', 'avi'].includes(ext)) return { icon: 'FileVideo', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return { icon: 'FileImage', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    if (ext === 'pdf') return { icon: 'FilePdf', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    if (['doc', 'docx', 'txt'].includes(ext)) return { icon: 'FileText', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return { icon: 'FileAudio', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    if (['zip', 'rar', 'tar', 'gz'].includes(ext)) return { icon: 'FileZip', color: 'text-slate-900 bg-slate-100 border-slate-200' };
    return { icon: 'Folder', color: 'text-slate-900 bg-slate-100 border-slate-200' };
  };

  const openFilePreview = (file) => {
    setOpenDropdownId(null);
    onFileSelect?.(file);
  };

  const startRename = (file) => {
    setRenamingId(file.id);
    setRenameValue(file.name);
    setOpenDropdownId(null);
  };

  const saveRename = (id) => {
    if (renameValue.trim()) {
      onRenameFile(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        const query = searchTableQuery.toLowerCase();
        const matchesSearch =
          file.name.toLowerCase().includes(query) ||
          file.extension.toLowerCase().includes(query) ||
          file.folder.toLowerCase().includes(query) ||
          file.owner.name.toLowerCase().includes(query);

        const matchesCategory = fileTypeFilter === 'all' || file.category === fileTypeFilter;
        const matchesFolder = !selectedFolder || file.folderChain.includes(selectedFolder);

        let matchesTime = true;
        const fileDate = parseFileDate(file.lastModified);
        if (dateFilterMode === 'month') {
          matchesTime = fileDate >= startOfMonth && fileDate <= today;
        } else if (dateFilterMode === 'week') {
          matchesTime = fileDate >= startOfWeek && fileDate <= today;
        } else if (dateFilterMode === 'custom') {
          const fromDate = customDateFrom ? new Date(`${customDateFrom}T00:00:00`) : null;
          const toDate = customDateTo ? new Date(`${customDateTo}T23:59:59.999`) : null;
          matchesTime = (!fromDate || fileDate >= fromDate) && (!toDate || fileDate <= toDate);
        }

        return matchesSearch && matchesCategory && matchesFolder && matchesTime;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
        if (sortBy === 'size') comparison = a.sizeBytes - b.sizeBytes;
        if (sortBy === 'modified') comparison = a.lastModified.localeCompare(b.lastModified);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [
    files,
    searchTableQuery,
    fileTypeFilter,
    selectedFolder,
    dateFilterMode,
    customDateFrom,
    customDateTo,
    sortBy,
    sortOrder,
    today,
    startOfMonth,
    startOfWeek,
  ]);

  const triggerSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderBreadcrumbs = (folder) => {
    const segments = folder.split(' > ');
    return (
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 tracking-tight">
        {segments.map((seg, idx) => (
          <React.Fragment key={seg + idx}>
            {idx > 0 && <Icon name="ChevronRight" className="w-2.5 h-2.5 text-slate-350" />}
            <button
              type="button"
              onClick={() => setSelectedFolder(seg)}
              className="hover:underline hover:text-slate-900 cursor-pointer text-left"
            >
              {seg}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const clearFilters = () => {
    setSearchTableQuery('');
    setFileTypeFilter('all');
    setDateFilterMode('all');
    setCustomDateFrom('');
    setCustomDateTo('');
    setSelectedFolder(null);
  };

  const canManage = isAdmin(userRole);

  return (
    <div id="all-files-table-container" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>All System Files</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {filteredFiles.length} items
            </span>
          </h2>
          {selectedFolder && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-slate-500">Filtering:</span>
              <span className="bg-slate-100 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                {selectedFolder}
                <button
                  type="button"
                  onClick={() => setSelectedFolder(null)}
                  className="hover:bg-slate-200 rounded-sm p-0.5 leading-none"
                >
                  &times;
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchTableQuery}
            onChange={(e) => setSearchTableQuery(e.target.value)}
            placeholder="Filter Table..."
            className="text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 border border-transparent focus:border-slate-300 outline-none rounded-lg py-1.5 pl-3 pr-8 transition-all"
          />

          <div className="relative">
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-9 text-xs font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
            >
              <option value="all">File type: all</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audios</option>
              <option value="other">Others</option>
            </select>
            <Icon name="ChevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="relative">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  Date
                </span>
                <div className="relative">
                  <select
                    value={dateFilterMode}
                    onChange={(e) => setDateFilterMode(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-9 text-xs font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                  >
                    <option value="all">All time</option>
                    <option value="month">This month</option>
                    <option value="week">This week</option>
                    <option value="custom">Custom range</option>
                  </select>
                  <Icon name="ChevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                {(dateFilterMode !== 'all' || customDateFrom || customDateTo) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilterMode('all');
                      setCustomDateFrom('');
                      setCustomDateTo('');
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {dateFilterMode === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="w-[132px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer [color-scheme:light]"
                  />
                  <span className="text-[10px] font-semibold text-slate-400">to</span>
                  <input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="w-[132px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold tracking-tight text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 cursor-pointer [color-scheme:light]"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Icon name="List" className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Icon name="LayoutGrid" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Icon name="Filter" className="w-10 h-10 text-slate-300" />
          <p className="font-bold text-sm text-slate-900">No files found</p>
          <p className="text-xs text-slate-350 max-w-xs mt-0.5">Try a different search or clear the current filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-xs text-slate-900 hover:text-black font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="overflow-x-auto -mx-5 md:-mx-6">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold select-none bg-slate-50/50">
                <th onClick={() => triggerSort('name')} className="pl-5 md:pl-6 py-3.5 cursor-pointer hover:text-slate-700 transition-colors font-bold">
                  <div className="flex items-center gap-1">
                    <span>File Name</span>
                    {sortBy === 'name' && <span className="text-slate-900 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th onClick={() => triggerSort('size')} className="px-4 py-3.5 cursor-pointer hover:text-slate-700 transition-colors font-bold">
                  <div className="flex items-center gap-1">
                    <span>Size</span>
                    {sortBy === 'size' && <span className="text-slate-900 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th className="px-4 py-3.5 font-bold">Folder Structure</th>
                <th className="px-4 py-3.5 font-bold">Owner</th>
                <th className="px-4 py-3.5 font-bold">Team Members</th>
                <th onClick={() => triggerSort('modified')} className="px-4 py-3.5 cursor-pointer hover:text-slate-700 transition-colors font-bold">
                  <div className="flex items-center gap-1">
                    <span>Last Modified</span>
                    {sortBy === 'modified' && <span className="text-slate-900 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th className="pr-5 md:pr-6 py-3.5 text-right font-bold w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map((file) => {
                const { icon: iconName, color: colorClasses } = getFileIcon(file.extension);
                const isDropdownOpen = openDropdownId === file.id;
                const isRenaming = renamingId === file.id;

                return (
                  <tr key={file.id} id={`row-${file.id}`} className="hover:bg-slate-50/70 group transition-colors">
                    <td className="pl-5 md:pl-6 py-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openFilePreview(file)}
                        className={`p-2.5 border rounded-lg shrink-0 cursor-pointer ${colorClasses}`}
                        title="Open file preview"
                      >
                        <Icon name={iconName} className="w-4 h-4" />
                      </button>

                      <div className="min-w-0 flex-1 cursor-pointer" onClick={isRenaming ? undefined : () => openFilePreview(file)} role="button" tabIndex={isRenaming ? -1 : 0}>
                        {isRenaming ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveRename(file.id);
                                if (e.key === 'Escape') setRenamingId(null);
                              }}
                              className="text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-slate-400"
                              autoFocus
                            />
                            <button type="button" onClick={() => saveRename(file.id)} className="bg-slate-900 hover:bg-black text-white font-bold text-[10px] py-1 px-2 rounded-lg cursor-pointer">Save</button>
                            <button type="button" onClick={() => setRenamingId(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] py-1 px-2 rounded-lg cursor-pointer">Cancel</button>
                          </div>
                        ) : (
                          <span onDoubleClick={() => canManage && startRename(file)} className="font-bold text-slate-800 truncate block hover:text-slate-900 cursor-pointer text-xs sm:text-sm" title="Double click to rename">
                            {file.name}.{file.extension}
                            {userRole === 'uploader' && (
                              <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md">
                                Synced
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">{file.size}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{renderBreadcrumbs(file.folder)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img src={file.owner.avatar} alt={file.owner.name} className="w-5.5 h-5.5 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer" />
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]" title={file.owner.name}>
                          {file.owner.name === CURRENT_USER.name ? 'Me' : file.owner.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {file.members.length === 0 ? (
                        <span className="text-[10px] text-slate-450 bg-slate-50/50 px-2.5 py-1 rounded-md font-semibold border border-dashed border-slate-100">Private</span>
                      ) : (
                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          {file.members.slice(0, 3).map((mem, index) => (
                            <img key={`${mem.name}-${index}`} src={mem.avatar} alt={mem.name} className="w-5.5 h-5.5 rounded-full object-cover ring-2 ring-white border border-slate-50" title={mem.name} referrerPolicy="no-referrer" />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs font-medium text-slate-530">{file.lastModified}</td>
                    <td className="pr-5 md:pr-6 py-4 text-right whitespace-nowrap relative" ref={isDropdownOpen ? dropdownRef : undefined}>
                      {canManage ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`row-delete-action-direct-${file.id}`}
                            onClick={() => onDeleteFile(file.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer inline-flex items-center"
                            title="Delete Asset"
                          >
                            <Icon name="Trash2" className="w-4 h-4" />
                          </button>
                          <button
                            id={`dropdown-btn-${file.id}`}
                            onClick={() => setOpenDropdownId(isDropdownOpen ? null : file.id)}
                            className="p-1 px-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100/50 transition-all cursor-pointer"
                          >
                            <Icon name="MoreHorizontal" className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openFilePreview(file)}
                            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                          >
                            <Icon name="Eye" className="w-3.5 h-3.5" />
                            <span>View File</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onTriggerDownload(file)}
                            className="px-3.5 py-1.5 bg-black hover:bg-neutral-900 text-white font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                          >
                            <Icon name="Download" className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      )}

                      {isDropdownOpen && canManage && (
                        <div id={`dropdown-menu-${file.id}`} className="absolute right-6 mt-1 w-48 rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-sm z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200">
                          <button
                            onClick={() => {
                              onTriggerDownload(file);
                              setOpenDropdownId(null);
                            }}
                            className="group w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                          >
                            <Icon name="Download" className="w-3.5 h-3.5 text-slate-400 transition-colors group-hover:text-white" />
                            <span>Download File</span>
                          </button>
                          <button
                            onClick={() => startRename(file)}
                            className="group w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                          >
                            <Icon name="Edit3" className="w-3.5 h-3.5 text-slate-400 transition-colors group-hover:text-white" />
                            <span>Rename File</span>
                          </button>
                          <button
                            onClick={() => {
                              onToggleArchive(file.id);
                              setOpenDropdownId(null);
                            }}
                            className="group w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                          >
                            <Icon name="Archive" className="w-3.5 h-3.5 text-slate-400 transition-colors group-hover:text-white" />
                            <span>{file.isArchived ? 'Move to active' : 'Archive Asset'}</span>
                          </button>
                          <div className="border-t border-slate-50 my-1 font-bold" />
                          <button
                            id={`row-delete-action-${file.id}`}
                            onClick={() => {
                              onDeleteFile(file.id);
                              setOpenDropdownId(null);
                            }}
                            className="group w-full text-left px-4 py-2 text-xs font-bold text-slate-900 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                          >
                            <Icon name="Trash2" className="w-3.5 h-3.5 transition-colors group-hover:text-white" />
                            <span>Delete Asset</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const { icon: iconName, color: colorClasses } = getFileIcon(file.extension);
            const isDropdownOpen = openDropdownId === file.id;
            const isRenaming = renamingId === file.id;

            return (
              <div key={file.id} id={`grid-card-${file.id}`} className="bg-white border border-slate-200 rounded-2xl p-4.5 hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <button type="button" onClick={() => openFilePreview(file)} className={`p-3 rounded-xl border shrink-0 cursor-pointer ${colorClasses}`} title="Open file preview">
                    <Icon name={iconName} className="w-4.5 h-4.5" />
                  </button>

                  <div className="flex items-center gap-1 relative" ref={isDropdownOpen ? dropdownRef : undefined}>
                    {canManage ? (
                      <>
                        <button onClick={() => setOpenDropdownId(isDropdownOpen ? null : file.id)} className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer">
                          <Icon name="MoreHorizontal" className="w-4.5 h-4.5" />
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute right-0 top-7 w-44 rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-sm z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200">
                            <button
                              onClick={() => {
                                onTriggerDownload(file);
                                setOpenDropdownId(null);
                              }}
                              className="group w-full text-left px-3 py-1.5 text-[11px] font-semibold text-slate-700 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                            >
                              <Icon name="Download" className="w-3 h-3 text-slate-400 transition-colors group-hover:text-white" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => startRename(file)}
                              className="group w-full text-left px-3 py-1.5 text-[11px] font-semibold text-slate-700 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                            >
                              <Icon name="Edit3" className="w-3 h-3 text-slate-400 transition-colors group-hover:text-white" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={() => {
                                onToggleArchive(file.id);
                                setOpenDropdownId(null);
                              }}
                              className="group w-full text-left px-3 py-1.5 text-[11px] font-semibold text-slate-700 flex items-center gap-3 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                            >
                              <Icon name="Archive" className="w-3 h-3 text-slate-400 transition-colors group-hover:text-white" />
                              <span>{file.isArchived ? 'Activate' : 'Archive'}</span>
                            </button>
                            <div className="border-t border-slate-50 my-1" />
                            <button
                              onClick={() => {
                                onDeleteFile(file.id);
                                setOpenDropdownId(null);
                              }}
                              className="group w-full text-left px-3 py-1.5 text-[11px] font-bold text-slate-900 flex items-center gap-2 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
                            >
                              <Icon name="Trash2" className="w-3 h-3 transition-colors group-hover:text-white" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openFilePreview(file)}
                          className="px-3 py-1.5 text-[11px] font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => onTriggerDownload(file)}
                          className="px-3 py-1.5 text-[11px] font-semibold text-white bg-black hover:bg-neutral-900 rounded-lg cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  {isRenaming ? (
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(file.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-slate-400"
                        autoFocus
                      />
                      <div className="flex gap-1 justify-end">
                        <button type="button" onClick={() => saveRename(file.id)} className="bg-slate-900 font-bold text-[9px] text-white py-0.5 px-2 rounded-md">
                          Save
                        </button>
                        <button type="button" onClick={() => setRenamingId(null)} className="bg-slate-100 font-bold text-[9px] text-slate-500 py-0.5 px-2 rounded-md">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => openFilePreview(file)}
                        onDoubleClick={() => canManage && startRename(file)}
                        className="font-bold text-slate-800 text-xs sm:text-sm truncate block group-hover:text-slate-900 transition-colors text-left cursor-pointer"
                        title={file.name}
                      >
                        {file.name}.{file.extension}
                        {userRole === 'uploader' && (
                          <span className="block mt-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-1 py-0.5 w-max">
                            Synced
                          </span>
                        )}
                      </button>
                      {!canManage && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openFilePreview(file)}
                            className="px-3 py-1.5 text-[11px] font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => onTriggerDownload(file)}
                            className="px-3 py-1.5 text-[11px] font-semibold text-white bg-black hover:bg-neutral-900 rounded-lg cursor-pointer"
                          >
                            Download
                          </button>
                        </div>
                      )}
                      {renderBreadcrumbs(file.folder)}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-3">
                    <span>{file.size}</span>
                    <span>&bull;</span>
                    <span>{file.lastModified.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={file.owner.avatar}
                      alt={file.owner.name}
                      className="w-5 h-5 rounded-full object-cover border border-slate-150"
                      title={`Owner: ${file.owner.name}`}
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[70px]">
                      {file.owner.name === CURRENT_USER.name ? 'Me' : file.owner.name.split(' ')[0]}
                    </span>
                  </div>

                  {file.members.length === 0 ? (
                    <span className="text-[9px] text-slate-400 bg-slate-50/50 border border-slate-100 rounded-md px-1.5 py-0.5 font-bold">
                      Private
                    </span>
                  ) : (
                    <div className="flex items-center -space-x-1 overflow-hidden">
                      {file.members.slice(0, 3).map((mem, index) => (
                        <img
                          key={`${mem.name}-${index}`}
                          src={mem.avatar}
                          alt={mem.name}
                          className="w-4.5 h-4.5 rounded-full object-cover ring-2 ring-white border border-slate-50"
                          title={mem.name}
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
