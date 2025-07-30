import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckSquare,
  Clock,
  MessageSquare,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Edit,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Icon mapping for dynamic icon rendering
const iconComponents = {
  CheckSquare,
  Clock,
  MessageSquare,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Edit
};
import {useReviewerDashboardStore} from '../../zustand/reviewer/reviewDashboard';

export function ReviewerDashboard() {
  const navigate = useNavigate();
  const {
    stats,
    pendingQuestions,
    getPriorityColor,
    getQuestionTypeColor,
    removePendingQuestion,
    updateQuestionStatus,
    incrementReviewsCompleted
  } = useReviewerDashboardStore();

  const handleApprove = (questionId) => {
    updateQuestionStatus(questionId, 'approved');
    incrementReviewsCompleted(questionId);
    // Additional logic for approval
  };

  const handleReject = (questionId) => {
    updateQuestionStatus(questionId, 'rejected');
    incrementReviewsCompleted(questionId);
    // Additional logic for rejection
  };

  const handleEdit = (questionId) => {
    navigate(`/questions/edit/${questionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviewer Dashboard</h1>
          <p className="text-muted-foreground">
            Review and approve questions to maintain quality standards
          </p>
        </div>
        <Button onClick={() => navigate('/reviews')}>
          <CheckSquare className="h-4 w-4 mr-2" />
          Start Reviewing
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = iconComponents[stat.icon];
          return (
            <Card key={stat.title} className="bg-gradient-card border shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Questions */}
      <Card className="bg-gradient-card border shadow-soft">
        <CardHeader>
          <CardTitle>Questions Awaiting Review</CardTitle>
          <CardDescription>
            Review questions and provide feedback to maintain quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingQuestions.map((question) => (
            <div
              key={question.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getPriorityColor(question.priority)}>
                      {question.priority} priority
                    </Badge>
                    <Badge variant="outline" className={getQuestionTypeColor(question.type)}>
                      {question.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {question.reviewsCompleted}/{question.reviewsNeeded} reviews completed
                    </span>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{question.question}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Unit: {question.unit}</span>
                    <span>•</span>
                    <span>By: {question.submittedBy}</span>
                    <span>•</span>
                    <span>{question.submittedAt}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/content/${question.id}`)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleApprove(question.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleReject(question.id)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => navigate('/reviews')}>
              View All Pending Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}