// stores/assessment-store.js
import { create } from 'zustand';

export const useAssessmentStore = create((set) => ({
  assessments: [
    {
      id: 'math-midterm',
      title: 'Mathematics Midterm Assessment',
      subject: 'Mathematics',
      description: 'Covers algebra, geometry, and basic trigonometry concepts',
      duration: 60,
      totalQuestions: 25,
      dueDate: '2024-03-15',
      batchType: 'Summary',
      status: 'not_started',
    },
    {
      id: 'science-quiz1',
      title: 'Science Quiz - Physics Fundamentals',
      subject: 'Science',
      description: 'Basic concepts of motion, force, and energy',
      duration: 30,
      totalQuestions: 15,
      dueDate: '2024-03-10',
      batchType: 'Questions Bank',
      status: 'not_started',
    },
    {
      id: 'history-chapter2',
      title: 'History Chapter 2 Review',
      subject: 'History',
      description: 'World War II and its aftermath',
      duration: 45,
      totalQuestions: 20,
      dueDate: '2024-03-20',
      batchType: 'Summary',
      status: 'not_started',
    }
  ],

  // Actions
  addAssessment: (newAssessment) => 
    set((state) => ({
      assessments: [...state.assessments, newAssessment]
    })),

  updateAssessmentStatus: (assessmentId, newStatus) =>
    set((state) => ({
      assessments: state.assessments.map(assessment =>
        assessment.id === assessmentId
          ? { ...assessment, status: newStatus }
          : assessment
      )
    })),

  removeAssessment: (assessmentId) =>
    set((state) => ({
      assessments: state.assessments.filter(assessment => assessment.id !== assessmentId)
    })),

  fetchAssessments: async () => {
    // In a real app, you would fetch from an API here
    const mockApiResponse = [
      // Same as initial assessments or from API
    ];
    set({ assessments: mockApiResponse });
  },
}));