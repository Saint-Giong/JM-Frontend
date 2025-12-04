'use client';

import { Label } from '@saint-giong/bamboo-ui';
import {
    Combobox,
    ComboboxTrigger,
    ComboboxContent,
    ComboboxInput,
    ComboboxList,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
} from '@saint-giong/bamboo-ui';
import { useCountryPhone, type UseCountryPhoneOptions } from '@/components/headless/country-phone';
import type { Country } from '@/mocks/countries';

const MAX_PHONE_LENGTH = 13;

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
        handleCountrySelect,
        handleDialCodeSelect,
        handlePhoneNumberChange,
        getCountryDisplayValue,
        getDialCodeDisplayValue,
    } = useCountryPhone(options);

    return (
        <div className="grid grid-cols-10 gap-x-4 gap-y-2 items-start">
            {/* Labels */}
            <Label className="col-span-4 text-sm font-medium text-foreground">
                Country<span className="text-foreground"> *</span>
            </Label>
            <Label className="col-span-6 text-sm font-medium text-foreground">
                Phone number
            </Label>

            {/* Country Combobox */}
            <div className="col-span-4">
                {mounted ? (
                    <Combobox value={countryValue} onValueChange={handleCountrySelect}>
                        <ComboboxTrigger
                            placeholder="Choose country"
                            displayValue={getCountryDisplayValue}
                            className="w-full border border-muted-foreground/30 rounded-md bg-transparent px-3 py-2 text-foreground hover:border-foreground focus:border-foreground"
                        />
                        <ComboboxContent>
                            <ComboboxInput placeholder="Search countries..." />
                            <ComboboxList>
                                <ComboboxEmpty>No country found.</ComboboxEmpty>
                                <ComboboxGroup>
                                    {countries.map((country) => (
                                        <ComboboxItem key={country.name} value={country.name}>
                                            <span className="flex items-center gap-2 w-full">
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
                                className="w-[5.5rem] border border-muted-foreground/30 rounded-md bg-transparent px-3 py-2 text-foreground hover:border-foreground focus:border-foreground"
                            />
                            <ComboboxContent>
                                <ComboboxInput placeholder="Search..." />
                                <ComboboxList>
                                    <ComboboxEmpty>No code found.</ComboboxEmpty>
                                    <ComboboxGroup>
                                        {countries.map((country) => (
                                            <ComboboxItem key={country.name} value={country.dialCode}>
                                                <span className="flex items-center gap-2 w-full">
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
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        hasError={!!phoneError || phoneNumber.length > MAX_PHONE_LENGTH}
                    />
                </div>

                {/* Error Message */}
                {(phoneError || phoneNumber.length > MAX_PHONE_LENGTH) && (
                    <p className="text-sm text-red-500 mt-1">
                        {phoneError || `Phone number must not exceed ${MAX_PHONE_LENGTH} digits`}
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
        <div className="w-full border border-muted-foreground/30 rounded-md bg-transparent px-3 py-2 text-muted-foreground/50">
            Choose country
        </div>
    );
}

function DialCodePlaceholder() {
    return (
        <div className="w-[5.5rem] border border-muted-foreground/30 rounded-md bg-transparent px-3 py-2 text-muted-foreground/50">
            +00
        </div>
    );
}

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    hasError: boolean;
}

function PhoneInput({ value, onChange, hasError }: PhoneInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits
        const digitsOnly = e.target.value.replace(/\D/g, '');
        onChange(digitsOnly);
    };

    const exceedsMaxLength = value.length > MAX_PHONE_LENGTH;
    const showError = hasError || exceedsMaxLength;

    return (
        <input
            type="tel"
            value={value}
            onChange={handleChange}
            placeholder="XXX-XXX-XXXX"
            className={`w-full max-w-[10rem] border-0 border-b bg-transparent px-2 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                showError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-muted-foreground/30 focus:border-foreground'
            }`}
        />
    );
}
