import { Color, blend, converter, displayable, wcagContrast } from 'culori'
import picocolors from 'picocolors'

const oklch = converter('oklch')

export enum LogLevel {
  ERROR,
  WARN,
  INFO,
}

class Logger {
  private readonly prefix: string
  private level = LogLevel.INFO
  constructor(prefix: string) {
    this.prefix = prefix
  }

  public info(...data: any[]): void {
    if (this.level < LogLevel.INFO) return
    console.info(`${picocolors.green('[*]')} ${this.prefix}`, ...data)
  }

  public warn(...data: any[]): void {
    if (this.level < LogLevel.WARN) return
    console.warn(`${picocolors.yellow('[!]')} ${this.prefix}`, ...data)
  }

  public error(...data: any[]): void {
    if (this.level < LogLevel.ERROR) return
    console.error(`${picocolors.red('[x]')} ${this.prefix}`, ...data)
  }

  public setLevel(level: LogLevel): void {
    this.level = level
  }
}

export const logger = new Logger('okwind')

export function convertToOklch(color: string | Color) {
  isDisplayable(color)
  return oklch(color)
}

export function convertToRgb(color: string | Color) {
  isDisplayable(color)
  return converter('rgb')(color)
}

export function isDisplayable(color: string | Color) {
  const ok = displayable(color)
  if (!ok) {
    logger.warn(`Color \`${color}\` is not displayable at some monitors.`)
    logger.warn(`Please ensure your color config is suitable for all devices.`)
    logger.warn(`For more information, see https://oklch.com/`)
  }
  return ok
}

export function isDark(color: string | Color) {
  if (wcagContrast(color, 'black') < wcagContrast(color, 'white')) return true
  return false
}

export function blendColors(color1: string | Color, color2: string | Color) {
  return blend([color1, color2], 'screen')
}
