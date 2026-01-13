'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  Label,
} from '@saint-giong/bamboo-ui';
import { forwardRef, useRef } from 'react';
import {
  type UseCountryPhoneOptions,
  useCountryPhone,
} from '@/components/headless/country-phone';
import type { Country } from '@/lib/constants/countries';

const MAX_PHONE_LENGTH = 12;

// Types
interface CountryPhoneRowProps {
  countryValue: string;
  dialCode: string;
  phoneNumber: string;
  phoneError?: string;
  onCountryNameChange: (name: string) => void;
  onDialCodeChange: (dialCode: string) => void;
  onPhoneNumberChange: (phoneNumber: string) => void;
}

// UI Component
export function CountryPhoneRow({
  countryValue,
  dialCode,
  phoneNumber,
  phoneError,
  onCountryNameChange,
  onDialCodeChange,
  onPhoneNumberChange,
}: CountryPhoneRowProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Internal handler that syncs country name and dial code
  const handleCountryChange = (country: Country) => {
    onCountryNameChange(country.name);
    onDialCodeChange(country.dialCode);
  };

  const options: UseCountryPhoneOptions = {
    initialCountry: countryValue,
    initialDialCode: dialCode,
    initialPhoneNumber: phoneNumber,
    onCountryChange: handleCountryChange,
    onDialCodeChange,
    onPhoneNumberChange,
    phoneError,
  };

  const {
    mounted,
    countries,
    handleCountrySelect: baseHandleCountrySelect,
    handleDialCodeSelect,
    handlePhoneNumberChange,
    getCountryDisplayValue,
    getDialCodeDisplayValue,
  } = useCountryPhone(options);

  // Wrap country select to focus phone input after selection
  const handleCountrySelect = (value: string) => {
    baseHandleCountrySelect(value);
    // Focus phone input after a brief delay to allow combobox to close
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="grid grid-cols-10 items-start gap-x-4 gap-y-2">
      {/* Labels */}
      <Label className="col-span-4 font-medium text-foreground text-sm">
        Country<span className="text-foreground"> *</span>
      </Label>
      <Label className="col-span-6 font-medium text-foreground text-sm">
        Phone number
      </Label>

      {/* Country Combobox */}
      <div className="col-span-4">
        {mounted ? (
          <Combobox value={countryValue} onValueChange={handleCountrySelect}>
            <ComboboxTrigger
              placeholder="Choose country"
              displayValue={getCountryDisplayValue}
              className="w-full rounded-md border border-muted-foreground/30 bg-transparent px-3 py-2 text-foreground hover:border-foreground focus:border-foreground"
            />
            <ComboboxContent>
              <ComboboxInput placeholder="Search countries..." />
              <ComboboxList className="max-h-[300px] overflow-y-auto">
                <ComboboxEmpty>No country found.</ComboboxEmpty>
                <ComboboxGroup>
                  {countries.map((country) => (
                    <ComboboxItem key={country.name} value={country.name}>
                      <span className="flex w-full items-center gap-2">
                        <span>{country.name}</span>
                        <span className="ml-auto text-muted-foreground text-xs">
                          {country.dialCode}
                        </span>
                      </span>
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ) : (
          <CountryPlaceholder />
        )}
      </div>

      {/* Dial Code n Phone Number */}
      <div className="col-span-6">
        <div className="flex items-start gap-2">
          {mounted ? (
            <Combobox value={dialCode} onValueChange={handleDialCodeSelect}>
              <ComboboxTrigger
                placeholder="+00"
                displayValue={getDialCodeDisplayValue}
                className="w-[5.5rem] rounded-md border border-muted-foreground/30 bg-transparent px-3 py-2 text-foreground hover:border-foreground focus:border-foreground"
              />
              <ComboboxContent>
                <ComboboxInput placeholder="Search..." />
                <ComboboxList className="max-h-[300px] overflow-y-auto">
                  <ComboboxEmpty>No code found.</ComboboxEmpty>
                  <ComboboxGroup>
                    {countries.map((country) => (
                      <ComboboxItem key={country.name} value={country.dialCode}>
                        <span className="flex w-full items-center gap-2">
                          <span>{country.dialCode}</span>
                          <span className="ml-auto text-muted-foreground text-xs">
                            {country.name}
                          </span>
                        </span>
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          ) : (
            <DialCodePlaceholder />
          )}

          <PhoneInput
            ref={phoneInputRef}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            hasError={!!phoneError || phoneNumber.length > MAX_PHONE_LENGTH}
          />
        </div>

        {/* Error Message */}
        {(phoneError || phoneNumber.length > MAX_PHONE_LENGTH) && (
          <p className="mt-1 text-red-500 text-sm">
            {phoneError ||
              `Phone number must not exceed ${MAX_PHONE_LENGTH} digits`}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components (UI only)
// ============================================================================

function CountryPlaceholder() {
  return (
    <div className="w-full rounded-md border border-muted-foreground/30 bg-transparent px-3 py-2 text-muted-foreground/50">
      Choose country
    </div>
  );
}

function DialCodePlaceholder() {
  return (
    <div className="w-[5.5rem] rounded-md border border-muted-foreground/30 bg-transparent px-3 py-2 text-muted-foreground/50">
      +00
    </div>
  );
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput({ value, onChange, hasError }, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits
      const digitsOnly = e.target.value.replace(/\D/g, '');
      onChange(digitsOnly);
    };

    const exceedsMaxLength = value.length > MAX_PHONE_LENGTH;
    const showError = hasError || exceedsMaxLength;

    return (
      <input
        ref={ref}
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="XXX-XXX-XXXX"
        className={`w-full max-w-[10rem] border-0 border-b bg-transparent px-2 py-2 text-foreground transition-colors placeholder:text-muted-foreground/50 focus:outline-none ${
          showError
            ? 'border-red-500 focus:border-red-500'
            : 'border-muted-foreground/30 focus:border-foreground'
        }`}
      />
    );
  }
);
