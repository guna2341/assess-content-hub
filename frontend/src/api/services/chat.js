import secureLocalStorage from "react-secure-storage";
import apiClient from "../config/axios";
import END_POINTS from "../config/endpoints";

const CHAT_SERVICES = {
  // Get chat history between two users
  getChatHistory: async (senderId, receiverId) => {
    return apiClient.get(
      `${END_POINTS.CHAT.history}/${senderId}/${receiverId}`
    );
  },

  // Send a new message
  sendMessage: async (senderId, receiverId, message) => {
    return apiClient.post(END_POINTS.CHAT.send, {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
    });
  },

  // Mark messages as read
  markMessagesAsRead: async (senderId, receiverId) => {
    return apiClient.patch(`${END_POINTS.CHAT.read}?sender_id=${senderId}&receiver_id=${receiverId}`);
  },

  // Get unread message count
  getUnreadCount: async (userId) => {
    return apiClient.get(`${END_POINTS.CHAT.unread}?user_id=${userId}`);
  },

  // Get recent conversations
  getRecentConversations: async (userId) => {
    return apiClient.get(`${END_POINTS.CHAT.recent}/${userId}`);
  },

  // Clear chat storage
  clearChatStorage: () => {
    secureLocalStorage.removeItem("last_chat_timestamp");
    secureLocalStorage.removeItem("cached_conversations");
  },

  // Cache last active timestamp
  cacheLastActive: (timestamp) => {
    secureLocalStorage.setItem("last_chat_timestamp", timestamp);
  },

  // Get cached last active timestamp
  getLastActive: () => {
    return secureLocalStorage.getItem("last_chat_timestamp");
  },
};

export default CHAT_SERVICES;
