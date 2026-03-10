export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 pt-24 pb-16 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-10 pb-10 border-b border-neutral-100 dark:border-neutral-800">
          Last updated: March 10, 2026
        </p>

        <div className="space-y-8 text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using PrepMirrors, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any of these terms, you are prohibited from
              using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <p className="mb-4">
              Permission is granted to temporarily access the materials
              (information or software) on PrepMirrors' website for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>
                Use the materials for any commercial purpose, or for any public
                display (commercial or non-commercial);
              </li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on PrepMirrors' website;
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials; or
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
              3. Subscriptions and Payments
            </h2>
            <p>
              Some features of the Service are billed on a subscription basis.
              You will be billed in advance on a recurring and periodic basis
              (such as monthly or annually). At the end of each period, your
              subscription will automatically renew under the exact same
              conditions unless you cancel it or PrepMirrors cancels it.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
              4. Disclaimer
            </h2>
            <p>
              The materials on PrepMirrors' website are provided on an 'as is'
              basis. PrepMirrors makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
              5. Limitations
            </h2>
            <p>
              In no event shall PrepMirrors or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on PrepMirrors' website, even if
              PrepMirrors or a PrepMirrors authorized representative has been
              notified orally or in writing of the possibility of such damage.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
