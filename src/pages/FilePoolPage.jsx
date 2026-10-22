import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import SearchFilter from '../components/SearchFilter';
import { filePool as initialPool } from '../data/dummyData';
import { HardDrive, Calendar, CheckSquare } from 'lucide-react';

const statusOptions = ['All', 'Available', 'Allocated', 'In Progress', 'Submitted', 'In QC', 'Rework', 'Approved', 'Rejected', 'Overdue'];

export default function FilePoolPage() {
  const [files, setFiles] = useState(initialPool);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState([]);

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.project.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(f => f.id));
  };

  const statusCounts = statusOptions.slice(1).map(s => ({
    status: s,
    count: files.filter(f => f.status === s).length
  }));

  return (
    <AdminLayout pageTitle="File Pool">
      <div className="space-y-5">
        <p className="text-sm text-gray-500">View and manage all files available for allocation.</p>

        {/* Status Summary Pills */}
        <div className="flex flex-wrap gap-2">
          {statusCounts.map(({ status, count }) => count > 0 && (
            <button
              key={status}
              onClick={() => setStatusFilter(status === statusFilter ? 'All' : status)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${statusFilter === status ? 'bg-primary text-white border-primary' : 'bg-white text-brand-text border-brand-border hover:border-primary'}`}
            >
              {status} <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-brand-bg'}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Search / Filter */}
        <div className="card p-4">
          <SearchFilter value={search} onChange={setSearch} placeholder="Search by file name, ID, or project...">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="select-field sm:w-40"
            >
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </SearchFilter>
        </div>

        {/* Selected actions */}
        {selected.length > 0 && (
          <div className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 flex items-center gap-3">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">{selected.length} file(s) selected</span>
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-xs text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* File Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header w-10">
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded border-brand-border text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="table-header">File ID</th>
                  <th className="table-header">File Name</th>
                  <th className="table-header">Project</th>
                  <th className="table-header">Size</th>
                  <th className="table-header">Uploaded</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                      No files found matching your filters.
                    </td>
                  </tr>
                ) : filtered.map(f => (
                  <tr
                    key={f.id}
                    className={`hover:bg-brand-bg transition-colors cursor-pointer
                      ${selected.includes(f.id) ? 'bg-primary-light' : ''}
                      ${f.status === 'Overdue' ? 'bg-red-50' : ''}`}
                    onClick={() => toggleSelect(f.id)}
                  >
                    <td className="table-cell" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(f.id)}
                        onChange={() => toggleSelect(f.id)}
                        className="rounded border-brand-border text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="table-cell font-mono text-xs text-primary">{f.id}</td>
                    <td className="table-cell">
                      <div className="font-medium text-sm text-brand-text">{f.name}</div>
                    </td>
                    <td className="table-cell text-sm">{f.project}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <HardDrive className="w-3 h-3" /> {f.size}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" /> {f.uploadedDate}
                      </div>
                    </td>
                    <td className="table-cell"><StatusBadge status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-brand-border flex items-center justify-between">
            <span className="text-xs text-gray-400">Showing {filtered.length} of {files.length} files</span>
            <span className="text-xs text-gray-400">
              {files.filter(f => f.status === 'Available').length} available for allocation
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
