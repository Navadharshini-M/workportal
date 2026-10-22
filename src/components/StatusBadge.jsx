// Status badge component for file and payment statuses
const statusConfig = {
  // File statuses
  'Allocated': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-indigo-100 text-indigo-700',
  'Submitted': 'bg-purple-100 text-purple-700',
  'In QC': 'bg-yellow-100 text-yellow-700',
  'Rework': 'bg-orange-100 text-orange-700',
  'Approved': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Overdue': 'bg-red-600 text-white',
  // Payment statuses
  'Not Eligible': 'bg-gray-100 text-gray-500',
  'Pending': 'bg-amber-100 text-amber-700',
  'Processing': 'bg-blue-100 text-blue-700',
  'Paid': 'bg-green-100 text-green-700',
  'On Hold': 'bg-gray-200 text-gray-600',
  // Request statuses
  'Approved Full': 'bg-green-100 text-green-700',
  'Approved Partial': 'bg-teal-100 text-teal-700',
  'Available': 'bg-sky-100 text-sky-700',
  // Vendor statuses
  'Active': 'bg-green-100 text-green-700',
  'Inactive': 'bg-gray-100 text-gray-500',
};

export default function StatusBadge({ status }) {
  const classes = statusConfig[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}
