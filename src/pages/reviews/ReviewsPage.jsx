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
import { QuestionReviewComponent } from '../question-bank/QuestionReview';

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
    <QuestionReviewComponent/>
    </div>
  );
}