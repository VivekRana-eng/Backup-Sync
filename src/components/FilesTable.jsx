import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Download,
  Edit3,
  Star,
  Archive,
  Trash2,
  List,
  LayoutGrid,
  ChevronDown,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileVideo,
  FileImage,
  FileText,
  FileAudio,
  FileArchive,
  FileCode,
  ExternalLink,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockFiles';

export default function FilesTable({
  files,
  onToggleStar,
  onToggleArchive,
  onDeleteFile,
  onRenameFile,
  onTriggerDownload,
  fileTypeFilter,
  setFileTypeFilter
}) {
  const [viewMode, setViewMode] = useState('list');
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('modified');
  const [sortOrder, setSortOrder] = useState('desc');

  // Interactive drop-down states
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFileIcon = (extension) => {
    const ext = extension.toLowerCase();
    if (ext === 'xlsx' || ext === 'csv' || ext === 'xls') {
      return { icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    }
    if (ext === 'mp4' || ext === 'mkv' || ext === 'mov' || ext === 'avi') {
      return { icon: FileVideo, color: 'text-red-500 bg-red-50 border-red-100' };
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp' || ext === 'svg') {
      return { icon: FileImage, color: 'text-blue-500 bg-blue-50 border-blue-100' };
    }
    if (ext === 'pdf') {
      return { icon: FileText, color: 'text-orange-500 bg-orange-50 border-orange-100' };
    }
    if (ext === 'doc' || ext === 'docx' || ext === 'txt') {
      return { icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' };
    }
    if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'aac') {
      return { icon: FileAudio, color: 'text-violet-500 bg-violet-50 border-violet-100' };
    }
    if (ext === 'zip' || ext === 'rar' || ext === 'tar' || ext === 'gz') {
      return { icon: FileArchive, color: 'text-amber-500 bg-amber-50 border-amber-100' };
    }
    return { icon: FileCode, color: 'text-slate-550 bg-slate-100 border-slate-200' };
  };

  // Handle renaming triggers
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

  const handleRenameKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveRename(id);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  // Sorting Handler
  const triggerSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Logic
  const filteredFiles = files
    .filter((file) => {
      // 1. Search Query Filters
      const query = searchTableQuery.toLowerCase();
      const matchesSearch =
        file.name.toLowerCase().includes(query) ||
        file.extension.toLowerCase().includes(query) ||
        file.folder.toLowerCase().includes(query) ||
        file.owner.name.toLowerCase().includes(query);

      // 2. File Category Tabs Filter
      const matchesCategory =
        fileTypeFilter === 'all' || file.category === fileTypeFilter;

      // 3. Folder Breadcrumb Click Filters
      const matchesFolder =
        !selectedFolder || file.folderChain.includes(selectedFolder);

      // 4. Time Interval Filters
      let matchesTime = true;
      if (timeFilter === 'month') {
        matchesTime = file.lastModified.startsWith('2026-06');
      } else if (timeFilter === 'week') {
        const day = parseInt(file.lastModified.substring(8, 10));
        matchesTime = file.lastModified.startsWith('2026-06') && day >= 6; // simulate first 10 days
      }

      return matchesSearch && matchesCategory && matchesFolder && matchesTime;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        comparison = a.sizeBytes - b.sizeBytes;
      } else if (sortBy === 'modified') {
        comparison = a.lastModified.localeCompare(b.lastModified);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Breadcrumb parsing helper
  const renderBreadcrumbs = (folder) => {
    const segments = folder.split(' > ');
    return (
      <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600/90 tracking-tight">
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-2.5 h-2.5 text-slate-350" />}
            <button
              onClick={() => setSelectedFolder(seg)}
              className="hover:underline hover:text-blue-700 cursor-pointer text-left"
            >
              {seg}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div id="all-files-table-container" className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 md:p-6 space-y-4">
      {/* Table Action Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Active view title */}
        <div>
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>All System Files</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {filteredFiles.length} items
            </span>
          </h2>
          {selectedFolder && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-slate-400">Filtering:</span>
              <span className="bg-blue-50 text-blue-600 font-bold text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                {selectedFolder}
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="hover:bg-blue-100 rounded-sm p-0.5 leading-none"
                >
                  &times;
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Toolbar controls group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick inline search */}
          <div className="relative">
            <input
              type="text"
              value={searchTableQuery}
              onChange={(e) => setSearchTableQuery(e.target.value)}
              placeholder="Filter Table..."
              className="text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-705 border border-transparent focus:border-slate-300 outline-none rounded-lg py-1.5 pl-3 pr-8 transition-all"
            />
          </div>

          {/* Category Selector Dropdown */}
          <div className="relative">
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600 px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">File type: all</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audios</option>
              <option value="other">Others</option>
            </select>
          </div>

          {/* Time Filter Calendar Selector */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600 px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">Date: all time</option>
              <option value="month">This month</option>
              <option value="week">Past week</option>
            </select>
          </div>

          {/* List vs Grid Layout switcher */}
          <div className="flex items-center border border-slate-100 rounded-lg p-0.5 bg-slate-50">
            <button
              id="list-view-toggle-btn"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List layout view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              id="grid-view-toggle-btn"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid layout view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      {filteredFiles.length === 0 ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Filter className="w-10 h-10 text-slate-300" />
          <p className="font-bold text-sm">No files found</p>
          <p className="text-xs text-slate-350 max-w-xs mt-0.5">
            Try a different search or clear the current filters.
          </p>
          <button
            onClick={() => {
              setSearchTableQuery('');
              setFileTypeFilter('all');
              setTimeFilter('all');
              setSelectedFolder(null);
            }}
            className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* --- LIST MODE LAYOUT --- */
        <div className="overflow-x-auto -mx-5 md:-mx-6">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold select-none bg-slate-50/50">
                <th
                  onClick={() => triggerSort('name')}
                  className="pl-5 md:pl-6 py-3.5 cursor-pointer hover:text-slate-700 transition-colors font-bold"
                >
                  <div className="flex items-center gap-1">
                    <span>File Name</span>
                    {sortBy === 'name' && (
                      <span className="text-blue-600 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => triggerSort('size')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-700 transition-colors font-bold"
                >
                  <div className="flex items-center gap-1">
                    <span>Size</span>
                    {sortBy === 'size' && (
                      <span className="text-blue-600 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3.5 font-bold">Folder Structure</th>
                <th className="px-4 py-3.5 font-bold">Owner</th>
                <th className="px-4 py-3.5 font-bold">Team Members</th>
                <th
                  onClick={() => triggerSort('modified')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-700 transition-colors font-bold"
                >
                  <div className="flex items-center gap-1">
                    <span>Last Modified</span>
                    {sortBy === 'modified' && (
                      <span className="text-blue-600 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th className="pr-5 md:pr-6 py-3.5 text-right font-bold w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map((file) => {
                const { icon: IconComponent, color: colorClasses } = getFileIcon(file.extension, file.category);
                const isDropdownOpen = openDropdownId === file.id;
                const isRenaming = renamingId === file.id;

                return (
                  <tr
                    key={file.id}
                    id={`row-${file.id}`}
                    className={`hover:bg-slate-50/70 group transition-colors ${
                      file.isStarred ? 'bg-amber-50/5' : ''
                    }`}
                  >
                    {/* File Name Cell */}
                    <td className="pl-5 md:pl-6 py-4 flex items-center gap-3">
                      {/* Interactive Star click on row */}
                      <button
                        onClick={() => onToggleStar(file.id)}
                        className={`p-1.5 rounded-lg hover:bg-slate-100/80 transition-colors shrink-0 cursor-pointer ${
                          file.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* File Icon */}
                      <div className={`p-2.5 border rounded-lg shrink-0 ${colorClasses}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Editable name label */}
                      <div className="min-w-0 flex-1">
                        {isRenaming ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => handleRenameKeyPress(e, file.id)}
                              className="text-xs font-semibold text-slate-800 bg-white border border-blue-400 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-400"
                              autoFocus
                            />
                            <button
                              onClick={() => saveRename(file.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1 px-2 rounded-lg cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setRenamingId(null)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] py-1 px-2 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span
                            onDoubleClick={() => startRename(file)}
                            className="font-bold text-slate-700 truncate block hover:text-blue-600 cursor-pointer text-xs sm:text-sm"
                            title="Double click to rename"
                          >
                            {file.name}.{file.extension}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Size Cell */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                      {file.size}
                    </td>

                    {/* Folder click breadcrumbs */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {renderBreadcrumbs(file.folder)}
                    </td>

                    {/* Owner Cell */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={file.owner.avatar}
                          alt={file.owner.name}
                          className="w-5.5 h-5.5 rounded-full object-cover border border-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]" title={file.owner.name}>
                          {file.owner.name === CURRENT_USER.name ? 'Me' : file.owner.name}
                        </span>
                      </div>
                    </td>

                    {/* Stacked Members list */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {file.members.length === 0 ? (
                        <span className="text-[10px] text-slate-450 bg-slate-50/50 px-2.5 py-1 rounded-md font-semibold border border-dashed border-slate-100">
                          Private
                        </span>
                      ) : (
                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          {file.members.slice(0, 3).map((mem, index) => (
                            <img
                              key={index}
                              src={mem.avatar}
                              alt={mem.name}
                              className="w-5.5 h-5.5 rounded-full object-cover ring-2 ring-white border border-slate-50"
                              title={mem.name}
                              referrerPolicy="no-referrer"
                            />
                          ))}
                          {file.members.length > 3 && (
                            <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 ring-2 ring-white select-none">
                              +{file.members.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Date Modified Cell */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs font-medium text-slate-530">
                      {file.lastModified}
                    </td>

                    {/* Row Context Menu dropdown */}
                    <td className="pr-5 md:pr-6 py-4 text-right whitespace-nowrap relative" ref={isDropdownOpen ? dropdownRef : undefined}>
                      <button
                        id={`dropdown-btn-${file.id}`}
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : file.id)}
                        className="p-1 px-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100/50 transition-all cursor-pointer"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {isDropdownOpen && (
                        <div
                          id={`dropdown-menu-${file.id}`}
                          className="absolute right-6 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200"
                        >
                          <button
                            onClick={() => {
                              onTriggerDownload(file);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-650 flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            <span>Download File</span>
                          </button>
                          
                          <button
                            onClick={() => startRename(file)}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-650 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Rename File</span>
                          </button>

                          <button
                            onClick={() => {
                              onToggleStar(file.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-650 flex items-center gap-2 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 text-slate-400" />
                            <span>{file.isStarred ? 'Unstar File' : 'Star File'}</span>
                          </button>

                          <button
                            onClick={() => {
                              onToggleArchive(file.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-650 flex items-center gap-2 cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5 text-slate-400" />
                            <span>{file.isArchived ? 'Move to active' : 'Archive Asset'}</span>
                          </button>

                          <div className="border-t border-slate-50 my-1 font-bold" />

                          <button
                            id={`row-delete-action-${file.id}`}
                            onClick={() => {
                              onDeleteFile(file.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-rose-50 text-xs font-bold text-rose-500 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
        /* --- GRID MODE LAYOUT --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const { icon: IconComponent, color: colorClasses } = getFileIcon(file.extension, file.category);
            const isDropdownOpen = openDropdownId === file.id;
            const isRenaming = renamingId === file.id;

            return (
              <div
                key={file.id}
                id={`grid-card-${file.id}`}
                className={`bg-white border rounded-2xl p-4.5 hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between ${
                  file.isStarred ? 'border-amber-100 bg-amber-50/5' : 'border-slate-100'
                }`}
              >
                {/* Ribbon top card bar */}
                <div className="flex items-start justify-between">
                  {/* Category icon */}
                  <div className={`p-3 rounded-xl border shrink-0 ${colorClasses}`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1 relative" ref={isDropdownOpen ? dropdownRef : undefined}>
                    {/* Star toggle */}
                    <button
                      onClick={() => onToggleStar(file.id)}
                      className={`p-1 rounded-md hover:bg-slate-50 cursor-pointer ${
                        file.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Grid card vertical menu */}
                    <button
                      onClick={() => setOpenDropdownId(isDropdownOpen ? null : file.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
                    >
                      <MoreHorizontal className="w-4.5 h-4.5" />
                    </button>

                    {isDropdownOpen && (
                      <div
                        className="absolute right-0 top-7 w-44 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden py-1 transform origin-top-right transition-all duration-200"
                      >
                        <button
                          onClick={() => {
                            onTriggerDownload(file);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-650 flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-slate-400" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => startRename(file)}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-650 flex items-center gap-2 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-slate-400" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={() => {
                            onToggleArchive(file.id);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-650 flex items-center gap-3 cursor-pointer"
                        >
                          <Archive className="w-3 h-3 text-slate-400" />
                          <span>{file.isArchived ? 'Activate' : 'Archive'}</span>
                        </button>
                        <div className="border-t border-slate-50 my-1" />
                        <button
                          onClick={() => {
                            onDeleteFile(file.id);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-[11px] font-bold text-rose-500 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Title Details */}
                <div className="mt-4 flex-1">
                  {isRenaming ? (
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyPress(e, file.id)}
                        className="text-xs font-semibold text-slate-800 bg-white border border-blue-400 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-400"
                        autoFocus
                      />
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => saveRename(file.id)}
                          className="bg-blue-600 font-bold text-[9px] text-white py-0.5 px-2 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setRenamingId(null)}
                          className="bg-slate-100 font-bold text-[9px] text-slate-500 py-0.5 px-2 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3
                        onDoubleClick={() => startRename(file)}
                        className="font-bold text-slate-700 text-xs sm:text-sm truncate block group-hover:text-blue-600 transition-colors"
                        title={file.name}
                      >
                        {file.name}.{file.extension}
                      </h3>
                      {renderBreadcrumbs(file.folder)}
                    </div>
                  )}

                  {/* Size and modification details */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-3">
                    <span>{file.size}</span>
                    <span>&bull;</span>
                    <span>{file.lastModified.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Stacked members and owner indicator row */}
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
                          key={index}
                          src={mem.avatar}
                          alt={mem.name}
                          className="w-4.5 h-4.5 rounded-full object-cover ring-2 ring-white border border-slate-50"
                          title={mem.name}
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      {file.members.length > 3 && (
                        <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-slate-100 text-[8px] font-bold text-slate-600 ring-2 ring-white">
                          +{file.members.length - 3}
                        </span>
                      )}
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
