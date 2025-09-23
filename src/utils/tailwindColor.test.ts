import chroma from 'chroma-js'
import { isObject } from 'lodash-es'
import twColors from 'tailwindcss/colors'
import { describe, it, expect } from 'vitest'

type TailwindColorKey = Omit<
  typeof twColors,
  'black' | 'current' | 'inherit' | 'transparent' | 'white'
>

type ColorShade =
  | '25'
  | '100'
  | '150'
  | '200'
  | '250'
  | '300'
  | '350'
  | '400'
  | '450'
  | '50'
  | '500'
  | '550'
  | '600'
  | '650'
  | '700'
  | '750'
  | '800'
  | '850'
  | '900'
  | '950'

type ColorObject = { [key in ColorShade]: string }
type TailwindColor = { [K in keyof TailwindColorKey]: ColorObject }

function generateTailwindColor() {
  const hexCache = new Map<string, string>()

  const toHex = (value: string): string => {
    if (!hexCache.has(value)) {
      hexCache.set(value, chroma(value).hex())
    }
    return hexCache.get(value) || ''
  }

  const mixHex = (a: string, b: string, ratio = 0.5): string => chroma.mix(a, b, ratio).hex()

  const result = {} as TailwindColor

  for (const [colorName, colorValue] of Object.entries(twColors)) {
    if (!isObject(colorValue)) continue

    const entries = Object.entries(colorValue).filter(([shade]) => /^\d{2,3}$/.test(shade))
    const sortedShades = entries.sort((a, b) => Number(a[0]) - Number(b[0]))

    const colorObj: ColorObject = {} as ColorObject

    if (sortedShades.some(([shade]) => shade === '50')) {
      const hex50 = toHex(colorValue['50'])
      colorObj['25'] = mixHex('#ffffff', hex50)
    }

    for (let i = 0; i < sortedShades.length; i++) {
      const entry = sortedShades[i]
      if (!entry) continue
      const [shade, raw] = entry
      const shadeKey = shade as ColorShade
      colorObj[shadeKey] = toHex(raw)

      if (Number(shade) % 100 === 0 && i + 1 < sortedShades.length) {
        const nextEntry = sortedShades[i + 1]
        if (nextEntry) {
          const nextShade = nextEntry[0]
          const nextRaw = nextEntry[1]
          if (Number(nextShade) === Number(shade) + 100) {
            const midShade = `${Number(shade) + 50}` as ColorShade
            colorObj[midShade] = mixHex(toHex(raw), toHex(nextRaw))
          }
        }
      }
    }

    result[colorName as keyof TailwindColorKey] = colorObj
  }

  return result
}

const targetShades = ['25', '150', '250', '350', '450', '550', '650', '750', '850'] as const

function extractShades(colorObj: Record<string, Record<string, string>>) {
  const result: Record<string, Partial<Record<string, string>>> = {}

  for (const [colorName, shades] of Object.entries(colorObj)) {
    const extracted: Partial<Record<string, string>> = {}

    targetShades.forEach((shade) => {
      if (shades[shade]) {
        extracted[shade] = shades[shade]
      }
    })

    if (Object.keys(extracted).length > 0) {
      result[colorName] = extracted
    }
  }

  return result
}

describe('tailwindColor', () => {
  const twc = generateTailwindColor()

  it('should be defined', () => {
    expect(twc.blue[150]).not.toBeUndefined()
  })

  it('should have 25 shade', () => {
    expect(twc.blue['25']).not.toBeUndefined()
  })

  it('should have 150 shade', () => {
    expect(extractShades(twc).blue?.['150']).not.toBeUndefined()
  })

  it('should have not 200 shade', () => {
    expect(extractShades(twc).blue?.['200']).toBeUndefined()
  })
})
