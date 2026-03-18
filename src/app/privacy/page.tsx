export const metadata = {
  title: "Privacy Policy - GhostCheck",
  description: "GhostCheck Privacy Policy - How we protect your data",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
        
        <p className="text-slate-600 mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Data We Collect</h2>
          <p className="text-slate-600 mb-4">
            GhostCheck collects minimal data necessary to provide subscription tracking services:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li><strong>Bank Transactions:</strong> Merchant names, transaction amounts, and dates from connected bank accounts via Plaid</li>
            <li><strong>Email Metadata:</strong> Subject lines and timestamps from Gmail (we never read email body content)</li>
            <li><strong>Account Information:</strong> Email address and name from Google OAuth</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">2. Data We Do NOT Collect</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Email body content - we only read headers for timestamps</li>
            <li>Bank account numbers or routing numbers</li>
            <li>Social Security Numbers or government IDs</li>
            <li>Passwords or PINs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">3. How We Use Your Data</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Identify recurring subscriptions from transaction history</li>
            <li>Track usage patterns from email engagement</li>
            <li>Calculate potential savings from cancelled subscriptions</li>
            <li>Alert you to unused subscriptions (ghosts)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">4. Data Security</h2>
          <p className="text-slate-600 mb-4">
            We implement industry-standard security measures:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>All data encrypted in transit (TLS 1.3)</li>
            <li>Tokens encrypted at rest using AES-256-GCM</li>
            <li>No sensitive data stored in plain text</li>
            <li>Regular security audits</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">5. Data Sharing</h2>
          <p className="text-slate-600">
            We <strong>never</strong> sell, rent, or share your personal data with third parties for marketing purposes. 
            We only share data with service providers necessary to operate the app (Plaid for banking, Google for OAuth).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">6. Your Rights</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Access your data at any time</li>
            <li>Request deletion of your account and all associated data</li>
            <li>Export your data in machine-readable format</li>
            <li>Revoke bank or email access at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">7. Contact Us</h2>
          <p className="text-slate-600">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@ghostcheck.app" className="text-blue-600 hover:underline">
              privacy@ghostcheck.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
