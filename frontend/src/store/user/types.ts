export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
} 