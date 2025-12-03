'use client';

export function TermsPrivacy() {
    return (
        <p className="text-center text-sm text-muted-foreground mt-6">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="underline hover:text-foreground">
                Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
            </a>
        </p>
    );
}

export default TermsPrivacy;