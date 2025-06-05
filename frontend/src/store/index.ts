import { create } from 'zustand';
import { UserState } from './user/types';
import { WidgetState } from './widgets/types';
import { FileState } from './files/types';
import createUserSlice from './user/slice';
import createWidgetSlice from './widgets/slice';
import createFileSlice from './files/slice';

// Combine all states
type StoreState = UserState & WidgetState & FileState;

// Create the store with all slices
const useStore = create<StoreState>()((...args) => ({
  ...createUserSlice(...args),
  ...createWidgetSlice(...args),
  ...createFileSlice(...args),
}));

export default useStore; 