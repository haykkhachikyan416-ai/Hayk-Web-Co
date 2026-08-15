import { Seo } from '../components/Seo'
import { site } from '../content/site'

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy"
        description="How HAYK WEB CO. handles information submitted through this website."
        path="/privacy"
      />
      <article className="legal-page shell">
        <p className="eyebrow">Privacy</p>
        <h1>A clear, limited privacy policy.</h1>
        <h2>Information you provide</h2>
        <p>
          When you use the contact form, the information you enter is used to review and respond to
          your inquiry.
        </p>
        <h2>How information is used</h2>
        <p>
          Inquiry details are not sold. They may be processed by the email and hosting providers
          needed to deliver and secure the service.
        </p>
        <h2>Data choices</h2>
        {/* Pulled from site content so it cannot drift out of sync again. */}
        <p>
          You may request access, correction, or deletion by emailing{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </article>
    </>
  )
}
