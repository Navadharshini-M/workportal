import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import {
  Users, FolderOpen, ClipboardList, MessageSquare, AlertTriangle, CheckSquare,
  TrendingUp, TrendingDown, Clock, ArrowUpRight
} from 'lucide-react';
import { dashboardStats, allocations, workRequests, filePool } from '../data/dummyData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const statCards = [
  { label: 'Total Vendors', value: dashboardStats.totalVendors, icon: Users, color: 'bg-blue-50 text-primary', trend: '+1 this month' },
  { label: 'Available Files', value: dashboardStats.availableFiles, icon: FolderOpen, color: 'bg-sky-50 text-sky-600', trend: '8 ready to allocate' },
  { label: 'Allocated Files', value: dashboardStats.allocatedFiles, icon: ClipboardList, color: 'bg-indigo-50 text-indigo-600', trend: 'Across 6 vendors' },
  { label: 'Pending Requests', value: dashboardStats.pendingRequests, icon: MessageSquare, color: 'bg-amber-50 text-amber-600', trend: 'Needs review' },
  { label: 'Overdue Files', value: dashboardStats.overdueFiles, icon: AlertTriangle, color: 'bg-red-50 text-red-600', trend: 'Immediate action' },
  { label: 'QC Pending', value: dashboardStats.qcPending, icon: CheckSquare, color: 'bg-purple-50 text-purple-600', trend: 'Awaiting review' },
];

const statusDistribution = [
  { name: 'Allocated', value: 2, color: '#3b82f6' },
  { name: 'In Progress', value: 3, color: '#6366f1' },
  { name: 'Submitted', value: 1, color: '#a855f7' },
  { name: 'In QC', value: 2, color: '#eab308' },
  { name: 'Approved', value: 2, color: '#22c55e' },
  { name: 'Rework', value: 1, color: '#f97316' },
  { name: 'Overdue', value: 1, color: '#ef4444' },
];

const weeklyActivity = [
  { day: 'Mon', allocated: 4, completed: 3 },
  { day: 'Tue', allocated: 6, completed: 5 },
  { day: 'Wed', allocated: 3, completed: 4 },
  { day: 'Thu', allocated: 7, completed: 6 },
  { day: 'Fri', allocated: 5, completed: 3 },
  { day: 'Sat', allocated: 2, completed: 2 },
  { day: 'Sun', allocated: 0, completed: 1 },
];

export default function DashboardPage() {
  const recentAllocations = allocations.slice(0, 6);
  const pendingRequests = workRequests.filter(r => r.status === 'Pending').slice(0, 4);

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="card p-4">
                <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-brand-text">{card.value}</div>
                <div className="text-sm font-medium text-brand-text mt-0.5">{card.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{card.trend}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="card p-5">
            <h2 className="section-title mb-4">Weekly File Activity</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4E1E9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8a9bad' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #D4E1E9', fontSize: 12 }}
                />
                <Bar dataKey="allocated" name="Allocated" fill="#006CAA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-primary inline-block" />Allocated</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />Completed</span>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="card p-5">
            <h2 className="section-title mb-4">File Status Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #D4E1E9', fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Allocations */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="section-title">Recent Allocations</h2>
            <a href="/allocate-work" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg">
                <tr>
                  <th className="table-header">File</th>
                  <th className="table-header">Project</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">Deadline</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {recentAllocations.map((a) => (
                  <tr key={a.id} className={`hover:bg-brand-bg transition-colors ${a.status === 'Overdue' ? 'bg-red-50' : ''}`}>
                    <td className="table-cell">
                      <div className="font-medium text-brand-text text-xs">{a.fileName}</div>
                      <div className="text-gray-400 text-xs">{a.id}</div>
                    </td>
                    <td className="table-cell text-xs">{a.project}</td>
                    <td className="table-cell text-xs">{a.vendorName}</td>
                    <td className="table-cell">
                      <div className="text-xs">{a.deadline}</div>
                      {a.daysRemaining < 0 ? (
                        <div className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                          <TrendingDown className="w-3 h-3" /> {Math.abs(a.daysRemaining)}d overdue
                        </div>
                      ) : a.daysRemaining === 0 ? (
                        <div className="text-xs text-amber-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> Due today
                        </div>
                      ) : (
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                          <TrendingUp className="w-3 h-3" /> {a.daysRemaining}d left
                        </div>
                      )}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="section-title">Pending Work Requests</h2>
            <a href="/requests" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No pending requests.</div>
          ) : (
            <div className="divide-y divide-brand-border">
              {pendingRequests.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brand-text">{r.vendorName}</div>
                    <div className="text-xs text-gray-400">
                      Requested {r.filesRequested} files • {r.project} • {r.requestDate}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
