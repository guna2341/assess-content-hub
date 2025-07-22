import { useAuthStore } from '@/stores/authStore';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { ReviewerDashboard } from '@/components/dashboard/ReviewerDashboard';

export function DashboardPage() {
  const { user } = useAuthStore();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'reviewer':
        return <ReviewerDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return renderDashboard();
}