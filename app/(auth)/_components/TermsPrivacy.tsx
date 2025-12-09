'use client';

export function TermsPrivacy() {
  return (
    <p className="mt-6 text-center text-muted-foreground text-sm">
      By creating an account, you agree to our{' '}
      <a
        href="https://docs.jm.saintgiong.ttr.gg/legal/terms-of-service"
        target="_blank"
        className="underline hover:text-foreground"
        rel="noopener"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="/https://docs.jm.saintgiong.ttr.gg/legal/privacy-policy"
        target="_blank"
        className="underline hover:text-foreground"
        rel="noopener"
      >
        Privacy Policy
      </a>
    </p>
  );
}

export default TermsPrivacy;
