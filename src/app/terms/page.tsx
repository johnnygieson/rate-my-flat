import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-ink-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-ink-400">Last updated: 30 April 2026</p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-ink-700 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">1. About these Terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) set out the rules for using Rate My
              Flat. By accessing or using this site, you agree to these Terms. If
              you don&apos;t agree, please don&apos;t use the site.
            </p>
            <p>
              These Terms apply to everyone who visits the site, and in particular
              to anyone who submits a review.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">2. Who we are</h2>
            <p>
              Rate My Flat is an independent review site for UK rental properties.
              We provide a platform for past tenants to share their honest
              experiences to help others make informed decisions about renting.
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
            <h2 className="text-lg font-semibold text-ink-900">3. Eligibility</h2>
            <p>
              You must be at least 16 years old to use Rate My Flat. By submitting
              a review, you confirm that you are writing about your own genuine,
              first-hand experience of a property. Reviews submitted on behalf of
              someone else, or about a property you did not personally rent or
              live in, are not permitted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">4. The service</h2>
            <p>
              Rate My Flat is a platform where past tenants can share their
              experiences of UK rental properties. We provide a space for those
              experiences to be read by others who are considering renting.
            </p>
            <p>
              We are not a letting agent, landlord, or property management
              service. We do not arrange or facilitate tenancies, and we are not
              party to any rental agreement.
            </p>
            <p>
              Importantly, <strong className="font-semibold text-ink-900">we do not verify the accuracy of any
              review</strong> published on the site. Reviews represent the personal views
              and experiences of the individuals who wrote them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">5. Your reviews</h2>
            <p>When you submit a review, you agree that it:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Reflects your own genuine, first-hand experience of the property
              </li>
              <li>
                Is honest — you are not making claims you cannot substantiate
              </li>
              <li>
                Does not contain personal information about landlords or letting
                agents beyond what is relevant to their professional role — no
                home addresses, personal phone numbers, or details about their
                family
              </li>
              <li>
                Is not unlawful, hateful, harassing, discriminatory, defamatory,
                or obscene
              </li>
              <li>Does not impersonate any person or organisation</li>
            </ul>
            <p>
              We may remove or edit any content at our sole discretion, without
              notice, if we believe it violates these Terms or is otherwise
              harmful to users or third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">6. Your licence to us</h2>
            <p>
              You keep ownership of the review you write. By submitting it, you
              grant Rate My Flat a non-exclusive, royalty-free, worldwide licence
              to display, reproduce, and distribute it as part of the service,
              including on any future versions of the site.
            </p>
            <p>
              If you ask us to remove your review, we will do so and your licence
              to us ends at that point.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">7. Disclaimer</h2>
            <p>
              Reviews on Rate My Flat are submitted by members of the public. We
              do not verify their accuracy, and we are not responsible for the
              content of any review. The views expressed are those of the reviewer
              alone.
            </p>
            <p>
              You should not rely on reviews as the sole basis for any decision
              about renting a property. Always carry out your own checks before
              signing a tenancy agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">8. Limitation of liability</h2>
            <p>
              To the extent permitted by UK law, Rate My Flat is provided
              &ldquo;as is&rdquo; without warranty of any kind, express or implied. We are not
              liable for any direct, indirect, or consequential loss arising from
              your use of the site or from any review published on it.
            </p>
            <p>
              Nothing in these Terms excludes or limits our liability for death or
              personal injury caused by negligence, fraud, or any other liability
              that cannot be excluded under UK law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">9. Takedown requests</h2>
            <p>
              If you are a landlord, letting agent, or other party who believes a
              review is false, defamatory, or in breach of these Terms, please
              email us at{" "}
              <a
                href="mailto:giesonjohn@gmail.com"
                className="text-brand-green-600 hover:underline"
              >
                giesonjohn@gmail.com
              </a>{" "}
              with the URL of the review and the specific reasons for your
              request. We will review all requests in good faith and aim to
              respond within 14 days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">10. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted
              on this page with an updated date. If you continue to use Rate My
              Flat after changes are posted, you accept the updated Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">11. Governing law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any
              disputes will be subject to the exclusive jurisdiction of the courts
              of England and Wales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-900">12. Contact</h2>
            <p>
              For any questions about these Terms, email us at{" "}
              <a
                href="mailto:giesonjohn@gmail.com"
                className="text-brand-green-600 hover:underline"
              >
                giesonjohn@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
