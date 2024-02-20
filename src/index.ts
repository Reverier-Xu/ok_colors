export { logger } from './utils'
import plugin from 'tailwindcss/plugin'
import { colorClasses } from './defs'
import { OkwindGenerator } from './generator'

export const okwind = plugin(function ({ addBase, config }) {
  if (config('okwind')) {
    const okwindConfig = config('okwind')
    const themes = Object.keys(okwindConfig)
    for (const i of themes) {
      let themeGenerator = new OkwindGenerator(i, okwindConfig[i])
      addBase(themeGenerator.build())
    }
  }
}, {
  okwind: {
    cyber: {
      primary: 248,
      error: 24,
      warning: 48,
      success: 150,
      info: 248,
      secondary: 324,
      accent: 130,
      lightness: 0.64,
      chroma: 0.17,
      bgLight: 0.96,
      bgDark: 0.18,
      bgChroma: 0.015,
    }
  },
  theme: {
    extend: {
      colors: {
        ...colorClasses
      }
    }
  }
})
