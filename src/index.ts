export { logger } from './utils'
import plugin from 'tailwindcss/plugin'
import { colorUtilities } from './defs'

export const okwind = plugin(function ({ addBase, addUtilities, theme }) {
  addUtilities(colorUtilities)
  addBase({})
  theme
}, {
  theme: {
    ret2shell: {
      primary: 248,
      error: 24,
      warning: 48,
      success: 150,
      info: 248,
      secondary: 324,
      accent: 130,
      lightness: 0.64,
      chroma: 0.17,
    }
  }
})
