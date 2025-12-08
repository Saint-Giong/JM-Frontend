'use client';

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useStore } from 'zustand';
import { countries, type Country } from '@/mocks/countries';
import { createCountryPhoneStore, type CountryPhoneStore } from './stores';

// Types
export interface UseCountryPhoneOptions {
  initialCountry?: string;
  initialDialCode?: string;
  initialPhoneNumber?: string;
  onCountryChange?: (country: Country) => void;
  onDialCodeChange?: (dialCode: string) => void;
  onPhoneNumberChange?: (phoneNumber: string) => void;
  phoneError?: string;
}

export interface UseCountryPhoneReturn {
  // State
  country: Country | null;
  dialCode: string;
  phoneNumber: string;
  mounted: boolean;
  phoneError?: string;

  // Derived
  countries: Country[];
  countryDisplayValue: string;
  dialCodeDisplayValue: string;

  // Actions
  handleCountrySelect: (countryName: string) => void;
  handleDialCodeSelect: (dialCode: string) => void;
  handlePhoneNumberChange: (value: string) => void;

  // Display value functions for combobox
  getCountryDisplayValue: (name: string) => string;
  getDialCodeDisplayValue: (code: string) => string;
}

// Hook
export function useCountryPhone(
  options: UseCountryPhoneOptions = {}
): UseCountryPhoneReturn {
  const {
    initialCountry = '',
    initialDialCode = '',
    initialPhoneNumber = '',
    onCountryChange,
    onDialCodeChange,
    onPhoneNumberChange,
    phoneError,
  } = options;

  // Create store ref to maintain instance across renders
  const storeRef = useRef<CountryPhoneStore | null>(null);

  // Intentionally access ref in useMemo for one-time store initialization
  const store: CountryPhoneStore = useMemo(() => {
    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
      const initial = initialCountry
        ? countries.find((c) => c.name === initialCountry)
        : null;

      storeRef.current = createCountryPhoneStore({
        initialCountry: initial,
        initialDialCode: initial?.dialCode || initialDialCode,
        initialPhoneNumber,
      });
    }
    // eslint-disable-next-line react-hooks/refs
    return storeRef.current;
  }, [initialCountry, initialDialCode, initialPhoneNumber]);

  // Subscribe to store state
  const country = useStore(store, (s) => s.country);
  const dialCode = useStore(store, (s) => s.dialCode);
  const phoneNumber = useStore(store, (s) => s.phoneNumber);
  const mounted = useStore(store, (s) => s.mounted);
  const setMounted = useStore(store, (s) => s.setMounted);
  const selectCountry = useStore(store, (s) => s.selectCountry);
  const selectDialCode = useStore(store, (s) => s.selectDialCode);
  const setPhoneNumber = useStore(store, (s) => s.setPhoneNumber);

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  // Sync with external values when they change
  useEffect(() => {
    if (initialCountry) {
      const found = countries.find((c) => c.name === initialCountry);
      if (found && found.name !== country?.name) {
        selectCountry(found);
      }
    }
  }, [initialCountry, country?.name, selectCountry]);

  useEffect(() => {
    if (initialDialCode && initialDialCode !== dialCode) {
      store.getState().setDialCode(initialDialCode);
    }
  }, [initialDialCode, dialCode, store]);

  useEffect(() => {
    if (initialPhoneNumber !== phoneNumber) {
      store.getState().setPhoneNumber(initialPhoneNumber);
    }
  }, [initialPhoneNumber, phoneNumber, store]);

  // Handlers
  const handleCountrySelect = useCallback(
    (countryName: string) => {
      const found = countries.find((c) => c.name === countryName);
      if (found) {
        selectCountry(found);
        onCountryChange?.(found);
        onDialCodeChange?.(found.dialCode);
      }
    },
    [selectCountry, onCountryChange, onDialCodeChange]
  );

  const handleDialCodeSelect = useCallback(
    (code: string) => {
      const found = countries.find((c) => c.dialCode === code);
      if (found) {
        selectDialCode(found);
        onCountryChange?.(found);
        onDialCodeChange?.(code);
      }
    },
    [selectDialCode, onCountryChange, onDialCodeChange]
  );

  const handlePhoneNumberChange = useCallback(
    (value: string) => {
      setPhoneNumber(value);
      onPhoneNumberChange?.(value);
    },
    [setPhoneNumber, onPhoneNumberChange]
  );

  // Display value functions
  const getCountryDisplayValue = useCallback((name: string) => name || '', []);
  const getDialCodeDisplayValue = useCallback(
    (code: string) => code || '+00',
    []
  );

  // Derived values
  const countryDisplayValue = useMemo(
    () => getCountryDisplayValue(country?.name || ''),
    [country?.name, getCountryDisplayValue]
  );

  const dialCodeDisplayValue = useMemo(
    () => getDialCodeDisplayValue(dialCode),
    [dialCode, getDialCodeDisplayValue]
  );

  return {
    // State
    country,
    dialCode,
    phoneNumber,
    mounted,
    phoneError,

    // Derived
    countries,
    countryDisplayValue,
    dialCodeDisplayValue,

    // Actions
    handleCountrySelect,
    handleDialCodeSelect,
    handlePhoneNumberChange,

    // Display functions
    getCountryDisplayValue,
    getDialCodeDisplayValue,
  };
}
