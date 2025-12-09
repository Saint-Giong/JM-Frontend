import { create } from 'zustand';

export interface SalaryRangeState {
  min: string;
  max: string;
  currency: string;
  setMin: (value: string) => void;
  setMax: (value: string) => void;
  setCurrency: (value: string) => void;
  reset: () => void;
}

export function createSalaryRangeStore(
  initialMin = '',
  initialMax = '',
  initialCurrency = 'USD'
) {
  return create<SalaryRangeState>((set) => ({
    min: initialMin,
    max: initialMax,
    currency: initialCurrency,
    setMin: (value) => set({ min: value }),
    setMax: (value) => set({ max: value }),
    setCurrency: (value) => set({ currency: value }),
    reset: () =>
      set({ min: initialMin, max: initialMax, currency: initialCurrency }),
  }));
}
