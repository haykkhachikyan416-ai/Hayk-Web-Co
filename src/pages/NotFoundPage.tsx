import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The requested page could not be found."
        path="/404"
        noIndex
      />
      <section className="not-found">
        <div className="shell">
          <p className="error-code">404 / ROUTE NOT FOUND</p>
          <h1>This page missed the route.</h1>
          <p>The link may have changed, but the way back is clear.</p>
          <Link className="button" to="/">
            <ArrowLeft size={18} />
            Return home
          </Link>
        </div>
      </section>
    </>
  )
}
