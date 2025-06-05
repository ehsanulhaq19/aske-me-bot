import { StateCreator } from 'zustand';
import { File, FileState } from './types';

const createFileSlice: StateCreator<FileState> = (set) => ({
  files: [],
  setFiles: (files: File[]) => set({ files }),
  addFile: (file: File) => 
    set((state) => ({ 
      files: [...state.files, file] 
    })),
  deleteFile: (id: string) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
});

export default createFileSlice; 