import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchFilter from '../components/SearchFilter';
import { allocations as initialAllocations, vendors, filePool } from '../data/dummyData';
import { Plus, Calendar, RefreshCw, RotateCcw, Clock } from 'lucide-react';

const availableFiles = filePool.filter(f => f.status === 'Available');

export default function AllocateWorkPage() {
  const [allocations, setAllocations] = useState(initialAllocations);
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [extendModal, setExtendModal] = useState(null);
  const [reassignModal, setReassignModal] = useState(null);
  const [takebackModal, setTakebackModal] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    vendorId: '',
    fileId: '',
    deadlineDays: '7',
    instructions: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [extendDays, setExtendDays] = useState('');
  const [reassignVendor, setReassignVendor] = useState('');
  const [takebackReason, setTakebackReason] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = allocations.filter(a => {
    const matchSearch = a.fileName.toLowerCase().includes(search.toLowerCase()) ||
      a.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const validate = () => {
    const errs = {};
    if (!form.vendorId) errs.vendorId = 'Please select a vendor.';
    if (!form.fileId) errs.fileId = 'Please select a file.';
    if (!form.deadlineDays || isNaN(form.deadlineDays) || Number(form.deadlineDays) < 1) errs.deadlineDays = 'Enter valid deadline days.';
    return errs;
  };

  const handleAllocate = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    const vendor = vendors.find(v => v.id === form.vendorId);
    const file = availableFiles.find(f => f.id === form.fileId);
    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(today.getDate() + Number(form.deadlineDays));

    const newAlloc = {
      id: `A${String(allocations.length + 1).padStart(3, '0')}`,
      fileId: file.id,
      fileName: file.name,
      project: file.project,
      vendorId: vendor.id,
      vendorName: vendor.name,
      allocatedDate: today.toISOString().split('T')[0],
      deadline: deadline.toISOString().split('T')[0],
      status: 'Allocated',
      instructions: form.instructions,
      daysRemaining: Number(form.deadlineDays),
    };

    setAllocations([newAlloc, ...allocations]);
    setAllocModalOpen(false);
    setForm({ vendorId: '', fileId: '', deadlineDays: '7', instructions: '' });
    showToast('Work allocated successfully.');
  };

  const handleExtend = () => {
    if (!extendDays || isNaN(extendDays) || Number(extendDays) < 1) return;
    setAllocations(allocations.map(a =>
      a.id === extendModal.id
        ? { ...a, daysRemaining: (a.daysRemaining || 0) + Number(extendDays), status: a.status === 'Overdue' ? 'Allocated' : a.status }
        : a
    ));
    setExtendModal(null);
    setExtendDays('');
    showToast('Deadline extended.');
  };

  const handleReassign = () => {
    if (!reassignVendor) return;
    const vendor = vendors.find(v => v.id === reassignVendor);
    setAllocations(allocations.map(a =>
      a.id === reassignModal.id
        ? { ...a, vendorId: vendor.id, vendorName: vendor.name, status: 'Allocated' }
        : a
    ));
    setReassignModal(null);
    setReassignVendor('');
    showToast('File reassigned to ' + vendor.name);
  };

  const handleTakeback = () => {
    if (!takebackReason.trim()) return;
    setAllocations(allocations.filter(a => a.id !== takebackModal.id));
    setTakebackModal(null);
    setTakebackReason('');
    showToast('File taken back from vendor.');
  };

  const statusOptions = ['All', 'Allocated', 'In Progress', 'Submitted', 'In QC', 'Rework', 'Approved', 'Overdue'];

  return (
    <AdminLayout pageTitle="Allocate Work">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm text-gray-500">Assign files to vendors with deadlines and track allocation status.</p>
          <button id="new-allocation-btn" onClick={() => { setAllocModalOpen(true); setFormErrors({}); }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Allocation
          </button>
        </div>

        {/* Search/Filter */}
        <div className="card p-4">
          <SearchFilter value={search} onChange={setSearch} placeholder="Search by file name, vendor, or allocation ID...">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field sm:w-40">
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </SearchFilter>
        </div>

        {/* Allocations Table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border">
            <h2 className="section-title">Current Allocations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header">Alloc. ID</th>
                  <th className="table-header">File</th>
                  <th className="table-header">Project</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Allocated</th>
                  <th className="table-header">Deadline</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">No allocations found.</td>
                  </tr>
                ) : filtered.map(a => (
                  <tr key={a.id} className={`hover:bg-brand-bg transition-colors ${a.status === 'Overdue' ? 'bg-red-50' : ''}`}>
                    <td className="table-cell font-mono text-xs text-primary">{a.id}</td>
                    <td className="table-cell">
                      <div className="font-medium text-sm text-brand-text max-w-[160px] truncate">{a.fileName}</div>
                      <div className="text-xs text-gray-400">{a.fileId}</div>
                    </td>
                    <td className="table-cell text-sm">{a.project}</td>
                    <td className="table-cell text-sm">{a.vendorName}</td>
                    <td className="table-cell text-xs">{a.allocatedDate}</td>
                    <td className="table-cell">
                      <div className="text-xs">{a.deadline}</div>
                      {a.daysRemaining < 0 ? (
                        <div className="text-xs text-red-500 mt-0.5">{Math.abs(a.daysRemaining)}d overdue</div>
                      ) : a.daysRemaining === 0 ? (
                        <div className="text-xs text-amber-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Due today</div>
                      ) : (
                        <div className="text-xs text-green-600 mt-0.5">{a.daysRemaining}d left</div>
                      )}
                    </td>
                    <td className="table-cell"><StatusBadge status={a.status} /></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setExtendModal(a); setExtendDays(''); }}
                          className="p-1.5 text-primary hover:bg-primary-light rounded text-xs flex items-center gap-1"
                          title="Extend deadline"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setReassignModal(a); setReassignVendor(''); }}
                          className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded"
                          title="Reassign"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setTakebackModal(a); setTakebackReason(''); }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          title="Take back"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-brand-border text-xs text-gray-400">
            Showing {filtered.length} of {allocations.length} allocations
          </div>
        </div>
      </div>

      {/* New Allocation Modal */}
      <Modal isOpen={allocModalOpen} onClose={() => setAllocModalOpen(false)} title="Allocate Work to Vendor">
        <div className="space-y-4">
          <div>
            <label className="label">Select Vendor *</label>
            <select className={`select-field ${formErrors.vendorId ? 'border-red-400' : ''}`} value={form.vendorId} onChange={e => setForm({ ...form, vendorId: e.target.value })}>
              <option value="">-- Choose vendor --</option>
              {vendors.filter(v => v.status === 'Active').map(v => (
                <option key={v.id} value={v.id}>{v.name} (₹{v.ratePerFile}/file)</option>
              ))}
            </select>
            {formErrors.vendorId && <p className="text-xs text-red-500 mt-1">{formErrors.vendorId}</p>}
          </div>
          <div>
            <label className="label">Select File *</label>
            <select className={`select-field ${formErrors.fileId ? 'border-red-400' : ''}`} value={form.fileId} onChange={e => setForm({ ...form, fileId: e.target.value })}>
              <option value="">-- Choose file --</option>
              {availableFiles.map(f => (
                <option key={f.id} value={f.id}>{f.id} – {f.name} ({f.project})</option>
              ))}
            </select>
            {formErrors.fileId && <p className="text-xs text-red-500 mt-1">{formErrors.fileId}</p>}
          </div>
          <div>
            <label className="label">Deadline (days from today) *</label>
            <input className={`input-field ${formErrors.deadlineDays ? 'border-red-400' : ''}`} type="number" min={1} value={form.deadlineDays} onChange={e => setForm({ ...form, deadlineDays: e.target.value })} placeholder="e.g. 7" />
            {formErrors.deadlineDays && <p className="text-xs text-red-500 mt-1">{formErrors.deadlineDays}</p>}
          </div>
          <div>
            <label className="label">Optional Instructions</label>
            <textarea className="input-field resize-none" rows={3} value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} placeholder="Any specific instructions for the vendor..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setAllocModalOpen(false)} className="btn-ghost">Cancel</button>
            <button id="confirm-allocation-btn" onClick={handleAllocate} className="btn-primary">Allocate</button>
          </div>
        </div>
      </Modal>

      {/* Extend Deadline Modal */}
      <Modal isOpen={!!extendModal} onClose={() => setExtendModal(null)} title="Extend Deadline" size="sm">
        {extendModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">File: <strong>{extendModal.fileName}</strong></p>
            <p className="text-sm text-gray-600">Current deadline: <strong>{extendModal.deadline}</strong></p>
            <div>
              <label className="label">Extend by (days)</label>
              <input className="input-field" type="number" min={1} value={extendDays} onChange={e => setExtendDays(e.target.value)} placeholder="e.g. 3" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setExtendModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleExtend} className="btn-primary">Extend Deadline</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reassign Modal */}
      <Modal isOpen={!!reassignModal} onClose={() => setReassignModal(null)} title="Reassign File" size="sm">
        {reassignModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">File: <strong>{reassignModal.fileName}</strong></p>
            <p className="text-sm text-gray-600">Current vendor: <strong>{reassignModal.vendorName}</strong></p>
            <div>
              <label className="label">Reassign to Vendor</label>
              <select className="select-field" value={reassignVendor} onChange={e => setReassignVendor(e.target.value)}>
                <option value="">-- Select new vendor --</option>
                {vendors.filter(v => v.status === 'Active' && v.id !== reassignModal.vendorId).map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setReassignModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleReassign} className="btn-primary">Reassign</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Takeback Modal */}
      <Modal isOpen={!!takebackModal} onClose={() => setTakebackModal(null)} title="Take File Back" size="sm">
        {takebackModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">File: <strong>{takebackModal.fileName}</strong></p>
            <div>
              <label className="label">Reason for taking back *</label>
              <textarea className="input-field resize-none" rows={3} value={takebackReason} onChange={e => setTakebackReason(e.target.value)} placeholder="Provide a reason..." />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setTakebackModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleTakeback} className="btn-danger">Take Back File</button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
