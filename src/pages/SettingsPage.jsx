import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { settings as initialSettings } from '../data/dummyData';
import { Save, Info } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout pageTitle="Settings">
      <div className="space-y-5 max-w-2xl">
        <p className="text-sm text-gray-500">Configure allocation rules and system defaults.</p>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <Save className="w-4 h-4" /> Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Request Rules */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-brand-border pb-3">Work Request Rules</h2>

            <div>
              <label className="label">Maximum Open Requests per Vendor</label>
              <div className="flex items-start gap-3">
                <input
                  type="number"
                  min={1}
                  max={20}
                  className="input-field w-32"
                  value={settings.maxOpenRequestsPerVendor}
                  onChange={e => setSettings({ ...settings, maxOpenRequestsPerVendor: Number(e.target.value) })}
                />
                <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Vendors cannot submit a new request while they have this many open (pending or overdue) requests.</span>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Daily File Cap per Vendor</label>
              <div className="flex items-start gap-3">
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="input-field w-32"
                  value={settings.dailyCapPerVendor}
                  onChange={e => setSettings({ ...settings, dailyCapPerVendor: Number(e.target.value) })}
                />
                <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Maximum number of files that can be allocated to a single vendor in one day.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deadline Settings */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-brand-border pb-3">Deadline & Reminder Settings</h2>

            <div>
              <label className="label">Default Deadline (days)</label>
              <div className="flex items-start gap-3">
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="input-field w-32"
                  value={settings.defaultDeadlineDays}
                  onChange={e => setSettings({ ...settings, defaultDeadlineDays: Number(e.target.value) })}
                />
                <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Default deadline in days when allocating new files to vendors.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Reminder (hours before deadline)</label>
                <input
                  type="number"
                  min={1}
                  className="input-field"
                  value={settings.overdueReminderHours}
                  onChange={e => setSettings({ ...settings, overdueReminderHours: Number(e.target.value) })}
                />
                <p className="text-xs text-gray-400 mt-1">Standard: 24 hours</p>
              </div>
              <div>
                <label className="label">Critical Reminder (hours before deadline)</label>
                <input
                  type="number"
                  min={1}
                  className="input-field"
                  value={settings.criticalReminderHours}
                  onChange={e => setSettings({ ...settings, criticalReminderHours: Number(e.target.value) })}
                />
                <p className="text-xs text-gray-400 mt-1">Standard: 4 hours</p>
              </div>
            </div>
          </div>

          {/* Allocation Settings */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-brand-border pb-3">Allocation Settings</h2>

            <div className="flex items-center justify-between">
              <div>
                <label className="label mb-0">Auto-Allocation from File Pool</label>
                <p className="text-xs text-gray-500 mt-0.5">
                  When enabled, portal auto-picks the next available files from the pool upon request approval.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoAllocationEnabled}
                  onChange={e => setSettings({ ...settings, autoAllocationEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div>
              <label className="label">Payment Cycle</label>
              <select
                className="select-field w-48"
                value={settings.paymentCycle}
                onChange={e => setSettings({ ...settings, paymentCycle: e.target.value })}
              >
                <option>Weekly</option>
                <option>Fortnightly</option>
                <option>Monthly</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Determines how often payment processing runs.
              </p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-brand-border pb-3">Notification Settings</h2>
            <div>
              <label className="label">Admin Notification Email</label>
              <input
                type="email"
                className="input-field"
                value={settings.adminEmail}
                onChange={e => setSettings({ ...settings, adminEmail: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">
                New work requests and overdue alerts are sent to this address.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                This is a frontend prototype. Email delivery and automatic reminders are not active.
                These settings are saved locally for demonstration purposes only.
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button id="save-settings-btn" type="submit" className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
