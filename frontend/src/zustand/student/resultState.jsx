import { create } from 'zustand';
import { format } from 'date-fns';

export const useAssessmentResultStore = create((set) => ({
  completedAssessments: [
    {
      id: "react-summary-1",
      title: "React Fundamentals Summary",
      type: "summary",
      dateCompleted: "2023-11-10T14:30:00",
      score: 4,
      totalQuestions: 5,
      passed: true,
      details: {
        correctAnswers: 4,
        incorrectAnswers: 1,
        timeTaken: "25 minutes",
        topics: ["Components", "Props", "State", "Hooks"]
      }
    },
    {
      id: "react-bank-1",
      title: "React Question Bank",
      type: "question-bank",
      dateCompleted: "2023-11-05T16:45:00",
      score: 7,
      totalQuestions: 10,
      passed: true,
      details: {
        correctAnswers: 7,
        incorrectAnswers: 3,
        timeTaken: "42 minutes",
        topics: ["Context API", "Redux", "Performance"]
      }
    },
    {
      id: "advanced-react-1",
      title: "Advanced React Patterns",
      type: "question-bank",
      dateCompleted: "2023-10-28T11:20:00",
      score: 5,
      totalQuestions: 8,
      passed: false,
      details: {
        correctAnswers: 5,
        incorrectAnswers: 3,
        timeTaken: "35 minutes",
        topics: ["Render Props", "HOCs", "Compound Components"]
      }
    }
  ],

  // Actions
  addCompletedAssessment: (assessment) => 
    set((state) => ({
      completedAssessments: [assessment, ...state.completedAssessments]
    })),

  getAssessmentById: (id) => {
    return useAssessmentResultStore.getState().completedAssessments.find(a => a.id === id);
  },

  // Formatting helper
  formatDate: (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  },

  // Calculate percentage
  calculatePercentage: (score, total) => {
    return Math.round((score / total) * 100);
  }
}));