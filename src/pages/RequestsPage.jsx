import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';
import { workRequests as initialRequests } from '../data/dummyData';
import { CheckCircle, XCircle, Sliders, MessageSquare } from 'lucide-react';

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rejectModal, setRejectModal] = useState(null);
  const [partialModal, setPartialModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [partialCount, setPartialCount] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = requests.filter(r => {
    const matchSearch = r.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.project.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApproveFull = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved Full', filesApproved: r.filesRequested } : r));
    showToast('Request approved in full.');
  };

  const handleApprovePartial = () => {
    const count = Number(partialCount);
    if (!count || count < 1 || count > partialModal.filesRequested) return;
    setRequests(requests.map(r => r.id === partialModal.id ? { ...r, status: 'Approved Partial', filesApproved: count } : r));
    setPartialModal(null);
    setPartialCount('');
    showToast('Request approved partially.');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setRequests(requests.map(r => r.id === rejectModal.id ? { ...r, status: 'Rejected', rejectReason } : r));
    setRejectModal(null);
    setRejectReason('');
    showToast('Request rejected.');
  };

  const statusOptions = ['All', 'Pending', 'Approved Full', 'Approved Partial', 'Rejected'];

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <AdminLayout pageTitle="Work Requests">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 flex-1">Review and approve vendor work requests before allocation.</p>
          {pendingCount > 0 && (
            <div className="badge bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium">
              {pendingCount} pending review
            </div>
          )}
        </div>

        {/* Search/Filter */}
        <div className="card p-4">
          <SearchFilter value={search} onChange={setSearch} placeholder="Search by vendor, request ID or project...">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field sm:w-44">
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </SearchFilter>
        </div>

        {/* Requests Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header">Req. ID</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Files Req.</th>
                  <th className="table-header">Files Appr.</th>
                  <th className="table-header">Project</th>
                  <th className="table-header">Pref. Deadline</th>
                  <th className="table-header">Req. Date</th>
                  <th className="table-header">Remarks</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                      No work requests found.
                    </td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className={`hover:bg-brand-bg transition-colors ${r.status === 'Pending' ? 'border-l-2 border-l-amber-400' : ''}`}>
                    <td className="table-cell font-mono text-xs text-primary">{r.id}</td>
                    <td className="table-cell">
                      <div className="font-medium text-sm text-brand-text">{r.vendorName}</div>
                      <div className="text-xs text-gray-400">{r.vendorId}</div>
                    </td>
                    <td className="table-cell text-center">
                      <span className="font-semibold text-brand-text">{r.filesRequested}</span>
                    </td>
                    <td className="table-cell text-center">
                      {r.status.startsWith('Approved') ? (
                        <span className="font-semibold text-green-600">{r.filesApproved}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="table-cell text-sm">{r.project}</td>
                    <td className="table-cell text-xs">{r.preferredDeadline}</td>
                    <td className="table-cell text-xs">{r.requestDate}</td>
                    <td className="table-cell">
                      <div className="text-xs text-gray-500 max-w-[140px] truncate" title={r.remarks}>{r.remarks}</div>
                      {r.rejectReason && (
                        <div className="text-xs text-red-500 mt-0.5 max-w-[140px] truncate" title={r.rejectReason}>
                          ✕ {r.rejectReason}
                        </div>
                      )}
                    </td>
                    <td className="table-cell"><StatusBadge status={r.status} /></td>
                    <td className="table-cell">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleApproveFull(r.id)}
                            title="Approve Full"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setPartialModal(r); setPartialCount(''); }}
                            title="Approve Partial"
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setRejectModal(r); setRejectReason(''); }}
                            title="Reject"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-brand-border text-xs text-gray-400">
            Showing {filtered.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Partial Approval Modal */}
      <Modal isOpen={!!partialModal} onClose={() => setPartialModal(null)} title="Approve Partial Request" size="sm">
        {partialModal && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700">
              <strong>{partialModal.vendorName}</strong> requested <strong>{partialModal.filesRequested}</strong> files.
            </div>
            <div>
              <label className="label">Files to approve (max {partialModal.filesRequested})</label>
              <input
                className="input-field"
                type="number"
                min={1}
                max={partialModal.filesRequested}
                value={partialCount}
                onChange={e => setPartialCount(e.target.value)}
                placeholder={`1 – ${partialModal.filesRequested}`}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setPartialModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleApprovePartial} className="btn-primary">Approve Partial</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Work Request" size="sm">
        {rejectModal && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg px-4 py-3 text-sm text-red-700">
              Rejecting request from <strong>{rejectModal.vendorName}</strong>.
            </div>
            <div>
              <label className="label">Reason for rejection *</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Provide a reason for the vendor..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleReject} className="btn-danger">Reject Request</button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
