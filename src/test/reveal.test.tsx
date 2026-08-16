import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal } from '../components/ui/Reveal'

describe('Reveal', () => {
  it('does not hide content while waiting for viewport observation', () => {
    render(
      <Reveal className="test-reveal">
        <p>Always available</p>
      </Reveal>,
    )

    const wrapper = screen.getByText('Always available').parentElement
    expect(wrapper).toHaveClass('test-reveal')
    expect(wrapper).toHaveAttribute('data-reveal', 'true')
    expect(wrapper).not.toHaveStyle({ opacity: '0' })
  })
})
