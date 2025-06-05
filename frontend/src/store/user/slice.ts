import { StateCreator } from 'zustand';
import { User, UserState } from './types';

const createUserSlice: StateCreator<UserState> = (set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
});

export default createUserSlice; 