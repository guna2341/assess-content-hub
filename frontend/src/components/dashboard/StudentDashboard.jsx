import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  Play,
  CheckCircle,
  TrendingUp,
  FileText,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentDashboardStore } from '../../zustand/student/studentDashboard';

const iconComponents = {
  CheckCircle,
  Trophy,
  Clock,
  Target,
  FileText,
  AlertCircle,
  Calendar,
  TrendingUp,
  BookOpen,
  Play,
};

export function StudentDashboard() {
  const navigate = useNavigate();
  const {
    stats,
    upcomingAssessments,
    recentResults,
    updatePreparation
  } = useStudentDashboardStore();

  const handleStartPreparation = (assessment) => {
    // Update preparation progress
    const newPrep = Math.min(assessment.preparation + 10, 100);
    updatePreparation(assessment.id, newPrep);
    
    // Navigate to materials page with course info
    navigate('/learn', {
      state: {
        course: assessment.course,
        type: 'lecture', // Default to lecture materials
        assessmentId: assessment.id
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Dashboard</h1>
          <p className="text-muted-foreground">
            Track your assessment progress and upcoming evaluations
          </p>
        </div>
        <Button onClick={() => navigate('/assessments')}>
          <FileText className="h-4 w-4 mr-2" />
          View All Assessments
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {stats.map((stat) => {
          const IconComponent = iconComponents[stat.icon];
          return (
            <Card key={stat.title} className="bg-gradient-card border border-custom-100 shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.total && (
                  <div className="mt-2">
                    <Progress value={stat.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.value} of {stat.total} completed
                    </p>
                  </div>
                )}
                {stat.description && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Assessments */}
        <Card className="lg:col-span-2 bg-gradient-card border shadow-soft border-custom-100">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Prepare for your next evaluations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{assessment.title}</h3>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {assessment.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {assessment.course}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {assessment.dueDate}
                    </span>
                    <span>•</span>
                    <span>Duration: {assessment.duration}</span>
                    <span>•</span>
                    <span>Status: {assessment.status}</span>
                  </div>
                  {assessment.preparation > 0 && (
                    <div className="mt-2">
                      <Progress value={assessment.preparation} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {assessment.preparation}% prepared
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant={assessment.preparation > 0 ? "default" : "outline"}
                  onClick={() => handleStartPreparation(assessment)}
                >
                  {assessment.preparation > 0 ? 'Continue Prep' : 'Start Prep'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="bg-gradient-card border border-custom-100 shadow-soft">
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Your latest assessment performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{result.assessment}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{result.type}</span>
                    <span>•</span>
                    <span>{result.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    result.score >= 90 ? 'text-success' :
                    result.score >= 80 ? 'text-accent' :
                    result.score >= 70 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {result.score}%
                  </div>
                  {result.score < 70 && (
                    <div className="text-xs text-muted-foreground flex items-center justify-end mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Needs review
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}