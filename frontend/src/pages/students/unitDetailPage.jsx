import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  Play,
  ChevronRight,
  Bookmark,
  CheckCircle,
  Award,
  BarChart2,
  List,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UnitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - in a real app, this would come from an API
  const unit = {
    id: id,
    title: 'Mathematics Fundamentals',
    description: 'Master basic arithmetic and number systems through interactive lessons and practice problems.',
    category: 'Math',
    progress: 65,
    totalLessons: 8,
    completedLessons: 5,
    difficulty: 'Beginner',
    estimatedTime: '2 hours',
    lastAccessed: '2 days ago',
    isBookmarked: true,
    objectives: [
      'Understand basic arithmetic operations',
      'Learn number systems and place value',
      'Solve word problems with confidence',
      'Apply math skills to real-world situations'
    ],
    lessons: [
      { id: 1, title: 'Introduction to Numbers', duration: '15 min', completed: true },
      { id: 2, title: 'Addition and Subtraction', duration: '20 min', completed: true },
      { id: 3, title: 'Multiplication Basics', duration: '25 min', completed: true },
      { id: 4, title: 'Division Concepts', duration: '30 min', completed: true },
      { id: 5, title: 'Word Problems', duration: '35 min', completed: true },
      { id: 6, title: 'Fractions Introduction', duration: '40 min', completed: false },
      { id: 7, title: 'Decimals', duration: '45 min', completed: false },
      { id: 8, title: 'Final Assessment', duration: '60 min', completed: false },
    ],
    resources: [
      { type: 'PDF', title: 'Study Guide', pages: 12 },
      { type: 'Video', title: 'Number Systems Explained', duration: '8 min' },
      { type: 'Quiz', title: 'Practice Problems', questions: 15 },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{unit.title}</h1>
          <p className="text-muted-foreground">{unit.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unit Progress */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{unit.category}</Badge>
                  <Badge variant={unit.difficulty === 'Beginner' ? 'success' : 'warning'}>
                    {unit.difficulty}
                  </Badge>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {unit.estimatedTime}
                  </span>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className={`h-5 w-5 ${unit.isBookmarked ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {unit.completedLessons} of {unit.totalLessons} lessons completed
                  </span>
                  <span className="text-sm font-medium">{unit.progress}%</span>
                </div>
                <Progress value={unit.progress} className="h-2" />
              </div>

              <Button className="w-full" onClick={() => navigate(`/learn/${unit.id}/lesson/${unit.lessons.find(l => !l.completed)?.id || unit.lessons[0].id}`)}>
                <Play className="h-4 w-4 mr-2" />
                {unit.progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </Button>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {unit.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                Lessons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {unit.lessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${lesson.completed ? 'bg-success/10 border-success/20' : 'hover:bg-muted/50'}`}
                  onClick={() => navigate(`/learn/${unit.id}/lesson/${lesson.id}`)}
                >
                  <div className="flex items-center gap-3">
                    {lesson.completed ? (
                      <div className="bg-success/10 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                    ) : (
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unit.resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    {resource.type === 'PDF' && <BookOpen className="h-5 w-5 text-primary" />}
                    {resource.type === 'Video' && <Play className="h-5 w-5 text-primary" />}
                    {resource.type === 'Quiz' && <BarChart2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.type} • {resource.pages ? `${resource.pages} pages` : resource.duration}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Math Explorer</h3>
                  <p className="text-sm text-muted-foreground">Complete 5 math units</p>
                  <Progress value={40} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">2 of 5 units completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <BarChart2 className="h-4 w-4 mr-2" />
                View Progress Report
              </Button>
              <Button variant="outline" className="w-full">
                <Lightbulb className="h-4 w-4 mr-2" />
                Take Practice Quiz
              </Button>
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Download Study Materials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}