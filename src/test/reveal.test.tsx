import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal } from '../components/ui/Reveal'

describe('Reveal', () => {
  // The entrance is CSS scroll-driven, so there is nothing for JavaScript to
  // wait on: the content is rendered in place and the stylesheet decides.
  it('never hides content with inline styles', () => {
    render(
      <Reveal className="test-reveal">
        <p>Always available</p>
      </Reveal>,
    )

    const wrapper = screen.getByText('Always available').parentElement
    expect(wrapper).toHaveClass('test-reveal')
    expect(wrapper).toHaveAttribute('data-reveal', 'rise')
    expect(wrapper).not.toHaveStyle({ opacity: '0' })
    expect(wrapper?.getAttribute('style') ?? '').not.toMatch(/opacity|transform|clip/)
  })
})
