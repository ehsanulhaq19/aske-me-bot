import axios from 'axios';
import config from '@/config';

export interface Widget {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateWidgetData {
  name: string;
  description: string;
}

export interface UpdateWidgetData {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export const widgetsApi = {
  // Get all widgets
  getAll: async () => {
    const response = await axios.get<Widget[]>(`${config.apiUrl}/widgets`);
    return response.data;
  },

  // Get a single widget by ID
  getById: async (id: string) => {
    const response = await axios.get<Widget>(`${config.apiUrl}/widgets/${id}`);
    return response.data;
  },

  // Create a new widget
  create: async (data: CreateWidgetData) => {
    const response = await axios.post<Widget>(`${config.apiUrl}/widgets`, data);
    return response.data;
  },

  // Update an existing widget
  update: async (id: string, data: UpdateWidgetData) => {
    const response = await axios.put<Widget>(`${config.apiUrl}/widgets/${id}`, data);
    return response.data;
  },

  // Delete a widget
  delete: async (id: string) => {
    const response = await axios.delete(`${config.apiUrl}/widgets/${id}`);
    return response.data;
  },

  // Toggle widget status
  toggleStatus: async (id: string) => {
    const response = await axios.patch<Widget>(`${config.apiUrl}/widgets/${id}/toggle-status`);
    return response.data;
  },
}; 