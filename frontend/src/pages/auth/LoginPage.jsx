
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Mail, Lock, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState ('student');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role,
      };

      login(mockUser, 'mock-token-123');

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${role}`,
      });

      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  const quickLogin = (userRole) => {
    const users = {
      admin: { email: 'admin@contenthub.com', name: 'Admin' },
      student: { email: 'student@contenthub.com', name: 'Student' },
      reviewer: { email: 'reviewer@contenthub.com', name: 'Reviewer' },
    };
    console.log(userRole);
    
    const user = users[userRole];
    login({ id: '1', ...user, role: userRole }, 'mock-token-123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 top-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern"></div>
      </div>
      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-white/80">Educational Content & Assessment Platform</p>
        </div>

        <Card className="bg-white/95 backdrop-blur border-0 shadow-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Quick Demo Login</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => quickLogin('admin')}>
                <UserCheck className="h-3 w-3 mr-1" />
                Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin('reviewer')}>
                <UserCheck className="h-3 w-3 mr-1" />
                Reviewer
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin('student')}>
                <UserCheck className="h-3 w-3 mr-1" />
                Student
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
