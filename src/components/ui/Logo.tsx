import { Link } from 'react-router-dom'

type LogoProps = { inverted?: boolean }

export function Logo({ inverted = false }: LogoProps) {
  return (
    <Link className="brand-logo" to="/" aria-label="HAYK WEB CO. home">
      <img
        className="brand-logo__full"
        src={inverted ? '/brand/hayk-web-co-dark.svg' : '/brand/hayk-web-co-light.svg'}
        alt="HAYK WEB CO."
        width="280"
        height="60"
      />
      <img
        className="brand-logo__mark"
        src={inverted ? '/brand/hw-monogram-dark.svg' : '/brand/hw-monogram-light.svg'}
        alt=""
        width="48"
        height="45"
      />
    </Link>
  )
}
