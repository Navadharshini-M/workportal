import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import FilePoolPage from './pages/FilePoolPage';
import AllocateWorkPage from './pages/AllocateWorkPage';
import RequestsPage from './pages/RequestsPage';
import QCOverviewPage from './pages/QCOverviewPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/file-pool" element={<FilePoolPage />} />
        <Route path="/allocate-work" element={<AllocateWorkPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/qc-overview" element={<QCOverviewPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
