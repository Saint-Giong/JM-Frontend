'use client';

import { create } from 'zustand';

export interface ComboboxState<T> {
    isOpen: boolean;
    query: string;
    selectedItem: T | null;
    highlightedIndex: number;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setQuery: (query: string) => void;
    setSelectedItem: (item: T | null) => void;
    setHighlightedIndex: (index: number) => void;
    reset: () => void;
}

export function createComboboxStore<T>() {
    return create<ComboboxState<T>>((set) => ({
        isOpen: false,
        query: '',
        selectedItem: null,
        highlightedIndex: 0,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false, query: '', highlightedIndex: 0 }),
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
        setQuery: (query) => set({ query, highlightedIndex: 0 }),
        setSelectedItem: (item) => set({ selectedItem: item }),
        setHighlightedIndex: (index) => set({ highlightedIndex: index }),
        reset: () => set({ isOpen: false, query: '', selectedItem: null, highlightedIndex: 0 }),
    }));
}


