import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  FileText,
  Users,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  Plus,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../zustand/admin';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  const stats = useAdminStore(state => state.stats);
  const recentActivities = useAdminStore(state => state.recentActivities);

  function getColor(title) {
    switch (title) {
      case "Learning Units":
        return "text-primary";
      case "Total Questions":
        return 'text-secondary';
      case "Active Students":
        return 'text-accent';
      case "Pending Reviews":
        return 'text-warning';
    };
  }

  function getIcon(title) {
    switch (title) {
      case "Learning Units":
        return BookOpen;
      case "Total Questions":
        return FileText;
      case "Active Students":
        return Users;
      case "Pending Reviews":
        return AlertCircle;
    };
  }

  function getBg(title) {
    switch (title) {
      case "Learning Units":
        return 'bg-primary/10';
      case "Total Questions":
        return 'bg-secondary/10';
      case "Active Students":
        return 'bg-accent/10';
      case "Pending Reviews":
        return 'bg-warning/10';
    };
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage content, questions, and monitor platform activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/content/create')}   >
            <Plus className="h-4 w-4 mr-2" />
            Create Unit
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = getIcon(stat.title);
          const color = getColor(stat.title);
          const bgColor = getBg(stat.title);
         return  (
            <Card key={stat.title} className="bg-gradient-card border-0 shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => navigate('/content/create')}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Create Learning Unit</div>
                  <div className="text-sm text-muted-foreground">
                    Add new content with questions
                  </div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => navigate('/reviews')}
            >
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <CheckSquare className="h-4 w-4 text-warning" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Review Questions</div>
                  <div className="text-sm text-muted-foreground">
                    7 questions pending approval
                  </div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => navigate('/question-bank')}
            >
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Manage QuestionBank</div>
                  <div className="text-sm text-muted-foreground">
                  Create and add questions
                  </div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4">
              <Eye className="h-4 w-4 mr-2" />
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}