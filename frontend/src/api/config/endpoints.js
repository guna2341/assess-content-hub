

const END_POINTS = {
  BASE_URL: "http://localhost:5000",
  AUTH: {
    login: "auth/login",
  },

  ADMIN: {
    content: "admin/content",
    deleteContent: (contentId, questionId) => {
      const params = new URLSearchParams({ contentId });
      if (questionId) params.append("questionId", questionId);

      return `admin/content?${params.toString()}`;
    },
    editContent: (id) => `admin/content/${id}`,
  },
};

export default END_POINTS;