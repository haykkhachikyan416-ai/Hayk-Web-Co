import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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
            Get a Free Website Review
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
