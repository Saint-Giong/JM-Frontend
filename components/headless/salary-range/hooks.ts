'use client';

import { useCallback, useMemo, useState } from 'react';

export interface SalaryRangeValue {
  min: string;
  max: string;
}

export interface UseSalaryRangeOptions {
  /** Initial minimum value */
  initialMin?: string;
  /** Initial maximum value */
  initialMax?: string;
  /** Callback when min value changes */
  onMinChange?: (value: string) => void;
  /** Callback when max value changes */
  onMaxChange?: (value: string) => void;
  /** Callback when any value changes */
  onChange?: (value: SalaryRangeValue) => void;
}

/**
 * Headless hook for managing salary range input state.
 * Handles validation, formatting, and state management for min/max salary inputs.
 */
export function useSalaryRange({
  initialMin = '',
  initialMax = '',
  onMinChange,
  onMaxChange,
  onChange,
}: UseSalaryRangeOptions = {}) {
  const [min, setMinInternal] = useState(initialMin);
  const [max, setMaxInternal] = useState(initialMax);

  const setMin = useCallback(
    (value: string) => {
      // Only allow numeric input
      const numericValue = value.replace(/[^0-9]/g, '');
      setMinInternal(numericValue);
      onMinChange?.(numericValue);
      onChange?.({ min: numericValue, max });
    },
    [max, onMinChange, onChange]
  );

  const setMax = useCallback(
    (value: string) => {
      // Only allow numeric input
      const numericValue = value.replace(/[^0-9]/g, '');
      setMaxInternal(numericValue);
      onMaxChange?.(numericValue);
      onChange?.({ min, max: numericValue });
    },
    [min, onMaxChange, onChange]
  );

  const reset = useCallback(() => {
    setMinInternal(initialMin);
    setMaxInternal(initialMax);
  }, [initialMin, initialMax]);

  // Validation state
  const validation = useMemo(() => {
    const minNum = min ? Number(min) : null;
    const maxNum = max ? Number(max) : null;

    const isMinValid = minNum === null || minNum >= 0;
    const isMaxValid = maxNum === null || maxNum >= 0;
    const isRangeValid = minNum === null || maxNum === null || minNum <= maxNum;

    return {
      isMinValid,
      isMaxValid,
      isRangeValid,
      isValid: isMinValid && isMaxValid && isRangeValid,
      error: !isRangeValid ? 'Minimum cannot be greater than maximum' : null,
    };
  }, [min, max]);

  // Numeric values for external use
  const numericValues = useMemo(
    () => ({
      min: min ? Number(min) : null,
      max: max ? Number(max) : null,
    }),
    [min, max]
  );

  // Props for min input
  const getMinInputProps = useCallback(
    () => ({
      type: 'text' as const,
      inputMode: 'numeric' as const,
      value: min,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setMin(e.target.value),
      placeholder: 'Min',
    }),
    [min, setMin]
  );

  // Props for max input
  const getMaxInputProps = useCallback(
    () => ({
      type: 'text' as const,
      inputMode: 'numeric' as const,
      value: max,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setMax(e.target.value),
      placeholder: 'Max',
    }),
    [max, setMax]
  );

  return {
    // Values
    min,
    max,
    numericValues,

    // Setters
    setMin,
    setMax,
    reset,

    // Validation
    validation,

    // Input props helpers
    getMinInputProps,
    getMaxInputProps,
  };
}
