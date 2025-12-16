'use client';

import { create } from 'zustand';

export interface Activity {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ActivityFormData {
  content: string;
  imageUrl: string;
}

export interface ActivityFormState {
  isEditing: boolean;
  editingId: string | null;
  formData: ActivityFormData;
  setEditing: (id: string | null) => void;
  setContent: (content: string) => void;
  setImageUrl: (url: string) => void;
  reset: () => void;
  loadActivity: (activity: Activity) => void;
}

const initialFormData: ActivityFormData = {
  content: '',
  imageUrl: '',
};

export function createActivityFormStore() {
  return create<ActivityFormState>((set) => ({
    isEditing: false,
    editingId: null,
    formData: { ...initialFormData },

    setEditing: (id) =>
      set({
        isEditing: id !== null,
        editingId: id,
      }),

    setContent: (content) =>
      set((state) => ({
        formData: { ...state.formData, content },
      })),

    setImageUrl: (imageUrl) =>
      set((state) => ({
        formData: { ...state.formData, imageUrl },
      })),

    reset: () =>
      set({
        isEditing: false,
        editingId: null,
        formData: { ...initialFormData },
      }),

    loadActivity: (activity) =>
      set({
        isEditing: true,
        editingId: activity.id,
        formData: {
          content: activity.content,
          imageUrl: activity.imageUrl ?? '',
        },
      }),
  }));
}

export interface ActivityListState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  removeActivity: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export function createActivityListStore(initialActivities: Activity[] = []) {
  return create<ActivityListState>((set) => ({
    activities: initialActivities,
    isLoading: false,
    error: null,

    setActivities: (activities) => set({ activities }),

    addActivity: (activity) =>
      set((state) => ({
        activities: [activity, ...state.activities],
      })),

    updateActivity: (id, updates) =>
      set((state) => ({
        activities: state.activities.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      })),

    removeActivity: (id) =>
      set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
      })),

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }));
}
