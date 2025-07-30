import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";


const ADMIN_SERVICES = {
    getContent: async ({params}) => {
        return apiClient.get(END_POINTS.ADMIN.content, params);
    },
    createContent: async (content) => {        
        return apiClient.post(END_POINTS.ADMIN.content, content );
    }
};

export default ADMIN_SERVICES;