import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";


const ADMIN_SERVICES = {
  getContent: async () => {
    return apiClient.get(END_POINTS.ADMIN.content);
  },
  createContent: async (content) => {
    return apiClient.post(END_POINTS.ADMIN.content, content);
  },
  editContent: async (id, data) => {     
    return apiClient.put(END_POINTS.ADMIN.editContent(id), data);
  },
  deleteContent: async (contentId, questionId) => {
    return apiClient.delete(
      END_POINTS.ADMIN.deleteContent(contentId, questionId)
    );
  },

};

export default ADMIN_SERVICES;