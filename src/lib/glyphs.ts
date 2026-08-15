/**
 * U+2197 followed by VS15, the text-presentation selector.
 *
 * Bare ↗ defaults to emoji presentation on iOS, so the arrow rendered as a
 * blue-tiled emoji glyph instead of matching the surrounding type. The
 * selector forces the text form; `.glyph-text` in the stylesheet backs this
 * up for anywhere the selector alone is not honoured.
 */
export const ARROW_UP_RIGHT = '↗︎'
