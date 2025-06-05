import { StateCreator } from 'zustand';
import { Widget, WidgetState } from './types';

const createWidgetSlice: StateCreator<WidgetState> = (set) => ({
  widgets: [],
  setWidgets: (widgets: Widget[]) => set({ widgets }),
  addWidget: (widget: Widget) => 
    set((state) => ({ 
      widgets: [...state.widgets, widget] 
    })),
  updateWidget: (id: string, updatedWidget: Partial<Widget>) =>
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...updatedWidget } : widget
      ),
    })),
  deleteWidget: (id: string) =>
    set((state) => ({
      widgets: state.widgets.filter((widget) => widget.id !== id),
    })),
});

export default createWidgetSlice; 