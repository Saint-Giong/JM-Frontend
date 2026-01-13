'use client';

import { create } from 'zustand';
import type { Country } from '@/lib/constants/countries';

export interface CountryPhoneState {
  // State
  country: Country | null;
  dialCode: string;
  phoneNumber: string;
  mounted: boolean;

  // Actions
  setCountry: (country: Country | null) => void;
  setDialCode: (dialCode: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setMounted: (mounted: boolean) => void;
  selectCountry: (country: Country) => void;
  selectDialCode: (country: Country) => void;
  reset: () => void;
}

export interface CountryPhoneStoreOptions {
  initialCountry?: Country | null;
  initialDialCode?: string;
  initialPhoneNumber?: string;
}

export function createCountryPhoneStore(
  options: CountryPhoneStoreOptions = {}
) {
  const {
    initialCountry = null,
    initialDialCode = '',
    initialPhoneNumber = '',
  } = options;

  return create<CountryPhoneState>((set) => ({
    // Initial state
    country: initialCountry,
    dialCode: initialDialCode,
    phoneNumber: initialPhoneNumber,
    mounted: false,

    // Actions
    setCountry: (country) => set({ country }),
    setDialCode: (dialCode) => set({ dialCode }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
    setMounted: (mounted) => set({ mounted }),

    selectCountry: (country) =>
      set({
        country,
        dialCode: country.dialCode,
      }),

    selectDialCode: (country) =>
      set({
        country,
        dialCode: country.dialCode,
      }),

    reset: () =>
      set({
        country: initialCountry,
        dialCode: initialDialCode,
        phoneNumber: initialPhoneNumber,
      }),
  }));
}

export type CountryPhoneStore = ReturnType<typeof createCountryPhoneStore>;
