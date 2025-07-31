import { create } from 'zustand';

export const useStudentMaterialsStore = create((set, get) => ({
  // Initial state
  searchTerm: '',
  selectedCourse: 'All Courses',
  selectedType: 'All Types',
  downloadedMaterials: [],
  studyMaterials: [
    {
      id: '1',
      title: 'Introduction to React',
      type: 'lecture',
      course: 'Web Development',
      uploadDate: '2023-10-15',
      downloadUrl: '#',
    },
    {
      id: '2',
      title: 'Assignment 1: Components',
      type: 'assignment',
      course: 'Web Development',
      uploadDate: '2023-10-18',
      downloadUrl: '#',
    },
    {
      id: '3',
      title: 'Advanced State Management',
      type: 'lecture',
      course: 'Advanced React',
      uploadDate: '2023-10-20',
      downloadUrl: '#',
    },
    {
      id: '4',
      title: 'Linear Algebra Fundamentals',
      type: 'lecture',
      course: 'Mathematics',
      uploadDate: '2023-10-10',
      downloadUrl: '#',
    },
    {
      id: '5',
      title: 'Problem Set 1',
      type: 'assignment',
      course: 'Mathematics',
      uploadDate: '2023-10-12',
      downloadUrl: '#',
    },
    {
      id: '6',
      title: 'Shakespearean Literature',
      type: 'lecture',
      course: 'English Literature',
      uploadDate: '2023-10-05',
      downloadUrl: '#',
    },
    {
      id: '7',
      title: 'Essay on Macbeth',
      type: 'assignment',
      course: 'English Literature',
      uploadDate: '2023-10-08',
      downloadUrl: '#',
    },
    {
      id: '8',
      title: 'Cell Biology Basics',
      type: 'lecture',
      course: 'Biology',
      uploadDate: '2023-10-22',
      downloadUrl: '#',
    },
  ],

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setSelectedType: (type) => set({ selectedType: type }),
  addDownloadedMaterial: (id) => 
    set((state) => ({
      downloadedMaterials: [...state.downloadedMaterials, id]
    })),
  getFilteredMaterials: () => {
    const { searchTerm, selectedCourse, selectedType, studyMaterials } = get();
    
    return studyMaterials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          material.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = selectedCourse === 'All Courses' || material.course === selectedCourse;
      const matchesType = selectedType === 'All Types' || 
                         material.type.toLowerCase() === selectedType.toLowerCase();
      
      return matchesSearch && matchesCourse && matchesType;
    });
  },
}));