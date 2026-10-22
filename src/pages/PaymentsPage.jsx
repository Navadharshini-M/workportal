import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import SearchFilter from '../components/SearchFilter';
import Modal from '../components/Modal';
import { payments as initialPayments } from '../data/dummyData';
import { DollarSign, TrendingUp } from 'lucide-react';

const paymentStatuses = ['All', 'Not Eligible', 'Pending', 'Processing', 'Paid', 'On Hold'];

const nextStatus = {
  'Pending': 'Processing',
  'Processing': 'Paid',
  'On Hold': 'Pending',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updateModal, setUpdateModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [refNum, setRefNum] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = payments.filter(p => {
    const matchSearch = p.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.reference || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const totalProcessing = payments.filter(p => p.status === 'Processing').reduce((s, p) => s + p.amount, 0);

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    setPayments(payments.map(p =>
      p.id === updateModal.id
        ? {
            ...p,
            status: newStatus,
            paidDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : p.paidDate,
            reference: newStatus === 'Paid' && refNum ? refNum : p.reference,
          }
        : p
    ));
    setUpdateModal(null);
    showToast('Payment status updated.');
  };

  const exportCSV = () => {
    const headers = ['ID', 'Vendor', 'Period', 'Files', 'Rate/File', 'Amount', 'Status', 'Paid Date', 'Reference'];
    const rows = payments.map(p => [p.id, p.vendorName, p.period, p.fileCount, p.ratePerFile, p.amount, p.status, p.paidDate || '', p.reference || '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('Payments exported to CSV.');
  };

  return (
    <AdminLayout pageTitle="Payments">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm text-gray-500">Track vendor payment status. Only QC-approved files are eligible for payment.</p>
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
            Export CSV
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
              <div>
                <div className="text-xs text-gray-500">Total Paid</div>
                <div className="text-xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg"><TrendingUp className="w-5 h-5 text-amber-600" /></div>
              <div>
                <div className="text-xs text-gray-500">Pending Payment</div>
                <div className="text-xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-primary" /></div>
              <div>
                <div className="text-xs text-gray-500">Processing</div>
                <div className="text-xl font-bold text-primary">₹{totalProcessing.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search/Filter */}
        <div className="card p-4">
          <SearchFilter value={search} onChange={setSearch} placeholder="Search by vendor name, ID, or reference...">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field sm:w-40">
              {paymentStatuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </SearchFilter>
        </div>

        {/* Payments Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header">Pay. ID</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Period</th>
                  <th className="table-header">Appr. Files</th>
                  <th className="table-header">Rate/File</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Paid Date</th>
                  <th className="table-header">Reference #</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">No payment records found.</td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-brand-bg transition-colors">
                    <td className="table-cell font-mono text-xs text-primary">{p.id}</td>
                    <td className="table-cell">
                      <div className="font-medium text-sm text-brand-text">{p.vendorName}</div>
                    </td>
                    <td className="table-cell text-sm">{p.period}</td>
                    <td className="table-cell text-center font-semibold text-sm">{p.fileCount}</td>
                    <td className="table-cell text-sm">₹{p.ratePerFile}</td>
                    <td className="table-cell">
                      <span className="font-bold text-brand-text text-sm">₹{p.amount.toLocaleString()}</span>
                    </td>
                    <td className="table-cell"><StatusBadge status={p.status} /></td>
                    <td className="table-cell text-xs">{p.paidDate || <span className="text-gray-400">—</span>}</td>
                    <td className="table-cell text-xs font-mono">{p.reference || <span className="text-gray-400">—</span>}</td>
                    <td className="table-cell">
                      {['Pending', 'Processing', 'On Hold'].includes(p.status) ? (
                        <button
                          onClick={() => { setUpdateModal(p); setNewStatus(''); setRefNum(''); }}
                          className="text-xs btn-secondary px-2 py-1"
                        >
                          Update
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-brand-border text-xs text-gray-400">
            Showing {filtered.length} of {payments.length} payment records
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={!!updateModal} onClose={() => setUpdateModal(null)} title="Update Payment Status" size="sm">
        {updateModal && (
          <div className="space-y-4">
            <div className="bg-brand-bg rounded-lg p-3 text-sm">
              <div className="font-medium">{updateModal.vendorName}</div>
              <div className="text-gray-500">{updateModal.period} · ₹{updateModal.amount.toLocaleString()}</div>
            </div>
            <div>
              <label className="label">New Status</label>
              <select className="select-field" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="">-- Select status --</option>
                {paymentStatuses.slice(1).filter(s => s !== 'Not Eligible' && s !== updateModal.status).map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {newStatus === 'Paid' && (
              <div>
                <label className="label">Payment Reference Number</label>
                <input className="input-field" value={refNum} onChange={e => setRefNum(e.target.value)} placeholder="e.g. ISM-PAY-20261022-010" />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setUpdateModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleUpdateStatus} className="btn-primary">Update Status</button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
