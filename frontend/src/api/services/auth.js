import secureLocalStorage from "react-secure-storage";
import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";


const AUTH_SERVICES = {
    login: async (credentials) => {
        return apiClient.post(END_POINTS.AUTH.login, credentials);
    },
    logout: async () => { 
        secureLocalStorage.clear();   
    }
};

export default AUTH_SERVICES;