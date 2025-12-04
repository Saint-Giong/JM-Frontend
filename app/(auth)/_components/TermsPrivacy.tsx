'use client';

export function TermsPrivacy() {
    return (
        <p className="text-center text-sm text-muted-foreground mt-6">
            By creating an account, you agree to our{' '}
            <a href="https://docs.jm.saintgiong.ttr.gg/legal/terms-of-service" target="_blank" className="underline hover:text-foreground">
                Terms of Service
            </a>{' '}
            and{' '}
            <a href="/https://docs.jm.saintgiong.ttr.gg/legal/privacy-policy" target="_blank" className="underline hover:text-foreground">
                Privacy Policy
            </a>
        </p>
    );
}

export default TermsPrivacy;