import axiosInstance from './axios';
import config from '@/config';

export interface Document {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'completed' | 'error';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export const documentsApi = {
  // Get all documents with pagination
  getAll: async (page: number = 1, itemsPerPage: number = 10) => {
    console.log("-----files=====")
    const response = await axiosInstance.get<PaginatedResponse<Document>>('/files', {
      params: {
        page,
        items_per_page: itemsPerPage
      }
    });
    return response.data;
  },

  // Upload new document(s)
  upload: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    const response = await axiosInstance.post<Document[]>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a document
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/files/${id}`);
    return response.data;
  },

}; 