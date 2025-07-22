import { create } from 'zustand';

export const useReviewStore = create((set) => ({
  reviewComments: {},
  pendingQuestions: [
    {
      id: '1',
      question: 'What is the chemical formula for water?',
      type: 'MCQ',
      kind: "passage",
      unit: 'Chemistry Basics',
      topic: 'Molecular Formulas',
      options: ['H2O', 'CO2', 'NaCl', 'CH4'],
      correctAnswer: 'A',
      explanation: 'Water consists of two hydrogen atoms and one oxygen atom.',
      submittedBy: 'Content Creator A',
      submittedAt: '2024-01-20',
      priority: 'medium',
      reviewsCompleted: 1,
      reviewsNeeded: 3,
      existingReviews: [
        {
          reviewer: 'Reviewer B',
          status: 'approved',
          comment: 'Clear and accurate question.',
          timestamp: '2024-01-21'
        }
      ]
    },
    {
      id: '2',
      question: 'Explain the process of photosynthesis in detail.',
      type: 'Long Answer',
      kind: "question bank",
      unit: 'Biology Fundamentals',
      topic: 'Plant Biology',
      correctAnswer:
        'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen...',
      explanation:
        'This process occurs in chloroplasts and involves light-dependent and light-independent reactions.',
      submittedBy: 'Dr. Smith',
      submittedAt: '2024-01-19',
      priority: 'high',
      reviewsCompleted: 0,
      reviewsNeeded: 3,
      existingReviews: []
    },
    {
      id: '3',
      question: 'Solve: ∫(2x + 3)dx',
      type: 'Short Answer',
      kind: "question bank",
      unit: 'Advanced Mathematics',
      topic: 'Calculus',
      correctAnswer: 'x² + 3x + C',
      explanation:
        'Using the power rule of integration: ∫2x dx = x² and ∫3 dx = 3x',
      submittedBy: 'Prof. Johnson',
      submittedAt: '2024-01-18',
      priority: 'low',
      reviewsCompleted: 2,
      reviewsNeeded: 3,
      existingReviews: [
        {
          reviewer: 'Reviewer A',
          status: 'approved',
          comment: 'Mathematical notation is correct.',
          timestamp: '2024-01-19'
        },
        {
          reviewer: 'Reviewer C',
          status: 'needs_edit',
          comment: 'Consider adding step-by-step solution.',
          timestamp: '2024-01-20'
        }
      ]
    }
  ],
  completedReviews: [
    {
      id: '4',
      question: 'What is the capital of France?',
      type: 'MCQ',
      kind: "passage",
      unit: 'World Geography',
      reviewedAt: '2024-01-15',
      finalStatus: 'approved',
      myReview: 'approved',
      myComment: 'Straightforward geography question.'
    },
    {
      id: '5',
      question: 'Describe the causes of World War I.',
      type: 'Long Answer',
      kind: "question bank",
      unit: 'Modern History',
      reviewedAt: '2024-01-12',
      finalStatus: 'needs_revision',
      myReview: 'needs_edit',
      myComment: 'Question needs more specific focus. Too broad as written.'
    }
  ],
  setReviewComment: (questionId, comment) => 
    set((state) => ({
      reviewComments: { ...state.reviewComments, [questionId]: comment }
    })),
  submitReview: (questionId, status) => {
    set((state) => {
      const comment = state.reviewComments[questionId] || '';
      if (!comment.trim()) return state;
      
      const updatedPending = state.pendingQuestions.filter(q => q.id !== questionId);
      const reviewedQuestion = state.pendingQuestions.find(q => q.id === questionId);
      
      if (!reviewedQuestion) return state;
      
      const newCompleted = {
        ...reviewedQuestion,
        reviewedAt: new Date().toISOString().split('T')[0],
        finalStatus: 'pending',
        myReview: status,
        myComment: comment
      };
      
      return {
        pendingQuestions: updatedPending,
        completedReviews: [...state.completedReviews, newCompleted],
        reviewComments: { ...state.reviewComments, [questionId]: '' }
      };
    });
  }
}));