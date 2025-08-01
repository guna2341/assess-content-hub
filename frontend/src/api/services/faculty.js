import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";

const FACULTY_SERVICES = {
  getContent: async () => {
    return apiClient.get(END_POINTS.FACULTY.content);
  },
  createContent: async (content) => {
    return apiClient.post(END_POINTS.FACULTY.content, content);
  }
};

export default FACULTY_SERVICES;
