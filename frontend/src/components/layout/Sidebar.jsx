import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  BarChart3,
  CheckSquare,
  PlusCircle,
  Library,
  MessageSquare,
  NotebookIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from "../../stores/authStore";

export function Sidebar() {
  const { user } = useAuthStore();
  console.log(user);
  
  const adminNavItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/content', icon: BookOpen, label: 'Content Units' },
    { to: '/content/create', icon: PlusCircle, label: 'Create Unit' },
    { to: '/questions/create', icon: FileText, label: 'Modify Questions' },
    { to: '/question-bank', icon: Library, label: 'Question Bank' },
    { to: '/learningUnits', icon: NotebookIcon, label: "Learning Units" },
    { to: "/comments", icon: MessageSquare, label: "Comments" },
    { to: '/reviews', icon: CheckSquare, label: 'Reviews' }
  ];

  const reviewerNavItems = [
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { to: "/content", icon: BookOpen, label: "Content Units" },
    { to: '/content/create', icon: PlusCircle, label: 'Create Unit' },
    { to: '/questions/create', icon: FileText, label: 'Modify Questions' },
    { to: "/question-bank", icon: Library, label: "Question Bank" },
    { to: "/comments", icon: MessageSquare, label: "Comments" },
  ];

  const studentNavItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/learn', icon: BookOpen, label: 'Learning Units' },
    { to: '/assessments', icon: FileText, label: 'Assessments' },
    { to: '/results', icon: BarChart3, label: 'My Results' },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminNavItems;
      case 'reviewer':
        return reviewerNavItems;
      case 'student':
        return studentNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-gradient-card border-r h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-gradient-primary rounded-sm flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-md font-bold bg-gradient-primary bg-clip-text text-transparent">
            Content Management
          </h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/content"} 
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}