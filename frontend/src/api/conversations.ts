import axiosInstance from './axios';

export interface Conversation {
  id: number;
  name: string;
  type: string;
  created_at: string;
}

export interface CreateConversationData {
  name: string;
  type: string;
}

export interface UpdateConversationData {
  name?: string;
  type?: string;
}

export const conversationsApi = {
  create: async (data: CreateConversationData, token: string = "") => {
    const response = await axiosInstance.post<Conversation>('/conversations', data, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },

  getAll: async (page: number = 1, itemsPerPage: number = 10) => {
    const response = await axiosInstance.get<Conversation[]>('/conversations', {
      params: {
        page,
        size: itemsPerPage
      }
    });
    return response.data;
  },

  getById: async (conversationId: string) => {
    const response = await axiosInstance.get<Conversation>(`/conversations/${conversationId}`);
    return response.data;
  },

  update: async (conversationId: string, data: UpdateConversationData) => {
    const response = await axiosInstance.put<Conversation>(
      `/conversations/${conversationId}`,
      data
    );
    return response.data;
  },

  delete: async (conversationId: string) => {
    const response = await axiosInstance.delete(`/conversations/${conversationId}`);
    return response.data;
  },

  getByWidgetId: async (widgetId: string, page: number = 1, itemsPerPage: number = 10) => {
    const response = await axiosInstance.get<Conversation[]>(`/conversations/widget/${widgetId}`, {
      params: {
        page,
        size: itemsPerPage
      }
    });
    return response.data;
  }
}; 