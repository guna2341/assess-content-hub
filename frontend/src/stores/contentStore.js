import { create } from 'zustand';

export const useContentStore = create((set) => ({
  units: [],
  questions: [],
  selectedUnit: null,
  loading: false,
  
  setUnits: (units) => set({ units }),
  setQuestions: (questions) => set({ questions }),
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),

  addUnit: (unit) =>
    set((state) => ({ units: [...state.units, unit] })),

  updateUnit: (id, unitData) =>
    set((state) => ({
      units: state.units.map((unit) =>
        unit.id === id ? { ...unit, ...unitData } : unit
      ),
    })),

  deleteUnit: (id) =>
    set((state) => ({
      units: state.units.filter((unit) => unit.id !== id),
    })),

  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),

  updateQuestion: (id, questionData) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === id ? { ...question, ...questionData } : question
      ),
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((question) => question.id !== id),
    })),

  setLoading: (loading) => set({ loading }),
}));
