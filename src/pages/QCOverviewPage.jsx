import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import SearchFilter from '../components/SearchFilter';
import { qcRecords } from '../data/dummyData';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const summaryColors = {
  'In QC': { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Clock },
  'Approved': { bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle },
  'Rework': { bg: 'bg-orange-50', text: 'text-orange-600', icon: AlertCircle },
  'Rejected': { bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
};

export default function QCOverviewPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = qcRecords.filter(q => {
    const matchSearch = q.fileName.toLowerCase().includes(search.toLowerCase()) ||
      q.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || q.result === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    'In QC': qcRecords.filter(q => q.result === 'In QC').length,
    'Approved': qcRecords.filter(q => q.result === 'Approved').length,
    'Rework': qcRecords.filter(q => q.result === 'Rework').length,
    'Rejected': qcRecords.filter(q => q.result === 'Rejected').length,
  };

  return (
    <AdminLayout pageTitle="QC Overview">
      <div className="space-y-5">
        <p className="text-sm text-gray-500">Monitor quality control status for all submitted files.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(counts).map(([label, count]) => {
            const cfg = summaryColors[label];
            const Icon = cfg.icon;
            return (
              <button
                key={label}
                onClick={() => setStatusFilter(statusFilter === label ? 'All' : label)}
                className={`card p-4 text-left transition-all hover:shadow-md ${statusFilter === label ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`inline-flex p-2 rounded-lg ${cfg.bg} ${cfg.text} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-2xl font-bold ${cfg.text}`}>{count}</div>
                <div className="text-sm text-brand-text font-medium mt-0.5">{label}</div>
              </button>
            );
          })}
        </div>

        {/* Search/Filter */}
        <div className="card p-4">
          <SearchFilter value={search} onChange={setSearch} placeholder="Search by file name, vendor, or QC ID...">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field sm:w-36">
              <option value="All">All Status</option>
              <option>In QC</option>
              <option>Approved</option>
              <option>Rework</option>
              <option>Rejected</option>
            </select>
          </SearchFilter>
        </div>

        {/* QC Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header">QC ID</th>
                  <th className="table-header">File</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Submitted</th>
                  <th className="table-header">QC Date</th>
                  <th className="table-header">QC By</th>
                  <th className="table-header">Result</th>
                  <th className="table-header">Errors</th>
                  <th className="table-header">Error Category</th>
                  <th className="table-header">Remarks</th>
                  <th className="table-header">Rework Deadline</th>
                  <th className="table-header">Rework #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400 text-sm">
                      No QC records found.
                    </td>
                  </tr>
                ) : filtered.map(q => (
                  <tr key={q.id} className={`hover:bg-brand-bg transition-colors
                    ${q.result === 'Rework' ? 'bg-orange-50/50' : ''}
                    ${q.result === 'Rejected' ? 'bg-red-50/50' : ''}`}
                  >
                    <td className="table-cell font-mono text-xs text-primary">{q.id}</td>
                    <td className="table-cell">
                      <div className="font-medium text-sm text-brand-text max-w-[160px] truncate">{q.fileName}</div>
                      <div className="text-xs text-gray-400">{q.fileId}</div>
                    </td>
                    <td className="table-cell text-sm">{q.vendorName}</td>
                    <td className="table-cell text-xs">{q.submissionDate}</td>
                    <td className="table-cell text-xs">{q.qcDate || <span className="text-gray-400">Pending</span>}</td>
                    <td className="table-cell text-xs">{q.qcBy || <span className="text-gray-400">—</span>}</td>
                    <td className="table-cell"><StatusBadge status={q.result} /></td>
                    <td className="table-cell text-center">
                      {q.errorCount !== null ? (
                        <span className={`font-semibold text-sm ${q.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {q.errorCount}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="table-cell text-xs">{q.errorCategory || <span className="text-gray-400">—</span>}</td>
                    <td className="table-cell">
                      <div className="text-xs text-gray-600 max-w-[180px] truncate" title={q.remarks}>{q.remarks}</div>
                    </td>
                    <td className="table-cell text-xs">
                      {q.reworkDeadline ? (
                        <span className="text-orange-600 font-medium">{q.reworkDeadline}</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="table-cell text-center">
                      <span className={`text-sm font-medium ${q.reworkCount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {q.reworkCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-brand-border text-xs text-gray-400">
            Showing {filtered.length} of {qcRecords.length} QC records
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
