import axiosInstance from './axios';
import { Document } from './documents';

export interface Widget {
  id: string;
  name: string;
  description: string;
  type: string;
  files: Document[];
  conversations_count?: number;
}

export interface WidgetBot {
  id: string;
  name: string;
  description: string;
  type: string;
  token: string;
  user_id: number;
}
export interface CreateWidgetData {
  name: string;
  description: string;
  type: string;
  prompt: string;
  file_ids: number[];
}

export const widgetsApi = {
  getAll: async (page: number = 1, itemsPerPage: number = 10) => {
    const response = await axiosInstance.get<Widget[]>('/widgets', {
      params: {
        page,
        size: itemsPerPage
      }
    });
    return response.data;
  },

  register: async (data: CreateWidgetData) => {
    const response = await axiosInstance.post<Widget>('/widgets/register', data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/widgets/${id}`);
    return response.data;
  },

  getBotById: async (id: string) => {
    const response = await axiosInstance.get<WidgetBot>(`/widgets/bot/${id}`);
    return response.data;
  },

  associateFile: async (widgetId: string, fileId: string) => {
    const response = await axiosInstance.post<Widget>(
      `/widgets/${widgetId}/files/${fileId}`
    );
    return response.data;
  },

  removeFileAssociation: async (widgetId: string, fileId: string) => {
    const response = await axiosInstance.delete(
      `/widgets/${widgetId}/files/${fileId}`
    );
    return response.data;
  },

  update: async (id: string, data: CreateWidgetData) => {
    const response = await axiosInstance.put<Widget>(`/widgets/${id}`, data);
    return response.data;
  },

  queryBot: async (message: string, token: string = "") => {
    const response = await axiosInstance.post<Widget>(`/widgets/bot/query`, {
      content: message
    }, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
}; 