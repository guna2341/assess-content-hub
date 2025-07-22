import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  ThumbsUp,
  ThumbsDown,
  Edit,
  Flag,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ContentReviewComponent } from '../content/ContentReview';
import { useReviewStore } from '../../zustand/reviewer/reviewsState';
import { useState } from 'react';

export function ReviewsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  
  const {
    pendingQuestions,
    completedReviews,
    reviewComments,
    setReviewComment,
    submitReview
  } = useReviewStore();

  const handleReview = (questionId, status) => {
    const comment = reviewComments[questionId] || '';

    if (!comment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please add a comment explaining your review decision.',
        variant: 'destructive'
      });
      return;
    }

    submitReview(questionId, status);
    toast({
      title: 'Review Submitted',
      description: `Question has been ${status.replace('_', ' ')}.`
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'low':
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'MCQ':
        return 'bg-primary/10 text-primary';
      case 'Short Answer':
        return 'bg-secondary/10 text-secondary';
      case 'Long Answer':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      case 'needs_edit':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Reviews</h1>
          <p className="text-muted-foreground">
            Review and approve questions to maintain quality standards
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Reviews ({pendingQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed Reviews ({completedReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingQuestions.map((question) => (
            <Card key={question.id} className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={getTypeColor(question.type)}>
                        {question.type}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(question.priority)}>
                        {question.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {question.reviewsCompleted}/{question.reviewsNeeded} reviews
                      </Badge>
                      <Badge variant="outline">
                      {question.kind}  
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Unit: {question.unit}</span>
                      <span>•</span>
                      <span>Topic: {question.topic}</span>
                      <span>•</span>
                      <span>By: {question.submittedBy}</span>
                      <span>•</span>
                      <span>Submitted: {question.submittedAt}</span>
                    </div>
                  </div>
                </div>

                {question.type === 'MCQ' && question.options && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-3">Answer Options:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {question.options.map((option, index) => {
                        const isCorrect = question.correctAnswer === String.fromCharCode(65 + index);
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isCorrect ? 'text-success' : 'text-muted-foreground'}`}>
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span className={isCorrect ? 'text-success font-medium' : ''}>
                              {option}
                            </span>
                            {isCorrect && (
                              <Badge variant="outline" className="bg-success/10 text-success ml-auto">
                                Correct Answer
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {question.type !== 'MCQ' && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">Expected Answer:</h4>
                    <p className="text-sm">{question.correctAnswer}</p>
                  </div>
                )}

                {question.explanation && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">Explanation:</h4>
                    <p className="text-sm">{question.explanation}</p>
                  </div>
                )}

                {question.existingReviews.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Previous Reviews:</h4>
                    {question.existingReviews.map((review, index) => (
                      <div key={index} className="bg-muted/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{review.reviewer}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(review.status)}>
                              {review.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{review.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-medium">Your Review</h4>
                  <RichTextEditor
                    content={reviewComments[question.id] || ''}
                    onChange={(content) => handleCommentChange(question.id, content)}
                    placeholder="Provide detailed feedback on this question..."
                  />
                  <div className="flex items-center gap-3">
                    <Button variant="success" onClick={() => handleReview(question.id, 'approved')}>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="warning" onClick={() => handleReview(question.id, 'needs_edit')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Needs Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleReview(question.id, 'rejected')}>
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag Issue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingQuestions.length === 0 && (
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No questions are currently pending your review.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedReviews.map((review) => (
            <Card key={review.id} className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getTypeColor(review.type)}>
                        {review.type}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(review.finalStatus)}>
                        Final: {review.finalStatus.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(review.myReview)}>
                        My Review: {review.myReview.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {review.kind}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{review.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>Unit: {review.unit}</span>
                      <span>•</span>
                      <span>Reviewed: {review.reviewedAt}</span>
                    </div>
                    {review.myComment && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">My Comment:</h4>
                        <p className="text-sm">{review.myComment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}