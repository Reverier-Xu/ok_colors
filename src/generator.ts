import { Color, interpolate } from "culori"
import { convertToOklch, isDark } from "./utils"

export type OkwindTheme = {
  primary: number
  error: number
  warning: number
  success: number
  info: number
  secondary: number
  accent: number
  lightness: number
  chroma: number
  bgLight: number
  bgDark: number
  bgChroma: number
}

const defaultTheme: OkwindTheme = {
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

export class OkwindGenerator {
  private theme: OkwindTheme
  private name: string
  public constructor(n: string, t: Partial<OkwindTheme>) {
    this.name = n
    this.theme = { ...defaultTheme, ...t }
  }

  private generateForegroundColor(color: Color) {
    return interpolate(
      [color, isDark(color) ? "white" : "black"],
      "oklch"
    )(0.9)
  }

  private generateLightTheme() {
    const themeColorKeys = ["primary", "error", "warning", "success", "info", "secondary", "accent"] as const
    let resultObj: Map<string, string> = new Map()
    for (const key of themeColorKeys) {
      const bgColor = convertToOklch(`oklch(${this.theme.lightness} ${this.theme.chroma} ${this.theme[key]})`)!
      const contentColor = this.generateForegroundColor(bgColor)
      resultObj.set(`--${key}`, `${bgColor.l} ${bgColor.c} ${bgColor.h}`)
      resultObj.set(`--${key}-content`, `${contentColor.l} ${contentColor.c} ${contentColor.h}`)
    }
    const baseColor = convertToOklch(`oklch(${this.theme.bgLight} ${this.theme.bgChroma} ${this.theme.primary})`)!
    const baseContentColor = this.generateForegroundColor(baseColor)
    resultObj.set(`--base`, `${baseColor.l} ${baseColor.c} ${baseColor.h}`)
    resultObj.set(`--base-content`, `${baseContentColor.l} ${baseContentColor.c} ${baseContentColor.h}`)
    return resultObj
  }

  private generateDarkTheme() {
    let resultObj: Map<string, string> = new Map()
    const baseColor = convertToOklch(`oklch(${this.theme.bgDark} ${this.theme.bgChroma} ${this.theme.primary})`)!
    const baseContentColor = this.generateForegroundColor(baseColor)
    resultObj.set(`--base`, `${baseColor.l} ${baseColor.c} ${baseColor.h}`)
    resultObj.set(`--base-content`, `${baseContentColor.l} ${baseContentColor.c} ${baseContentColor.h}`)

    const baseLight = convertToOklch(`oklch(${this.theme.bgDark} 0 0)`)!

    const themeColorKeys = ["primary", "error", "warning", "success", "info", "secondary", "accent"] as const
    for (const key of themeColorKeys) {
      let bgColor = convertToOklch(`oklch(${this.theme.lightness} ${this.theme.chroma} ${this.theme[key]})`)!
      let opacity = 1 - (bgColor.l - 0.64) / 1.618
      bgColor = interpolate([baseLight, bgColor], "oklch")(opacity)
      const contentColor = this.generateForegroundColor(bgColor)
      resultObj.set(`--${key}`, `${bgColor.l} ${bgColor.c} ${bgColor.h}`)
      resultObj.set(`--${key}-content`, `${contentColor.l} ${contentColor.c} ${contentColor.h}`)
    }
    return resultObj
  }

  public build() {
    let lightTheme = this.generateLightTheme()
    let darkTheme = this.generateDarkTheme()
    return {
      [`[data-theme=${this.name}-light]`]: Object.fromEntries(lightTheme),
      [`[data-theme=${this.name}-dark]`]: Object.fromEntries(darkTheme),

      [`:root:has(input.theme-controller[value=${this.name}-light]:checked)`]: Object.fromEntries(lightTheme),
      [`:root:has(input.theme-controller[value=${this.name}-dark]:checked)`]: Object.fromEntries(darkTheme),
    }
  }
}
