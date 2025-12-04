'use client';

import { COUNTRIES } from '@/mocks/countries';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@saint-giong/bamboo-ui';

interface CountryComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CountryCombobox({
  value,
  onValueChange,
  placeholder = 'Select country...',
}: CountryComboboxProps) {
  return (
    <Combobox value={value} onValueChange={onValueChange}>
      <ComboboxTrigger
        className="w-full"
        placeholder={placeholder}
        displayValue={(v) => v}
      />
      <ComboboxContent className="w-[--radix-popover-trigger-width]">
        <ComboboxInput placeholder="Search country..." />
        <ComboboxList>
          <ComboboxEmpty>No country found.</ComboboxEmpty>
          <ComboboxGroup>
            {COUNTRIES.map((country) => (
              <ComboboxItem key={country} value={country}>
                {country}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
