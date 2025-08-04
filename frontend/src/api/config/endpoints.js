

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
  FACULTY: {
    content: "reviewer/content",
  },
  CHAT: {
    history: "/chat",
    send: "/chat/send",
    read: "/chat/read",
    unread: "/chat/unread-count",
    recent: "/chat/recent",
  },
  USERS: {
    list: "/users",
    detail: "/users",
    search: "/users/search",
    online: "/users/online",
    profile: "/users/profile",
  },
};

export default END_POINTS;