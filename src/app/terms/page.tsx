export const metadata = {
  title: "Terms of Service - GhostCheck",
  description: "GhostCheck Terms of Service",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Terms of Service</h1>
        
        <p className="text-slate-600 mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing and using GhostCheck, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">2. Service Description</h2>
          <p className="text-slate-600 mb-4">
            GhostCheck is a subscription management tool that helps users identify and manage recurring subscriptions. 
            The service analyzes bank transactions and email data to provide insights about subscription usage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Maintain the security of your account credentials</li>
            <li>Provide accurate information when connecting bank accounts</li>
            <li>Review subscription cancellations independently before confirming</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">4. Disclaimer of Warranties</h2>
          <p className="text-slate-600 mb-4">
            GhostCheck is provided &quot;as is&quot; without warranty of any kind. While we strive for accuracy:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>We do not guarantee all subscriptions will be detected</li>
            <li>We do not guarantee cancellation requests will be processed</li>
            <li>We are not responsible for charges from third-party services</li>
            <li>Users should independently verify all subscription status</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">5. Limitation of Liability</h2>
          <p className="text-slate-600 mb-4">
            GhostCheck shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
            resulting from:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Your use or inability to use the service</li>
            <li>Any unauthorized access to or use of our servers</li>
            <li>Any interruption or cessation of transmission to or from the service</li>
            <li>Any bugs, viruses, or the like that may be transmitted through the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">6. Subscription Cancellation</h2>
          <p className="text-slate-600 mb-4">
            <strong>Important:</strong> GhostCheck provides information and tools to help identify subscriptions, 
            but we do not process actual cancellations. Users must:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Manually cancel subscriptions through the service provider website</li>
            <li>Verify cancellation with their bank or credit card statement</li>
            <li>Contact the subscription provider directly for confirmation</li>
            <li>Follow up if charges continue after cancellation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">7. Indemnification</h2>
          <p className="text-slate-600">
            You agree to indemnify, defend, and hold harmless GhostCheck and its officers, directors, employees, 
            and agents from any and all claims, damages, losses, liabilities, costs, or expenses arising out of 
            or relating to your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">8. Termination</h2>
          <p className="text-slate-600">
            We may terminate or suspend your access to GhostCheck immediately, without prior notice or liability, 
            for any reason, including breach of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">9. Contact</h2>
          <p className="text-slate-600">
            For questions about these Terms, contact us at{" "}
            <a href="mailto:legal@ghostcheck.app" className="text-blue-600 hover:underline">
              legal@ghostcheck.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
