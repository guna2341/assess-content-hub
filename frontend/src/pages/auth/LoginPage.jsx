
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from "@/components/ui/use-toast";


export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, token } = useAuthStore();
  
  useEffect(() => { 
    if (token) {
      navigate('/dashboard');
    }
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await login({ email, password });
    console.log("login:",response);
    
    if (response?.status) {
      toast({
        title: response?.message,
        description: 'Welcome back!',
        variant: 'success',
        position:"top-center"
      });
       navigate('/dashboard');
    }
    else {
      toast({
        title: response?.message,
        description: 'Please check your credentials',
        variant: 'error'
      });
    }
    setLoading(false);
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
