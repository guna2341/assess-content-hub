import { create } from "zustand";
import { questionBank } from "../../utils/admin";

export const useQuestionStore = create((set, get) => ({
    questionBank: questionBank || [],

    // Find a topic by ID in the question bank
    findTopicById: (id) => {
        const search = (topics) => {
            for (const topic of topics) {
                if (topic.id === id) return topic;
                if (topic.children) {
                    const found = search(topic.children);
                    if (found) return found;
                }
            }
            return null;
        };
        return search(get().questionBank);
    },

    // Add a new topic (either root level or as a subtopic)
    addTopic: (newTopic, parentId = null) => {
        set((state) => {
            if (!parentId) {
                return { questionBank: [...state.questionBank, newTopic] };
            }

            const updateTopics = (topics) => {
                return topics.map(topic => {
                    if (topic.id === parentId) {
                        return {
                            ...topic,
                            children: [...(topic.children || []), newTopic]
                        };
                    }
                    if (topic.children) {
                        return {
                            ...topic,
                            children: updateTopics(topic.children)
                        };
                    }
                    return topic;
                });
            };

            return { questionBank: updateTopics(state.questionBank) };
        });
    },

    // Delete a topic from the question bank
    deleteTopicFromBank: (topicId) => {
        set((state) => {
            const removeTopic = (topics) => {
                return topics.filter(topic => topic.id !== topicId).map(topic => {
                    if (topic.children) {
                        return {
                            ...topic,
                            children: removeTopic(topic.children)
                        };
                    }
                    return topic;
                });
            };

            return { questionBank: removeTopic(state.questionBank) };
        });
    },

    // Add a question to a specific topic
    addQuestionToTopic: (topicId, question) => {
        set((state) => {
            const updateTopics = (topics) => {
                return topics.map(topic => {
                    if (topic.id === topicId) {
                        return {
                            ...topic,
                            questions: [...(topic.questions || []), question]
                        };
                    }
                    if (topic.children) {
                        return {
                            ...topic,
                            children: updateTopics(topic.children)
                        };
                    }
                    return topic;
                });
            };

            return { questionBank: updateTopics(state.questionBank) };
        });
    },

    // Update a question in a specific topic
    updateQuestionInTopic: (topicId, updatedQuestion) => {
        set((state) => {
            const updateTopics = (topics) => {
                return topics.map(topic => {
                    if (topic.id === topicId) {
                        return {
                            ...topic,
                            questions: topic.questions?.map(q =>
                                q.id === updatedQuestion.id ? updatedQuestion : q
                            ) || []
                        };
                    }
                    if (topic.children) {
                        return {
                            ...topic,
                            children: updateTopics(topic.children)
                        };
                    }
                    return topic;
                });
            };

            return { questionBank: updateTopics(state.questionBank) };
        });
    },

    // Delete a question from a specific topic
    deleteQuestionFromTopic: (topicId, questionId) => {
        set((state) => {
            const updateTopics = (topics) => {
                return topics.map(topic => {
                    if (topic.id === topicId) {
                        return {
                            ...topic,
                            questions: topic.questions?.filter(q => q.id !== questionId) || []
                        };
                    }
                    if (topic.children) {
                        return {
                            ...topic,
                            children: updateTopics(topic.children)
                        };
                    }
                    return topic;
                });
            };

            return { questionBank: updateTopics(state.questionBank) };
        });
    },

    // Count all questions in the question bank
    countAllQuestions: () => {
        const countQuestions = (topic) => {
            let count = topic.questions?.length || 0;
            if (topic.children) {
                count += topic.children.reduce((sum, child) => sum + countQuestions(child), 0);
            }
            return count;
        };
        return get().questionBank.reduce((sum, topic) => sum + countQuestions(topic), 0);
    },

    // Get the path to a specific topic
    getTopicPath: (targetId) => {
        const search = (topics, targetId, path = []) => {
            for (const topic of topics) {
                const currentPath = [...path, topic];
                if (topic.id === targetId) {
                    return currentPath;
                }
                if (topic.children) {
                    const found = search(topic.children, targetId, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };
        return search(get().questionBank, targetId);
    },

    // Find the topic ID that contains a specific question
    findTopicIdForQuestion: (questionId) => {
        const search = (topics) => {
            for (const topic of topics) {
                if (topic.questions?.some(q => q.id === questionId)) {
                    return topic.id;
                }
                if (topic.children) {
                    const found = search(topic.children);
                    if (found) return found;
                }
            }
            return null;
        };
        return search(get().questionBank);
    },

    // Add a comment to a question
    addCommentToQuestion: (topicId, questionId, newComment) => {
        set((state) => {
            const updateTopics = (topics) => {
                return topics.map(topic => {
                    if (topic.id === topicId) {
                        return {
                            ...topic,
                            questions: topic.questions?.map(q => {
                                if (q.id === questionId) {
                                    return {
                                        ...q,
                                        comments: [
                                            ...(q.comments || []),
                                            {
                                                ...newComment,
                                                id: Date.now().toString(),
                                                createdAt: new Date().toISOString().split('T')[0]
                                            }
                                        ]
                                    };
                                }
                                return q;
                            }) || []
                        };
                    }
                    if (topic.children) {
                        return {
                            ...topic,
                            children: updateTopics(topic.children)
                        };
                    }
                    return topic;
                });
            };

            return { questionBank: updateTopics(state.questionBank) };
        });
    }
}));