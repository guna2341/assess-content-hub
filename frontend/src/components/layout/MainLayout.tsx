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
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col mb-2 scrollbar-none">
        <Header />
        <main className="flex-1 p-6 scrollbar-none overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}