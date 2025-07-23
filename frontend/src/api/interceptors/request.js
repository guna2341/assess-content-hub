import apiClient from "../config/axios";
import { useAuthStore } from "../../stores/authStore";  

apiClient.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.metadata = { startTime: new Date().getTime() };
    return config;
},
    (error) => Promise.reject(error)
);

