'use client';

import { FormInput } from '@/components/common/Form';

interface LocationStepProps {
  city: string;
  address: string;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityBlur: () => void;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressBlur: () => void;
}

export function LocationStep({
  city,
  address,
  onCityChange,
  onCityBlur,
  onAddressChange,
  onAddressBlur,
}: LocationStepProps) {
  return (
    <>
      <FormInput
        label="City"
        name="city"
        type="text"
        placeholder="e.g. San Francisco"
        value={city}
        onChange={onCityChange}
        onBlur={onCityBlur}
      />
      <FormInput
        label="Address"
        name="address"
        type="text"
        placeholder="Street address (optional)"
        value={address}
        onChange={onAddressChange}
        onBlur={onAddressBlur}
      />
    </>
  );
}
