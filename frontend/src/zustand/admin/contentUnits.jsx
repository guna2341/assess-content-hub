    import { create } from "zustand";
    import { contentUnits } from "../../utils/admin";
import ADMIN_SERVICES from "../../api/services/admin";
    
    export const useAdminContentStore = create((set, get) => ({
        content: contentUnits,

        getContent: async (params) => {
            const response = await ADMIN_SERVICES.getContent(params);
            console.log(response);
        },

        editContent: (data) => {        
            const newData = {
                ...data,
                status:"pending",
                createdAt: '2024-01-15',
                updatedAt: '2024-01-20',
                createdBy: 'Dr. Smith',
                totalReviews: 0,
                minimumReviews: 3,
            };
            set((state) => ({
                content: state.content.map((item) =>
                    item.id === newData.id ? newData : item
                ),
            }));
        },

        deleteContent: (id) => {
            set(state => ({
                content: state.content.filter(item => item.id !== id)
            }));
        },

        createContent: async (data) => {
            const response = await ADMIN_SERVICES.createContent({ data });
            const newData = {
                ...data,
                status: "pending",
                tags: ["react", "hooks", "javascript"],
                totalReviews: 0,
                minimumReviews: 3,
                questionType:"content",
                questions: {
                    ...data.questions
                }
            };         
            set((state) => ({
                content:[...state.content, newData]
            }));
        }

    }));