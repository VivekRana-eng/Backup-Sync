import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Icon from './Icon';
import ClientLogo from './ClientLogo';
import { formatStorageSize } from '../lib/workspace';

export default function ClientsView({
  files,
  clientShiftOptions = [],
  onAddClientClick,
  setClientShiftFilter,
  setActiveTab,
}) {
  const [expandedClient, setExpandedClient] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('clients_view_mode') || 'list';
  });

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('clients_view_mode', mode);
  };

  // Compute stats across all clients
  const totalClients = clientShiftOptions.length;
  const totalFilesCount = files.length;
  const totalBytesUsed = files.reduce((sum, file) => sum + file.sizeBytes, 0);
  const totalStorageLabel = formatStorageSize(totalBytesUsed);

  // Process data for each client
  const clientData = clientShiftOptions.map((client) => {
    const clientFiles = files.filter((file) => file.clientShift === client);
    const clientTotalBytes = clientFiles.reduce((sum, file) => sum + file.sizeBytes, 0);
    const clientTotalSizeLabel = formatStorageSize(clientTotalBytes);

    // Group files by uploader (owner)
    const uploadersMap = {};
    clientFiles.forEach((file) => {
      const email = file.owner.email;
      if (!uploadersMap[email]) {
        uploadersMap[email] = {
          user: file.owner,
          filesCount: 0,
          totalBytes: 0,
        };
      }
      uploadersMap[email].filesCount += 1;
      uploadersMap[email].totalBytes += file.sizeBytes;
    });

    const uploadersList = Object.values(uploadersMap).sort(
      (a, b) => b.totalBytes - a.totalBytes
    );

    return {
      name: client,
      filesCount: clientFiles.length,
      totalBytes: clientTotalBytes,
      totalSizeLabel: clientTotalSizeLabel,
      uploaders: uploadersList,
      files: clientFiles,
    };
  });

  const handleSwitchToClient = (clientName) => {
    setClientShiftFilter(clientName);
    setActiveTab('Dashboard');
  };

  const toggleExpandClient = (clientName) => {
    setExpandedClient((prev) => (prev === clientName ? null : clientName));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Icon name="Users" className="w-5 h-5 text-red-900" />
            Client Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of clients, uploaders, and storage utilization.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddClientClick}
          className="self-start sm:self-auto h-10 px-4 flex items-center justify-center gap-2 rounded-2xl bg-red-900 text-xs font-bold text-white shadow-md hover:bg-red-950 transition-all active:scale-[0.98]"
        >
          <Icon name="Plus" className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_14px_30px_rgba(15,23,42,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-900 shrink-0">
            <Icon name="Layers" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Clients</span>
            <span className="block text-xl font-extrabold text-slate-900 mt-0.5">{totalClients}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_14px_30px_rgba(15,23,42,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Icon name="File" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Files</span>
            <span className="block text-xl font-extrabold text-slate-900 mt-0.5">{totalFilesCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_14px_30px_rgba(15,23,42,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Icon name="HardDrive" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Storage Occupied</span>
            <span className="block text-xl font-extrabold text-slate-900 mt-0.5">{totalStorageLabel}</span>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Clients</h3>
          <div className="flex items-center gap-1 bg-slate-150/80 p-0.5 rounded-xl border border-slate-200/60 shadow-xs">
            <button
              type="button"
              onClick={() => handleSetViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-400 hover:text-slate-650'
              }`}
              title="List View"
            >
              <Icon name="List" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-400 hover:text-slate-655'
              }`}
              title="Grid View"
            >
              <Icon name="LayoutGrid" className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {clientData.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 shadow-sm">
            <Icon name="Users" className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="font-bold">No clients registered yet</p>
            <p className="text-xs text-slate-350 max-w-sm mx-auto mt-1">
              Add a client using the button above to begin tracking their uploads and usage.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {clientData.map((client) => {
              const isExpanded = expandedClient === client.name;
              
              return (
                <div
                  key={client.name}
                  className="bg-white border border-slate-200 rounded-3xl shadow-[0_14px_40px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden transition-all duration-350 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Client info */}
                    <div className="flex items-center gap-3">
                      <ClientLogo name={client.name} size="lg" />
                      <div className="min-w-0">
                        <h4 className="text-base font-extrabold text-slate-800 tracking-tight truncate" title={client.name}>
                          {client.name}
                        </h4>
                        <div className="flex flex-col gap-0.5 mt-0.5 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Icon name="File" className="w-3.5 h-3.5 text-slate-450" />
                            {client.filesCount} file(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="HardDrive" className="w-3.5 h-3.5 text-slate-450" />
                            {client.totalSizeLabel} storage
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Uploaders Avatars overlapping / summary */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Uploaders Summary
                      </span>
                      {client.uploaders.length === 0 ? (
                        <p className="text-xs text-slate-400 font-medium py-1">No files uploaded yet.</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            {client.uploaders.slice(0, 4).map(({ user }) => (
                              <img
                                key={user.email}
                                src={user.avatar}
                                alt={user.name}
                                title={`${user.name} (${user.email})`}
                                className="inline-block h-8 w-8 rounded-xl object-cover ring-2 ring-white"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                            {client.uploaders.length > 4 && (
                              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 ring-2 ring-white">
                                +{client.uploaders.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-600">
                            {client.uploaders.length} active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSwitchToClient(client.name)}
                      className="flex-1 h-9 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-900 text-xs font-bold transition-all active:scale-[0.98]"
                      title="Switch workspace context to this client"
                    >
                      <Icon name="ArrowRight" className="w-3.5 h-3.5" />
                      <span>Switch Workspace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpandClient(client.name)}
                      className="h-9 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                    >
                      <span>{isExpanded ? 'Hide' : 'Files'}</span>
                      <Icon
                        name="ChevronDown"
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Expanded files section in grid mode */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 bg-slate-50/30 overflow-hidden"
                      >
                        <div className="p-4 pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Files under this client
                          </span>
                          {client.files.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium">No files.</p>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {client.files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs">
                                  <div className="min-w-0 flex-1 pr-2">
                                    <span className="font-bold text-slate-800 block truncate">
                                      {file.name}.{file.extension}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {file.size} • {file.category}
                                    </span>
                                  </div>
                                  <img
                                    src={file.owner.avatar}
                                    alt={file.owner.name}
                                    title={file.owner.name}
                                    className="w-5 h-5 rounded-full object-cover shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {clientData.map((client) => {
              const isExpanded = expandedClient === client.name;
              
              return (
                <div
                  key={client.name}
                  className="bg-white border border-slate-200 rounded-3xl shadow-[0_18px_50px_rgba(15,23,42,0.05)] overflow-hidden transition-all duration-200"
                >
                  {/* Card Header Area */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <ClientLogo name={client.name} size="md" />
                      <div className="min-w-0">
                        <h4 className="text-base font-extrabold text-slate-800 tracking-tight">{client.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Icon name="File" className="w-3.5 h-3.5 text-slate-400" />
                            {client.filesCount} file(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="HardDrive" className="w-3.5 h-3.5 text-slate-400" />
                            {client.totalSizeLabel} storage
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSwitchToClient(client.name)}
                        className="h-9 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-900 text-xs font-bold transition-all active:scale-[0.98]"
                        title="Switch workspace context to this client"
                      >
                        <Icon name="ArrowRight" className="w-3.5 h-3.5" />
                        <span>Switch Workspace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpandClient(client.name)}
                        className="h-9 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                      >
                        <span>{isExpanded ? 'Hide Files' : 'Show Files'}</span>
                        <Icon
                          name="ChevronDown"
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: Uploaders Breakdown */}
                  <div className="p-6">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Uploaders summary
                    </h5>

                    {client.uploaders.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium py-2">
                        No files have been uploaded for this client yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {client.uploaders.map(({ user, filesCount, totalBytes }) => (
                          <div
                            key={user.email}
                            className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-colors"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 truncate">
                                {user.name}
                              </span>
                              <span className="block text-[10px] text-slate-400 truncate -mt-0.5">
                                {user.email}
                              </span>
                              <span className="block text-[10px] text-red-900 font-bold mt-1">
                                {filesCount} file(s) ({formatStorageSize(totalBytes)})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Collapsible Files Detail View */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 bg-slate-50/30 overflow-hidden"
                      >
                        <div className="p-6 pt-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Files under this client
                          </h5>

                          {client.files.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium">No files.</p>
                          ) : (
                            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-xs">
                              <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="p-3 pl-4">Name</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Uploader</th>
                                    <th className="p-3">Size</th>
                                    <th className="p-3 pr-4">Modified</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                  {client.files.map((file) => (
                                    <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                                      <td className="p-3 pl-4 font-bold text-slate-800">
                                        <span className="truncate max-w-[200px] block">
                                          {file.name}.{file.extension}
                                        </span>
                                      </td>
                                      <td className="p-3 text-slate-500 capitalize">
                                        {file.category}
                                      </td>
                                      <td className="p-3">
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={file.owner.avatar}
                                            alt={file.owner.name}
                                            className="w-5 h-5 rounded-full object-cover"
                                          />
                                          <span className="font-medium text-slate-700 truncate max-w-[120px]">
                                            {file.owner.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-3 text-slate-700 font-bold">{file.size}</td>
                                      <td className="p-3 pr-4 text-slate-400 font-medium">{file.lastModified}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
