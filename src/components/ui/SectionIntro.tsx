type SectionIntroProps = {
  eyebrow: string
  title: string
  body?: string
  inverted?: boolean
}

export function SectionIntro({ eyebrow, title, body, inverted }: SectionIntroProps) {
  return (
    <header className="section-intro" data-inverted={inverted}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </header>
  )
}
