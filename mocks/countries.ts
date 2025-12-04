export interface Country {
    name: string;
    dialCode: string;
}

export const countries: Country[] = [
    { name: 'Afghanistan', dialCode: '+93' },
    { name: 'Albania', dialCode: '+355' },
    { name: 'Algeria', dialCode: '+213' },
    { name: 'Argentina', dialCode: '+54' },
    { name: 'Australia', dialCode: '+61' },
    { name: 'Austria', dialCode: '+43' },
    { name: 'Belgium', dialCode: '+32' },
    { name: 'Brazil', dialCode: '+55' },
    { name: 'Canada', dialCode: '+1' },
    { name: 'Chile', dialCode: '+56' },
    { name: 'China', dialCode: '+86' },
    { name: 'Colombia', dialCode: '+57' },
    { name: 'Croatia', dialCode: '+385' },
    { name: 'Czech Republic', dialCode: '+420' },
    { name: 'Denmark', dialCode: '+45' },
    { name: 'Egypt', dialCode: '+20' },
    { name: 'Finland', dialCode: '+358' },
    { name: 'France', dialCode: '+33' },
    { name: 'Germany', dialCode: '+49' },
    { name: 'Greece', dialCode: '+30' },
    { name: 'Hong Kong', dialCode: '+852' },
    { name: 'Hungary', dialCode: '+36' },
    { name: 'India', dialCode: '+91' },
    { name: 'Indonesia', dialCode: '+62' },
    { name: 'Ireland', dialCode: '+353' },
    { name: 'Israel', dialCode: '+972' },
    { name: 'Italy', dialCode: '+39' },
    { name: 'Japan', dialCode: '+81' },
    { name: 'South Korea', dialCode: '+82' },
    { name: 'Malaysia', dialCode: '+60' },
    { name: 'Mexico', dialCode: '+52' },
    { name: 'Netherlands', dialCode: '+31' },
    { name: 'New Zealand', dialCode: '+64' },
    { name: 'Norway', dialCode: '+47' },
    { name: 'Pakistan', dialCode: '+92' },
    { name: 'Philippines', dialCode: '+63' },
    { name: 'Poland', dialCode: '+48' },
    { name: 'Portugal', dialCode: '+351' },
    { name: 'Romania', dialCode: '+40' },
    { name: 'Russia', dialCode: '+7' },
    { name: 'Saudi Arabia', dialCode: '+966' },
    { name: 'Singapore', dialCode: '+65' },
    { name: 'South Africa', dialCode: '+27' },
    { name: 'Spain', dialCode: '+34' },
    { name: 'Sweden', dialCode: '+46' },
    { name: 'Switzerland', dialCode: '+41' },
    { name: 'Taiwan', dialCode: '+886' },
    { name: 'Thailand', dialCode: '+66' },
    { name: 'Turkey', dialCode: '+90' },
    { name: 'Ukraine', dialCode: '+380' },
    { name: 'United Arab Emirates', dialCode: '+971' },
    { name: 'United Kingdom', dialCode: '+44' },
    { name: 'United States', dialCode: '+1' },
    { name: 'Vietnam', dialCode: '+84' },
];

export function filterCountries(query: string): Country[] {
    const lowerQuery = query.toLowerCase();
    return countries.filter(
        (c) =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.dialCode.includes(query)
    );
}
