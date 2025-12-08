import { create } from 'zustand';

// Password Toggle Store
export interface PasswordToggleState {
  isVisible: boolean;
  toggle: () => void;
  show: () => void;
  hide: () => void;
}

export const createPasswordToggleStore = (initialVisible = false) =>
  create<PasswordToggleState>((set) => ({
    isVisible: initialVisible,
    toggle: () => set((state) => ({ isVisible: !state.isVisible })),
    show: () => set({ isVisible: true }),
    hide: () => set({ isVisible: false }),
  }));

// Form Submit Store
export interface FormSubmitState {
  isSubmitting: boolean;
  error: string | null;
  setSubmitting: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const createFormSubmitStore = () =>
  create<FormSubmitState>((set) => ({
    isSubmitting: false,
    error: null,
    setSubmitting: (value) => set({ isSubmitting: value }),
    setError: (error) => set({ error }),
    reset: () => set({ isSubmitting: false, error: null }),
  }));

// Field Store
export interface FieldState<T> {
  value: T;
  touched: boolean;
  error: string | null;
  setValue: (value: T) => void;
  setTouched: (touched: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const createFieldStore = <T>(initialValue: T) =>
  create<FieldState<T>>((set) => ({
    value: initialValue,
    touched: false,
    error: null,
    setValue: (value) => set({ value, error: null }),
    setTouched: (touched) => set({ touched }),
    setError: (error) => set({ error }),
    reset: () => set({ value: initialValue, touched: false, error: null }),
  }));
