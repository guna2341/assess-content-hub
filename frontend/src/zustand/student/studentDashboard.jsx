import { create } from 'zustand';

export const useStudentDashboardStore = create((set) => ({
  // Stats data
  stats: [
    {
      title: 'Assessments Completed',
      value: '5',
      total: '12',
      percentage: 42,
      icon: 'CheckCircle',
      color: 'text-success',
    },
    {
      title: 'Average Score',
      value: '78%',
      description: '+3% from last month',
      icon: 'Trophy',
      color: 'text-accent',
    },
    {
      title: 'Highest Score',
      value: '94%',
      description: 'Algebra Midterm',
      icon: 'Target',
      color: 'text-secondary',
    },
  ],

  // Upcoming assessments
  upcomingAssessments: [
    {
      id: 1,
      title: 'Mathematics Midterm',
      type: 'Exam',
      course: 'Mathematics',
      dueDate: '2023-11-15',
      duration: '90 min',
      status: 'Not Started',
      preparation: 30,
    },
    {
      id: 2,
      title: 'English Essay',
      type: 'Assignment',
      course: 'English Literature',
      dueDate: '2023-11-20',
      duration: 'Take-home',
      status: 'In Progress',
      preparation: 65,
    },
    {
      id: 3,
      title: 'Science Quiz',
      type: 'Quiz',
      course: 'Biology',
      dueDate: '2023-11-10',
      duration: '30 min',
      status: 'Not Started',
      preparation: 0,
    },
  ],

  // Recent results
  recentResults: [
    { 
      assessment: 'Algebra Quiz', 
      score: 88, 
      date: '3 days ago', 
      type: 'Quiz' 
    },
    { 
      assessment: 'Literature Analysis', 
      score: 76, 
      date: '1 week ago', 
      type: 'Assignment' 
    },
    { 
      assessment: 'Chemistry Test', 
      score: 82, 
      date: '2 weeks ago', 
      type: 'Test' 
    },
  ],

  // Actions
  updatePreparation: (assessmentId, newPreparation) => 
    set((state) => ({
      upcomingAssessments: state.upcomingAssessments.map(assessment => 
        assessment.id === assessmentId 
          ? { ...assessment, preparation: newPreparation } 
          : assessment
      )
    })),

  addNewResult: (result) => 
    set((state) => ({
      recentResults: [result, ...state.recentResults.slice(0, 2)]
    })),

  updateStats: (newStats) => 
    set({ stats: newStats }),
}));