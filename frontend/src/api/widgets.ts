import axiosInstance from './axios';
import { Document } from './documents';

export interface Widget {
  id: string;
  name: string;
  description: string;
  type: string;
  files: Document[];
}
export interface CreateWidgetData {
  name: string;
  description: string;
  type: string;
  prompt: string;
  file_ids: number[];
}

export const widgetsApi = {
  // Get all widgets
  getAll: async (page: number = 1, itemsPerPage: number = 10) => {
    const response = await axiosInstance.get<Widget[]>('/widgets', {
      params: {
        page,
        size: itemsPerPage
      }
    });
    return response.data;
  },

  // Create a new widget
  register: async (data: CreateWidgetData) => {
    const response = await axiosInstance.post<Widget>('/widgets/register', data);
    return response.data;
  },

  // Delete a widget
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/widgets/${id}`);
    return response.data;
  },

  // Associate a file with a widget
  associateFile: async (widgetId: string, fileId: string) => {
    const response = await axiosInstance.post<Widget>(
      `/widgets/${widgetId}/files/${fileId}`
    );
    return response.data;
  },

  // Remove file association from a widget
  removeFileAssociation: async (widgetId: string, fileId: string) => {
    const response = await axiosInstance.delete(
      `/widgets/${widgetId}/files/${fileId}`
    );
    return response.data;
  },
}; 