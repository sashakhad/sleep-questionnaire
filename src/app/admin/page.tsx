import { AdminDashboardClient } from './AdminDashboardClient';

// Auth is handled by middleware - if we reach here, user is authenticated
export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
