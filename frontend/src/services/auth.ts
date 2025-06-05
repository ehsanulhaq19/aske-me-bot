import axios from 'axios';

interface LoginResponse {
  user: {
    name: string;
    email: string;
    id: number;
    type: number;
  };
  access_token: string;
  token_type: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/api/auth/login`, credentials);
  return response.data;
}; 