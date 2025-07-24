import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";


const ADMIN_SERVICES = {
    getContent: async ({params}) => {
        return apiClient.get(END_POINTS.ADMIN.content, params);
    }
};

export default ADMIN_SERVICES;