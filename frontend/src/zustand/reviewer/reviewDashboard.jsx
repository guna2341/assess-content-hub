import { create } from 'zustand';

export const useReviewerDashboardStore = create((set) => ({
  stats: [
    {
      title: 'Pending Reviews',
      value: '8',
      change: '2 urgent',
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Completed Today',
      value: '12',
      change: '+4 from yesterday',
      icon: 'CheckSquare',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Questions Flagged',
      value: '3',
      change: 'Need attention',
      icon: 'AlertTriangle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Comments Made',
      value: '25',
      change: 'This week',
      icon: 'MessageSquare',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ],

  pendingQuestions: [
    {
      id: 1,
      question: 'What is the square root of 144?',
      unit: 'Mathematics Fundamentals',
      type: 'MCQ',
      submittedBy: 'Content Creator A',
      priority: 'high',
      submittedAt: '2 hours ago',
      reviewsCompleted: 1,
      reviewsNeeded: 3,
    },
    {
      id: 2,
      question: 'Explain the water cycle in detail.',
      unit: 'Environmental Science',
      type: 'Long Answer',
      submittedBy: 'Content Creator B',
      priority: 'medium',
      submittedAt: '4 hours ago',
      reviewsCompleted: 0,
      reviewsNeeded: 3,
    },
    {
      id: 3,
      question: 'Match the following chemical elements with their symbols.',
      unit: 'Chemistry Basics',
      type: 'Match Following',
      submittedBy: 'Admin User',
      priority: 'low',
      submittedAt: '1 day ago',
      reviewsCompleted: 2,
      reviewsNeeded: 3,
    },
  ],

  // Actions
  updateStats: (newStats) => set({ stats: newStats }),
  
  addPendingQuestion: (question) => 
    set((state) => ({
      pendingQuestions: [question, ...state.pendingQuestions]
    })),
  
  removePendingQuestion: (questionId) =>
    set((state) => ({
      pendingQuestions: state.pendingQuestions.filter(q => q.id !== questionId)
    })),
  
  updateQuestionStatus: (questionId, status) =>
    set((state) => ({
      pendingQuestions: state.pendingQuestions.map(q =>
        q.id === questionId ? { ...q, status } : q
      )
    })),
  
  incrementReviewsCompleted: (questionId) =>
    set((state) => ({
      pendingQuestions: state.pendingQuestions.map(q =>
        q.id === questionId 
          ? { ...q, reviewsCompleted: q.reviewsCompleted + 1 }
          : q
      )
    })),
  
  // Helper functions
  getPriorityColor: (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  },
  
  getQuestionTypeColor: (type) => {
    switch (type) {
      case 'MCQ': return 'bg-primary/10 text-primary';
      case 'Long Answer': return 'bg-secondary/10 text-secondary';
      case 'Match Following': return 'bg-accent/10 text-accent';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  }
}));