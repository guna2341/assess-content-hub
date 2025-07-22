import { create } from 'zustand';

export const useAssessmentDetailStore = create((set, get) => ({
  // Assessment state
  timeLeft: 60 * 5, // 5 minutes for demo
  currentQuestion: 0,
  answers: {},
  isSubmitted: false,
  results: null,
  timerId: null,
  hasStarted: false,
  
  // Questions data with letter options
  questions: [
    {
      id: '1',
      text: 'What is 2 + 2?',
      options: {
        'A': '3',
        'B': '4', 
        'C': '5',
        'D': '6'
      },
      correctAnswer: 'B'
    },
    {
      id: '2',
      text: 'What is the capital of France?',
      options: {
        'A': 'London',
        'B': 'Berlin',
        'C': 'Paris',
        'D': 'Madrid'
      },
      correctAnswer: 'C'
    },
    {
      id: '3',
      text: 'Which planet is known as the Red Planet?',
      options: {
        'A': 'Venus',
        'B': 'Mars',
        'C': 'Jupiter',
        'D': 'Saturn'
      },
      correctAnswer: 'B'
    }
  ],

  // Actions
  startAssessment: () => {
    set({ hasStarted: true });
    const { timerId } = get();
    if (timerId) clearInterval(timerId);
    
    const newTimerId = setInterval(() => {
      set((state) => {
        if (state.timeLeft <= 1) {
          clearInterval(newTimerId);
          state.submitAssessment();
          return { timeLeft: 0, isSubmitted: true };
        }
        return { timeLeft: state.timeLeft - 1 };
      });
    }, 1000);
    
    set({ timerId: newTimerId });
  },

  selectAnswer: (questionId, answerKey) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answerKey
      }
    }));
  },

  submitAssessment: () => {
    const { questions, answers } = get();
    
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    
    const detailedResults = questions.map(question => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.text,
        selectedOption: answers[question.id] ? 
          `${answers[question.id]}. ${question.options[answers[question.id]]}` : 
          'Not answered',
        correctOption: `${question.correctAnswer}. ${question.options[question.correctAnswer]}`,
        isCorrect
      };
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    set({
      isSubmitted: true,
      results: {
        score,
        totalQuestions,
        correctAnswers,
        detailedResults
      }
    });
    
    localStorage.setItem(`assessment_completed_${get().assessmentId}`, 'true');
    
    const { timerId } = get();
    if (timerId) clearInterval(timerId);
  },

  goToNextQuestion: () => set((state) => ({
    currentQuestion: Math.min(state.questions.length - 1, state.currentQuestion + 1)
  })),

  goToPrevQuestion: () => set((state) => ({
    currentQuestion: Math.max(0, state.currentQuestion - 1)
  })),

  checkIfCompleted: (assessmentId) => {
    return localStorage.getItem(`assessment_completed_${assessmentId}`) === 'true';
  },

  resetAssessment: () => {
    set({
      timeLeft: 60 * 5,
      currentQuestion: 0,
      answers: {},
      isSubmitted: false,
      results: null,
      timerId: null,
      hasStarted: false
    });
  }
}));