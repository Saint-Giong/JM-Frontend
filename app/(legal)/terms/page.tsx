import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for DEVision Job Manager',
};

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h2:mt-10 prose-h2:border-b prose-h2:pb-3 prose-h2:border-border/40">
      <header className="not-prose mb-10 border-b border-border/40 pb-8">
        <h1 className="mb-3 font-bold text-4xl tracking-tight">
          Terms of Service
        </h1>
        <p className="text-lg text-muted-foreground">
          Last updated: December 2025
        </p>
      </header>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using DEVision Job Manager (&quot;Service&quot;), you
          agree to be bound by these Terms of Service (&quot;Terms&quot;). If
          you do not agree to these Terms, please do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          DEVision Job Manager is a recruitment and applicant tracking platform
          that allows users to post job listings, manage applications, and
          streamline their hiring process.
        </p>
      </section>

      <section>
        <h2>3. User Accounts</h2>
        <p>
          To access certain features of the Service, you may be required to
          create an account. You are responsible for:
        </p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Providing accurate and complete information</li>
          <li>Notifying us immediately of any unauthorized access</li>
        </ul>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Post false, misleading, or fraudulent job listings</li>
          <li>
            Discriminate against applicants based on protected characteristics
          </li>
          <li>Collect or harvest user data without authorization</li>
          <li>Interfere with the proper functioning of the Service</li>
          <li>Transmit malware, viruses, or harmful code</li>
        </ul>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are
          owned by DEVision and are protected by international copyright,
          trademark, and other intellectual property laws.
        </p>
      </section>

      <section>
        <h2>6. User Content</h2>
        <p>
          You retain ownership of any content you submit to the Service. By
          submitting content, you grant us a non-exclusive, worldwide,
          royalty-free license to use, display, and distribute such content in
          connection with the Service.
        </p>
      </section>

      <section>
        <h2>7. Privacy</h2>
        <p>
          Your use of the Service is also governed by our{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          , which describes how we collect, use, and protect your information.
        </p>
      </section>

      <section>
        <h2>8. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, either express or implied, including
          but not limited to implied warranties of merchantability, fitness for
          a particular purpose, or non-infringement.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, DEVision shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages resulting from your use of the Service.
        </p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access
          to the Service at our sole discretion, without notice, for conduct
          that we believe violates these Terms or is harmful to other users, us,
          or third parties.
        </p>
      </section>

      <section>
        <h2>11. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify users of any
          material changes by posting the updated Terms on this page. Your
          continued use of the Service after such changes constitutes acceptance
          of the new Terms.
        </p>
      </section>

      <section>
        <h2>12. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at{' '}
          <a
            href="mailto:support@devision.com"
            className="text-primary hover:underline"
          >
            support@devision.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}
