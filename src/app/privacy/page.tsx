import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="bg-bg px-4 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Early-version banner */}
        <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This is an early version. We&apos;re working on more comprehensive terms
          with legal review. Questions or concerns? Email{" "}
          <a
            href="mailto:giesonjohn@gmail.com"
            className="underline hover:text-amber-900"
          >
            giesonjohn@gmail.com
          </a>
          .
        </div>

        {/* Page header */}
        <div className="mb-10 border-b border-ink-200 pb-8">
          <h1 className="text-3xl font-bold text-ink-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-400">Last updated: 30 April 2026</p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-ink-700 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">1. About this Policy</h2>
            <p>
              This Privacy Policy explains how Rate My Flat collects, uses, and
              protects your personal information when you use our site. Please
              read it carefully — it&apos;s written in plain English and we&apos;ve tried
              to keep it short.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">2. Who we are</h2>
            <p>
              Rate My Flat is a UK-based review platform for rental properties.
              We are the data controller for the personal information collected
              through this site, which means we are responsible for deciding how
              it is used and kept safe.
            </p>
            <p>
              You can contact us at{" "}
              <a
                href="mailto:giesonjohn@gmail.com"
                className="text-brand-green-600 hover:underline"
              >
                giesonjohn@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">3. What information we collect</h2>

            <p className="font-medium text-ink-800">Information you provide</p>
            <p>
              When you submit a review, we collect the content of your review,
              your chosen display name (which does not need to be your real
              name), your ratings, the tenancy dates you provide, the rent
              amount, and the address of the property you are reviewing.
            </p>

            <p className="font-medium text-ink-800">Information collected automatically</p>
            <p>
              Our hosting and database providers (Vercel and Supabase) collect
              standard server logs as part of normal operations. These include
              your IP address, browser type, and request timestamps. We do not
              have direct access to these logs in day-to-day use; they exist for
              security and operational purposes.
            </p>

            <p className="font-medium text-ink-800">What we don&apos;t collect</p>
            <p>
              We do not use analytics platforms, advertising cookies, or any
              third-party tracking scripts. We do not require you to create an
              account or provide an email address to use the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">4. Why we collect your information</h2>
            <p>We process your information for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-ink-800">To display reviews</span> — so
                that others can read about rental experiences. This is the core
                purpose of the service and our lawful basis is legitimate
                interest in providing a useful public resource.
              </li>
              <li>
                <span className="font-medium text-ink-800">To prevent and investigate abuse</span> — to
                protect the integrity of the platform and its users. Our lawful
                basis is legitimate interest.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">5. Who we share it with</h2>
            <p>
              We use the following third-party services to operate Rate My Flat:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-ink-800">Supabase</span> — our database
                provider, hosted in the EU. Review data is stored here.
              </li>
              <li>
                <span className="font-medium text-ink-800">Vercel</span> — our web hosting
                provider. They serve the site and handle web traffic.
              </li>
            </ul>
            <p>
              We do not sell your data to any third parties, and we do not share
              it for advertising or marketing purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">6. International transfers</h2>
            <p>
              Your data is stored in the EU via Supabase. If we ever need to
              transfer data outside the UK or EU/EEA, we will put appropriate
              safeguards in place in line with UK GDPR requirements, such as
              using standard contractual clauses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">7. How long we keep your information</h2>
            <p>
              We retain reviews indefinitely so they remain useful to future
              renters. If you ask us to delete your review or any other personal
              information we hold about you, we will do so promptly — see Your
              rights below for how to get in touch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">8. Your rights under UK GDPR</h2>
            <p>You have the right to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-ink-800">Access</span> — request a copy
                of the personal information we hold about you
              </li>
              <li>
                <span className="font-medium text-ink-800">Rectification</span> — ask us
                to correct inaccurate information
              </li>
              <li>
                <span className="font-medium text-ink-800">Erasure</span> — ask us to
                delete your information
              </li>
              <li>
                <span className="font-medium text-ink-800">Restriction</span> — ask us to
                limit how we process your information in certain circumstances
              </li>
              <li>
                <span className="font-medium text-ink-800">Objection</span> — object to
                our processing where we rely on legitimate interest
              </li>
              <li>
                <span className="font-medium text-ink-800">Portability</span> — receive a
                copy of your information in a structured, machine-readable format
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:giesonjohn@gmail.com"
                className="text-brand-green-600 hover:underline"
              >
                giesonjohn@gmail.com
              </a>
              . We will respond within one calendar month.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">9. Cookies</h2>
            <p>
              Rate My Flat uses only the essential cookies needed for the site to
              function (for example, session handling). We do not set tracking,
              advertising, or analytics cookies, and we do not use any
              third-party cookie scripts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">10. Children</h2>
            <p>
              Rate My Flat is not directed at people under 16. We do not
              knowingly collect personal information from anyone under 16. If you
              believe a child has submitted a review, please contact us and we
              will remove it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">11. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we
              will update the &ldquo;Last updated&rdquo; date at the top of this page. We
              encourage you to check back periodically.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">12. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or want to exercise
              your rights, email us at{" "}
              <a
                href="mailto:giesonjohn@gmail.com"
                className="text-brand-green-600 hover:underline"
              >
                giesonjohn@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">13. Complaints</h2>
            <p>
              If you are unhappy with how we have handled your personal
              information, you have the right to complain to the UK Information
              Commissioner&apos;s Office (ICO). You can find out more at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-green-600 hover:underline"
              >
                ico.org.uk
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
