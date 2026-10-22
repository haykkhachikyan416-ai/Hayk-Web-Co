import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'

export function PageCta({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <section className="page-cta">
      <div className="shell page-cta__inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div>
          <p>{body}</p>
          <Link className="button" to="/contact">
            {site.primaryCta.label}
            <ArrowUpRight size={18} />
          </Link>
          <p className="cta-promise">{site.responsePromise}</p>
        </div>
      </div>
    </section>
  )
}
