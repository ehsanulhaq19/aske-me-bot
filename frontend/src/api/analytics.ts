import axiosInstance from './axios';

export interface SystemAnalytics {
  total_widgets: number;
  total_type_4_users: number;
  total_files: number;
  total_conversations: number;
}

export const analyticsApi = {
  getSystemAnalytics: async () => {
    const response = await axiosInstance.get<SystemAnalytics>('/analytics/system');
    return response.data;
  }
}; 