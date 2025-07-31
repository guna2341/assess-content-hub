// stores/admin/questionBank.js
import { create } from 'zustand';

// Helper function to find a topic by ID in the nested structure
const findTopicById = (topics, id) => {
  for (const topic of topics) {
    if (topic.id === id) return topic;
    if (topic.children) {
      const found = findTopicById(topic.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to find a topic's parent by ID in the nested structure
const findParentTopicById = (topics, id, parent = null) => {
  for (const topic of topics) {
    if (topic.id === id) return parent;
    if (topic.children) {
      const found = findParentTopicById(topic.children, id, topic);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to update topics recursively
const updateTopics = (topics, targetId, updater) => {
  return topics.map(topic => {
    if (topic.id === targetId) {
      return updater(topic);
    }
    if (topic.children) {
      return {
        ...topic,
        children: updateTopics(topic.children, targetId, updater)
      };
    }
    return topic;
  });
};

// Helper function to delete a topic recursively
const deleteTopicFromTopics = (topics, targetId) => {
  return topics.reduce((acc, topic) => {
    if (topic.id === targetId) {
      return acc; // skip this topic
    }
    if (topic.children) {
      return [
        ...acc,
        {
          ...topic,
          children: deleteTopicFromTopics(topic.children, targetId)
        }
      ];
    }
    return [...acc, topic];
  }, []);
};

const useQuestionStore = create((set, get) => ({
  questionBank: [
    {
      id: 'math',
      name: 'Mathematics',
      questions: [
        {
          id: '1',
          question: 'What is 2 + 2?',
          type: 'Multiple Choice',
          difficulty: 'Easy',
          options: ['3', '4', '5', '6'],
          correctAnswer: 'B',
          explanation: 'The sum of 2 and 2 is 4.',
          status: 'approved',
          createdAt: '2023-01-01',
          createdBy: 'System',
          comments: []
        }
      ],
      children: [
        {
          id: 'algebra',
          name: 'Algebra',
          questions: [
            {
              id: '2',
              question: 'Solve for x: 2x + 3 = 7',
              type: 'Short Answer',
              difficulty: 'Easy',
              correctAnswer: '2',
              explanation: 'Subtract 3 from both sides, then divide by 2.',
              status: 'approved',
              createdAt: '2023-01-02',
              createdBy: 'System',
              comments: []
            }
          ],
          children: []
        }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      questions: [
        {
          id: '3',
          question: 'What is the chemical symbol for water?',
          type: 'Multiple Choice',
          difficulty: 'Easy',
          options: ['H2O', 'CO2', 'NaCl', 'O2'],
          correctAnswer: 'A',
          explanation: 'Water is composed of two hydrogen atoms and one oxygen atom.',
          status: 'approved',
          createdAt: '2023-01-03',
          createdBy: 'System',
          comments: []
        }
      ],
      children: [
        {
          id: 'physics',
          name: 'Physics',
          questions: [
            {
              id: '4',
              question: 'What is the formula for force?',
              type: 'Short Answer',
              difficulty: 'Medium',
              correctAnswer: 'F = ma',
              explanation: "Newton's second law states that force equals mass times acceleration.",
              status: 'approved',
              createdAt: '2023-01-04',
              createdBy: 'System',
              comments: []
            }
          ],
          children: []
        }
      ]
    }
  ],

  // Add a new topic (can be root or child)
  addTopic: (newTopic, parentId = null) => {
    set(state => {
      if (!parentId) {
        // Add as root topic
        return {
          questionBank: [...state.questionBank, newTopic]
        };
      }

      // Add as child topic
      return {
        questionBank: updateTopics(state.questionBank, parentId, topic => ({
          ...topic,
          children: [...(topic.children || []), newTopic]
        }))
      };
    });
  },

  // Add a question to a topic
  addQuestionToTopic: (topicId, newQuestion) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        questions: [...(topic.questions || []), newQuestion]
      }))
    }));
  },

  // Update a question in a topic
  updateQuestionInTopic: (topicId, updatedQuestion) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        questions: (topic.questions || []).map(question =>
          question.id === updatedQuestion.id ? updatedQuestion : question
        )
      }))
    }));
  },

  // Delete a question from a topic
  deleteQuestionFromTopic: (topicId, questionId) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        questions: (topic.questions || []).filter(
          question => question.id !== questionId
        )
      }))
    }));
  },

  // Delete a topic (and all its children and questions)
  deleteTopicFromBank: topicId => {
    set(state => ({
      questionBank: deleteTopicFromTopics(state.questionBank, topicId)
    }));
  },

  // Move a topic (and all its children) to a new parent
  moveTopic: (topicId, newParentId) => {
    const { questionBank } = get();
    const topicToMove = findTopicById(questionBank, topicId);
    const currentParent = findParentTopicById(questionBank, topicId);

    if (!topicToMove) return;

    // First remove from current parent
    let newBank = deleteTopicFromTopics(questionBank, topicId);

    // Then add to new parent
    if (!newParentId) {
      // Move to root
      set({ questionBank: [...newBank, topicToMove] });
    } else {
      set({
        questionBank: updateTopics(newBank, newParentId, topic => ({
          ...topic,
          children: [...(topic.children || []), topicToMove]
        }))
      });
    }
  },

  // Update topic metadata (name, description, etc.)
  updateTopic: (topicId, updates) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        ...updates
      }))
    }));
  },

  // Add a comment to a question
  addCommentToQuestion: (topicId, questionId, comment) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        questions: (topic.questions || []).map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              comments: [
                ...(question.comments || []),
                {
                  id: Date.now().toString(),
                  user: 'Current User',
                  text: comment,
                  type: 'comment',
                  createdAt: new Date().toISOString()
                }
              ]
            };
          }
          return question;
        })
      }))
    }));
  },

  // Update a comment on a question
  updateComment: (topicId, questionId, commentId, updates) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        questions: (topic.questions || []).map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              comments: (question.comments || []).map(comment => {
                if (comment.id === commentId) {
                  return { ...comment, ...updates };
                }
                return comment;
              })
            };
          }
          return question;
        })
      }))
    }));
  },

  // Delete a comment from a question
  deleteComment: (topicId, questionId, commentId) => {
    set(state => ({
      questionBank: updateTopics(state.questionBank, topicId, topic => ({
        ...topic,
        questions: (topic.questions || []).map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              comments: (question.comments || []).filter(
                comment => comment.id !== commentId
              )
            };
          }
          return question;
        })
      }))
    }));
  }
}));

export { useQuestionStore };