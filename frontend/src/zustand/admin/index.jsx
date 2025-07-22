import { create } from "zustand";
import { activeStudents, dashboardStats, learningUnitsLength, pendingReviews, recentActivies, totalQuestions } from "../../utils/admin";


export const useAdminStore = create((set, get) => ({
    stats:dashboardStats,
    recentActivities:recentActivies
}));