import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/stores/authStore';

export function MainLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex w-full bg-background">
      <div>
        <Sidebar />
      </div>
      <div className="flex w-full flex-col mb-2 scrollbar-none">
        <Header />
        <main className="p-6 scrollbar-none overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}