import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { reportData } from '../data/dummyData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { Download } from 'lucide-react';

const tabs = ['Vendor Productivity', 'On-Time Delivery', 'QC Error Rate', 'Rework Rate', 'Payment Summary'];

function exportTableCSV(headers, rows, filename) {
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Vendor Productivity');
  const { vendorProductivity, monthlyTrend } = reportData;

  const onTimeData = vendorProductivity.map(v => ({
    vendor: v.vendor.split(' ')[0],
    'On-Time %': Math.round((v.onTime / v.allocated) * 100),
    'Late %': Math.round(((v.allocated - v.onTime) / v.allocated) * 100),
  }));

  const qcErrorData = vendorProductivity.map(v => ({
    vendor: v.vendor.split(' ')[0],
    'QC Error Rate %': Math.round((v.rejected / v.submitted) * 100),
    'Rework Rate %': Math.round((v.rework / v.submitted) * 100),
  }));

  const paymentSummary = [
    { vendor: 'Ravi Kumar Associates', period: 'Oct 2026', files: 12, rate: 45, amount: 540, status: 'Pending' },
    { vendor: 'Priya Data Solutions', period: 'Oct 2026', files: 8, rate: 50, amount: 400, status: 'Paid' },
    { vendor: 'TechVision Partners', period: 'Oct 2026', files: 5, rate: 40, amount: 200, status: 'Processing' },
    { vendor: 'NextGen Data Hub', period: 'Sep 2026', files: 18, rate: 48, amount: 864, status: 'Paid' },
    { vendor: 'TechVision Partners', period: 'Sep 2026', files: 30, rate: 40, amount: 1200, status: 'Paid' },
    { vendor: 'Ravi Kumar Associates', period: 'Sep 2026', files: 22, rate: 45, amount: 990, status: 'On Hold' },
  ];

  return (
    <AdminLayout pageTitle="Reports">
      <div className="space-y-5">
        <p className="text-sm text-gray-500">Reports based on vendor productivity, delivery, QC and payment data.</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
                ${activeTab === tab ? 'bg-primary text-white border-primary' : 'bg-white text-brand-text border-brand-border hover:border-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Vendor Productivity */}
        {activeTab === 'Vendor Productivity' && (
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Vendor-wise Productivity</h2>
                <button
                  onClick={() => exportTableCSV(
                    ['Vendor', 'Allocated', 'Submitted', 'Approved', 'Rejected', 'Rework'],
                    vendorProductivity.map(v => [v.vendor, v.allocated, v.submitted, v.approved, v.rejected, v.rework]),
                    'vendor_productivity.csv'
                  )}
                  className="btn-secondary flex items-center gap-2 text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={vendorProductivity} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E1E9" vertical={false} />
                  <XAxis dataKey="vendor" tick={{ fontSize: 10, fill: '#8a9bad' }} tickFormatter={v => v.split(' ')[0]} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #D4E1E9', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="allocated" name="Allocated" fill="#006CAA" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="submitted" name="Submitted" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#22c55e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-bg">
                    <tr>
                      <th className="table-header">Vendor</th>
                      <th className="table-header text-center">Allocated</th>
                      <th className="table-header text-center">Submitted</th>
                      <th className="table-header text-center">Approved</th>
                      <th className="table-header text-center">Rejected</th>
                      <th className="table-header text-center">Rework</th>
                      <th className="table-header text-center">Completion %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {vendorProductivity.map(v => (
                      <tr key={v.vendor} className="hover:bg-brand-bg">
                        <td className="table-cell font-medium">{v.vendor}</td>
                        <td className="table-cell text-center">{v.allocated}</td>
                        <td className="table-cell text-center">{v.submitted}</td>
                        <td className="table-cell text-center text-green-600 font-semibold">{v.approved}</td>
                        <td className="table-cell text-center text-red-500">{v.rejected}</td>
                        <td className="table-cell text-center text-orange-500">{v.rework}</td>
                        <td className="table-cell text-center">
                          <span className="font-semibold text-primary">{Math.round((v.approved / v.allocated) * 100)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* On-Time Delivery */}
        {activeTab === 'On-Time Delivery' && (
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">On-Time Delivery %</h2>
                <button onClick={() => exportTableCSV(['Vendor', 'On-Time %', 'Late %'], onTimeData.map(v => [v.vendor, v['On-Time %'], v['Late %']]), 'ontime_delivery.csv')} className="btn-secondary flex items-center gap-2 text-xs">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={onTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E1E9" vertical={false} />
                  <XAxis dataKey="vendor" tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #D4E1E9', fontSize: 12 }} formatter={v => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="On-Time %" fill="#22c55e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Late %" fill="#f97316" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <h2 className="section-title mb-4">Monthly Trend</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E1E9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #D4E1E9', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="allocated" stroke="#006CAA" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* QC Error Rate */}
        {activeTab === 'QC Error Rate' && (
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">QC Error Rate by Vendor</h2>
                <button onClick={() => exportTableCSV(['Vendor', 'QC Error Rate %', 'Rework Rate %'], qcErrorData.map(v => [v.vendor, v['QC Error Rate %'], v['Rework Rate %']]), 'qc_error_rate.csv')} className="btn-secondary flex items-center gap-2 text-xs">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={qcErrorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E1E9" vertical={false} />
                  <XAxis dataKey="vendor" tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8a9bad' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #D4E1E9', fontSize: 12 }} formatter={v => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="QC Error Rate %" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Rework Rate %" fill="#f97316" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Rework Rate */}
        {activeTab === 'Rework Rate' && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Rework Rate Analysis</h2>
              <button onClick={() => exportTableCSV(['Vendor', 'Submitted', 'Rework', 'Rework Rate %'], vendorProductivity.map(v => [v.vendor, v.submitted, v.rework, Math.round((v.rework / v.submitted) * 100)]), 'rework_rate.csv')} className="btn-secondary flex items-center gap-2 text-xs">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-bg">
                  <tr>
                    <th className="table-header">Vendor</th>
                    <th className="table-header text-center">Files Submitted</th>
                    <th className="table-header text-center">Rework Count</th>
                    <th className="table-header text-center">Rework Rate %</th>
                    <th className="table-header">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {vendorProductivity.map(v => {
                    const rate = Math.round((v.rework / v.submitted) * 100);
                    return (
                      <tr key={v.vendor} className="hover:bg-brand-bg">
                        <td className="table-cell font-medium">{v.vendor}</td>
                        <td className="table-cell text-center">{v.submitted}</td>
                        <td className="table-cell text-center text-orange-500 font-semibold">{v.rework}</td>
                        <td className="table-cell text-center">
                          <span className={`font-bold ${rate > 10 ? 'text-red-600' : rate > 5 ? 'text-orange-500' : 'text-green-600'}`}>
                            {rate}%
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${rate > 10 ? 'bg-red-100 text-red-700' : rate > 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {rate > 10 ? 'High Rework' : rate > 5 ? 'Moderate' : 'Good'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {activeTab === 'Payment Summary' && (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="section-title">Payment Summary</h2>
              <button onClick={() => exportTableCSV(['Vendor', 'Period', 'Files', 'Rate', 'Amount', 'Status'], paymentSummary.map(p => [p.vendor, p.period, p.files, p.rate, p.amount, p.status]), 'payment_summary.csv')} className="btn-secondary flex items-center gap-2 text-xs">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-bg">
                  <tr>
                    <th className="table-header">Vendor</th>
                    <th className="table-header">Period</th>
                    <th className="table-header text-center">Files</th>
                    <th className="table-header text-center">Rate/File</th>
                    <th className="table-header text-center">Amount</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {paymentSummary.map((p, i) => (
                    <tr key={i} className="hover:bg-brand-bg">
                      <td className="table-cell font-medium">{p.vendor}</td>
                      <td className="table-cell text-sm">{p.period}</td>
                      <td className="table-cell text-center font-semibold">{p.files}</td>
                      <td className="table-cell text-center text-sm">₹{p.rate}</td>
                      <td className="table-cell text-center font-bold text-primary">₹{p.amount.toLocaleString()}</td>
                      <td className="table-cell">
                        <span className={`badge ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : p.status === 'Pending' ? 'bg-amber-100 text-amber-700' : p.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-brand-bg font-semibold">
                    <td className="table-cell" colSpan={4}>Total</td>
                    <td className="table-cell text-center font-bold text-primary text-base">
                      ₹{paymentSummary.reduce((s, p) => s + p.amount, 0).toLocaleString()}
                    </td>
                    <td className="table-cell"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
