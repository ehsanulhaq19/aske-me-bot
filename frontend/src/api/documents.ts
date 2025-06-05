import axios from 'axios';
import config from '@/config';

export interface Document {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export const documentsApi = {
  // Get all documents
  getAll: async () => {
    const response = await axios.get<Document[]>(`${config.apiUrl}/documents`);
    return response.data;
  },

  // Upload new document(s)
  upload: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post<Document[]>(`${config.apiUrl}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a document
  delete: async (id: string) => {
    const response = await axios.delete(`${config.apiUrl}/documents/${id}`);
    return response.data;
  },

  // Download a document
  download: async (id: string) => {
    const response = await axios.get(`${config.apiUrl}/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document metadata
  getMetadata: async (id: string) => {
    const response = await axios.get<Document>(`${config.apiUrl}/documents/${id}/metadata`);
    return response.data;
  },
}; 