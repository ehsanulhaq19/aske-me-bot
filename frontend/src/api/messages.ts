import axiosInstance from './axios';
import { Conversation } from './conversations';

export interface User {
  id: number;
  name: string;
  email: string;
  type: number;
}

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  conversation_id: number;
  sender: User;
  conversation: Conversation;
}

export interface CreateMessageData {
  content: string;
  sender_id: number;
  conversation_id: number;
}

export interface UpdateMessageData {
  content?: string;
}

export const messagesApi = {
  create: async (data: CreateMessageData, token: string = "") => {
    const response = await axiosInstance.post<Message>('/messages', data, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getById: async (messageId: number) => {
    const response = await axiosInstance.get<Message>(`/messages/${messageId}`);
    return response.data;
  },

  update: async (messageId: number, data: UpdateMessageData) => {
    const response = await axiosInstance.put<Message>(
      `/messages/${messageId}`,
      data
    );
    return response.data;
  },

  delete: async (messageId: number) => {
    const response = await axiosInstance.delete(`/messages/${messageId}`);
    return response.data;
  },

  getConversationMessages: async (conversationId: number, page: number = 1, itemsPerPage: number = 10) => {
    const response = await axiosInstance.get<Message[]>(`/messages/conversation/${conversationId}`, {
      params: {
        page,
        size: itemsPerPage
      }
    });
    return response.data;
  },

  getUserMessages: async (userId: number, page: number = 1, itemsPerPage: number = 10) => {
    const response = await axiosInstance.get<Message[]>(`/messages/user/${userId}`, {
      params: {
        page,
        size: itemsPerPage
      }
    });
    return response.data;
  }
}; 