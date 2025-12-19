'use client';

import { create } from 'zustand';

/**
 * Profile store for managing shared profile UI state across layout and page components.
 * Uses Zustand for global state management, enabling the layout to control the header's
 * edit mode toggle while the page manages the form content.
 */
export interface ProfileState {
  // Edit mode state shared between layout (header) and page (content)
  isEditMode: boolean;

  // Actions
  setEditMode: (isEditMode: boolean) => void;
  toggleEditMode: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  // Initial state
  isEditMode: false,

  // Actions
  setEditMode: (isEditMode) => set({ isEditMode }),

  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
}));
