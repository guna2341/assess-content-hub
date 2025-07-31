    import { create } from "zustand";
    import { contentUnits } from "../../utils/admin";
import ADMIN_SERVICES from "../../api/services/admin";
    
    export const useAdminContentStore = create((set, get) => ({
        content: [],

        getContent: async () => {
            const { content } = get();
            try {
                if (content.length > 0) {
                    return { message: "Data fetched successfully", state: true };
                }
                const response = await ADMIN_SERVICES.getContent();
                set({ content: response?.data?.data });
                return { message: "Data fetched successfully", state: true };
            }
            catch (err) {
                return {message: err.message, state: false };
            }
        },

        editContent: async (id, updatedData) => {
            try {
                const response = await ADMIN_SERVICES.editContent(id, updatedData);
                if (response.data?.content) {
                    set((state) => ({
                        content: state.content.map((item) =>
                            item.id === id ? response.data.content : item
                        )
                    }));
                }
            } catch (err) {
                console.error("Edit content error:", err);
            }
        },

        deleteContent: async (contentId, questionId) => {
            try {
                const response = await ADMIN_SERVICES.deleteContent(contentId, questionId);

                set((state) => {
                    if (questionId) {
                        // Deleting a question
                        return {
                            content: state.content.map((item) =>
                                item.id === contentId
                                    ? {
                                        ...item,
                                        questions: item.questions.filter((q) => q.id !== questionId), // New array
                                    }
                                    : item
                            ),
                        };
                    }

                    // Deleting a whole content
                    return {
                        content: state.content.filter((item) => item.id !== contentId), // New array
                    };
                });
            } catch (err) {
                console.error("Error deleting content/question:", err);
            }
        },



        createContent: async (data) => {            
            try {
                const response = await ADMIN_SERVICES.createContent({ content: data });
                set((state) => ({
                    content: [...state.content, response?.data?.content]
                }));
                return { data: response.data ,state:true};
            }
            catch (err) {
                return { message: err.message ,state:false};
            }
        }

    }));