import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for DEVision Job Manager',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert prose-h2:mt-10 max-w-none prose-headings:scroll-mt-20 prose-h2:border-border/40 prose-h2:border-b prose-h2:pb-3">
      <header className="not-prose mb-10 border-border/40 border-b pb-8">
        <h1 className="mb-3 font-bold text-4xl tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground">
          Last updated: December 2025
        </p>
      </header>

      <section>
        <h2>1. Introduction</h2>
        <p>
          DEVision (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use
          our Job Manager service.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>
          We may collect personal information that you provide directly,
          including:
        </p>
        <ul>
          <li>Name and contact information (email address, phone number)</li>
          <li>Account credentials</li>
          <li>Company or organization details</li>
          <li>Job listings and descriptions you create</li>
          <li>Applicant information you manage through the platform</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>When you use our Service, we may automatically collect:</p>
        <ul>
          <li>Device information (browser type, operating system)</li>
          <li>IP address and location data</li>
          <li>Usage data and analytics</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our Service</li>
          <li>Process and manage your account</li>
          <li>Communicate with you about updates, features, and support</li>
          <li>Analyze usage patterns to enhance user experience</li>
          <li>Ensure the security and integrity of our platform</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Information Sharing</h2>
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> With third-party vendors who
            assist in operating our Service
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law or to
            respond to legal process
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger,
            acquisition, or sale of assets
          </li>
          <li>
            <strong>With Your Consent:</strong> When you have given explicit
            permission
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the Internet is 100% secure.
        </p>
      </section>

      <section>
        <h2>6. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a longer
          retention period is required by law.
        </p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </section>

      <section>
        <h2>8. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to enhance your experience,
          analyze trends, and administer the Service. You can control cookie
          preferences through your browser settings.
        </p>
      </section>

      <section>
        <h2>9. Third-Party Links</h2>
        <p>
          Our Service may contain links to third-party websites. We are not
          responsible for the privacy practices of these external sites. We
          encourage you to review their privacy policies.
        </p>
      </section>

      <section>
        <h2>10. Children&apos;s Privacy</h2>
        <p>
          Our Service is not intended for individuals under the age of 18. We do
          not knowingly collect personal information from children. If we become
          aware of such collection, we will take steps to delete the
          information.
        </p>
      </section>

      <section>
        <h2>11. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries
          other than your own. We ensure appropriate safeguards are in place to
          protect your data in accordance with this Privacy Policy.
        </p>
      </section>

      <section>
        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date.
        </p>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at{' '}
          <a
            href="mailto:privacy@devision.com"
            className="text-primary hover:underline"
          >
            privacy@devision.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}
