import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";

const USER_SERVICES = {
  /**
   * Get all users with optional filters
   * @param {Object} filters - Optional filters (role, department, etc.)
   * @returns {Promise} Axios response
   */
  getAllUsers: async (filters = {}) => {
    return apiClient.get(END_POINTS.USERS.list, {
      params: filters,
    });
  },

  /**
   * Get a specific user by ID
   * @param {string|number} userId
   * @returns {Promise} Axios response
   */
  getUserById: async (userId) => {
    return apiClient.get(`${END_POINTS.USERS.detail}/${userId}`);
  },

  /**
   * Get all faculty members
   * @returns {Promise} Axios response
   */
  getFaculty: async () => {
    return apiClient.get(END_POINTS.USERS.list, {
      params: { role: "reviewer" },
    });
  },

  /**
   * Search users by name, email, or department
   * @param {string} query - Search term
   * @returns {Promise} Axios response
   */
  searchUsers: async (query) => {
    return apiClient.get(END_POINTS.USERS.search, {
      params: { query },
    });
  },

  /**
   * Get users who are currently online
   * @returns {Promise} Axios response
   */
  getOnlineUsers: async () => {
    return apiClient.get(END_POINTS.USERS.online);
  },

  /**
   * Get user's basic info (public profile)
   * @param {string|number} userId
   * @returns {Promise} Axios response
   */
  getUserProfile: async (userId) => {
    return apiClient.get(`${END_POINTS.USERS.profile}/${userId}`);
  },

  /**
   * Get users by department
   * @param {string} department
   * @returns {Promise} Axios response
   */
  getUsersByDepartment: async (department) => {
    return apiClient.get(END_POINTS.USERS.list, {
      params: { department },
    });
  },

  /**
   * Get chat partners based on current user's role
   * @param {string} currentUserRole - Current user's role
   * @param {string|number} currentUserId - Current user's ID
   * @returns {Promise} Axios response
   */
  getChatPartners: async (currentUserRole, currentUserId) => {
    return apiClient.get(`${END_POINTS.USERS.list}/chat-partners`, {
      params: {
        role: currentUserRole,
        currentUserId: currentUserId,
      },
    });
  },

  /**
   * Update user online status
   * @param {string|number} userId
   * @param {boolean} isOnline
   * @returns {Promise} Axios response
   */
  updateOnlineStatus: async (userId, isOnline) => {
    return apiClient.patch(`${END_POINTS.USERS.detail}/${userId}/status`, {
      is_online: isOnline,
    });
  },

  /**
   * Get user chat statistics
   * @param {string|number} userId
   * @returns {Promise} Axios response
   */
  getUserChatStats: async (userId) => {
    return apiClient.get(`${END_POINTS.USERS.detail}/${userId}/chat-stats`);
  },
};

export default USER_SERVICES;
