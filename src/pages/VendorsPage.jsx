import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';
import ConfirmDialog from '../components/ConfirmDialog';
import { vendors as initialVendors } from '../data/dummyData';
import { Plus, Edit2, Trash2, Phone, Mail, DollarSign, FileText } from 'lucide-react';

const emptyForm = {
  name: '',
  contact: '',
  phone: '',
  ratePerFile: '',
  paymentTerms: 'Monthly',
  status: 'Active',
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.contact.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditVendor(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditVendor(v);
    setForm({ name: v.name, contact: v.contact, phone: v.phone, ratePerFile: v.ratePerFile, paymentTerms: v.paymentTerms, status: v.status });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.contact.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)) errs.contact = 'Valid email required.';
    if (!form.ratePerFile || isNaN(form.ratePerFile) || Number(form.ratePerFile) <= 0) errs.ratePerFile = 'Valid rate required.';
    return errs;
  };

  const handleSave = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    if (editVendor) {
      setVendors(vendors.map(v => v.id === editVendor.id ? { ...v, ...form, ratePerFile: Number(form.ratePerFile) } : v));
      showToast('Vendor updated successfully.');
    } else {
      const newVendor = {
        id: `V${String(vendors.length + 1).padStart(3, '0')}`,
        ...form,
        ratePerFile: Number(form.ratePerFile),
        filesCompleted: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setVendors([...vendors, newVendor]);
      showToast('Vendor added successfully.');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
    showToast('Vendor removed.');
  };

  return (
    <AdminLayout pageTitle="Vendors">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="space-y-5">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <p className="text-sm text-gray-500">Manage sub-vendors and partner teams.</p>
          </div>
          <button id="add-vendor-btn" onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>

        {/* Search / Filter */}
        <div className="card p-4">
          <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, email or ID...">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="select-field sm:w-36"
            >
              <option value="All">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </SearchFilter>
        </div>

        {/* Vendor Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header">Vendor ID</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Rate/File</th>
                  <th className="table-header">Payment Terms</th>
                  <th className="table-header">Files Done</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      No vendors found.
                    </td>
                  </tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className="hover:bg-brand-bg transition-colors">
                    <td className="table-cell font-mono text-xs text-primary">{v.id}</td>
                    <td className="table-cell">
                      <div className="font-medium text-brand-text">{v.name}</div>
                      <div className="text-xs text-gray-400">Since {v.joinedDate}</div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" /> {v.contact}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone className="w-3 h-3" /> {v.phone}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-sm font-semibold text-brand-text">
                        <DollarSign className="w-3.5 h-3.5 text-green-500" />
                        ₹{v.ratePerFile}
                      </div>
                    </td>
                    <td className="table-cell text-sm">{v.paymentTerms}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        {v.filesCompleted}
                      </div>
                    </td>
                    <td className="table-cell"><StatusBadge status={v.status} /></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="p-1.5 text-primary hover:bg-primary-light rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(v.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-brand-border text-xs text-gray-400">
            Showing {filtered.length} of {vendors.length} vendors
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editVendor ? 'Edit Vendor' : 'Add New Vendor'}>
        <div className="space-y-4">
          <div>
            <label className="label">Vendor Name *</label>
            <input className={`input-field ${formErrors.name ? 'border-red-400' : ''}`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter vendor/company name" />
            {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input className={`input-field ${formErrors.contact ? 'border-red-400' : ''}`} type="email" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="vendor@example.com" />
            {formErrors.contact && <p className="text-xs text-red-500 mt-1">{formErrors.contact}</p>}
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Rate per File (₹) *</label>
              <input className={`input-field ${formErrors.ratePerFile ? 'border-red-400' : ''}`} type="number" value={form.ratePerFile} onChange={e => setForm({ ...form, ratePerFile: e.target.value })} placeholder="e.g. 45" />
              {formErrors.ratePerFile && <p className="text-xs text-red-500 mt-1">{formErrors.ratePerFile}</p>}
            </div>
            <div>
              <label className="label">Payment Terms</label>
              <select className="select-field" value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })}>
                <option>Weekly</option>
                <option>Fortnightly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="select-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button id="save-vendor-btn" onClick={handleSave} className="btn-primary">{editVendor ? 'Update Vendor' : 'Add Vendor'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { handleDelete(deleteConfirm); setDeleteConfirm(null); }}
        title="Remove Vendor"
        message="Are you sure you want to remove this vendor? This action cannot be undone."
        confirmText="Remove"
        confirmClass="btn-danger"
      />
    </AdminLayout>
  );
}
