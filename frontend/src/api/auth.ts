import axios from 'axios';
import config from '@/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserCreateGuest {
  email: string;
  name: string;
}

export interface UserOut {
  id: number;
  email: string;
  name: string;
  type: number;
}

export interface LoginResponse {
  user: {
    id: number;
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

  async createGuestUser(user: UserCreateGuest, token: string): Promise<UserOut> {
    const response = await axios.post(`${config.apiUrl}/users/guest`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
}; 