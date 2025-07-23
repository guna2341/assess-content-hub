import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";


const AUTH_SERVICES = {
    LOGIN: async (credentials) => {
        return apiClient.post(END_POINTS.LOGIN, credentials);
    },
    LOGOUT: async () => { 
        localStorage.clear();   
    }
};

export default AUTH_SERVICES;