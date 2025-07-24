import { create } from 'zustand';
import secureLocalStorage from "react-secure-storage";
import AUTH_SERVICES from '../api/services/auth';

export const useAuthStore = create(
    (set) => ({
      user: secureLocalStorage.getItem('user') ? JSON.parse(secureLocalStorage.getItem('user')) : null,
      token: secureLocalStorage.getItem('token') ? secureLocalStorage.getItem('token') : null,
      isAuthenticated: secureLocalStorage.getItem('isAuthenticated') ? JSON.parse(secureLocalStorage.getItem('isAuthenticated')) : false,
    
    login: async (user) => {
      try {
        const response = await AUTH_SERVICES.login(user);
        const token = response?.data?.token;
        const userInfo = response?.data?.data?.user;
        secureLocalStorage.setItem("user", JSON.stringify(userInfo));
        secureLocalStorage.setItem("token", token);
        secureLocalStorage.setItem("isAuthenticated", true);
        set({ user: userInfo, token, isAuthenticated: true });
        return { status: true, message: "Login successful" };
      }
      catch (error) { 
        return {status:false, message: error?.data?.message || "Login failed" };
      }
    },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage', 
    }
);
