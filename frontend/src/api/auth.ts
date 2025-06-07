import axios from 'axios';
import config from '@/config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  token_type: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post(`${config.apiUrl}/users/login`, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${config.apiUrl}/users/logout`);
  },
}; 