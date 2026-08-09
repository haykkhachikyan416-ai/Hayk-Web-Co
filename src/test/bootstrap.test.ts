import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('application bootstrap fallback', () => {
  it('shows a useful message when the React module cannot start', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

    expect(html).toContain('class="boot-fallback"')
    expect(html).toContain('The website could not start in this browser.')
    expect(html).toContain('<noscript>')
  })
})
