import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, ClipboardList, MessageSquare,
  CheckSquare, CreditCard, BarChart2, Settings, LogOut, Menu, X, Bell, ChevronDown
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendors', label: 'Vendors', icon: Users },
  { to: '/file-pool', label: 'File Pool', icon: FolderOpen },
  { to: '/allocate-work', label: 'Allocate Work', icon: ClipboardList },
  { to: '/requests', label: 'Requests', icon: MessageSquare },
  { to: '/qc-overview', label: 'QC Overview', icon: CheckSquare },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, pageTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-[#005583] flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
            <img
              src="/ism-logo.png"
              alt="ISM Data Technology Logo"
              className="w-9 h-9 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-primary font-bold text-sm">ISM</span>';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight">ISM Data</div>
            <div className="text-blue-200 text-xs leading-tight">Technology</div>
          </div>
          <button
            className="ml-auto lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Label */}
        <div className="px-5 pt-4 pb-2">
          <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="nav-item nav-item-inactive w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-brand-border px-4 sm:px-6 h-16 flex items-center gap-4 sticky top-0 z-20">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-gray-500 hover:text-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="flex-1 min-w-0">
            <h1 className="page-title truncate">{pageTitle}</h1>
          </div>

          {/* Right side: notifications + profile */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                id="profile-menu-btn"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AD</span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-brand-text">Admin User</div>
                  <div className="text-xs text-gray-400">ISM Administrator</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-brand-border py-1 z-50">
                  <div className="px-3 py-2 border-b border-brand-border">
                    <p className="text-xs font-medium text-brand-text">admin@ismdatatech.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
