import chroma from 'chroma-js'
import { isObject, isEqual } from 'es-toolkit/compat'
import twColors from 'tailwindcss/colors'
import { describe, expect, it } from 'vitest'

type TailwindColorKey = Omit<
  typeof twColors,
  'black' | 'current' | 'inherit' | 'transparent' | 'white'
>

type ColorShade =
  | '25'
  | '50'
  | '75'
  | '100'
  | '150'
  | '200'
  | '250'
  | '300'
  | '350'
  | '400'
  | '450'
  | '500'
  | '550'
  | '600'
  | '650'
  | '700'
  | '750'
  | '800'
  | '825'
  | '850'
  | '900'
  | '925'
  | '950'

type TailwindColor = Record<keyof TailwindColorKey, Record<ColorShade, string>>

const extraSteps = [25, 75, 150, 250, 350, 450, 550, 650, 750, 825, 850, 925]

type MixMode = Parameters<typeof chroma.mix>[3]
type CssMode = Parameters<ReturnType<typeof chroma.mix>['css']>[0]

function extendTailwindCssColors(toHex: boolean, mixMode: MixMode): TailwindColor
function extendTailwindCssColors(mixMode: MixMode, cssMode: CssMode): TailwindColor
function extendTailwindCssColors(param1: boolean | MixMode, param2: MixMode | CssMode) {
  const result = {} as TailwindColor

  for (const [name, palette] of Object.entries(twColors)) {
    if (!isObject(palette)) continue

    const keys = Object.keys(palette)
      .map((k) => Number(k))
      .filter((k) => !Number.isNaN(k))
      .sort((a, b) => a - b)

    const newPalette: Record<string, string> = { ...palette }

    if (typeof param1 === 'boolean' && param1) {
      for (const key in newPalette) {
        if (newPalette[key]) {
          newPalette[key] = chroma(newPalette[key]).hex()
        }
      }
    }

    for (const step of extraSteps) {
      if (step === 25) {
        const fiftyColor = palette[50 as unknown as keyof typeof palette]
        if (fiftyColor) {
          const ratio = 0.5
          if (typeof param1 === 'boolean') {
            const mixed = chroma.mix('#ffffff', fiftyColor, ratio, param2 as MixMode)
            newPalette[step] = param1 ? mixed.hex() : mixed.css('oklch')
          } else {
            const mixed = chroma.mix('#ffffff', fiftyColor, ratio, param1)
            newPalette[step] = mixed.css(param2 as CssMode)
          }
        }
        continue
      }

      const lower = [...keys].reverse().find((k) => k <= step)
      const upper = keys.find((k) => k >= step)

      if (lower == null || upper == null || lower === upper) continue

      const lowerColor = palette[lower as unknown as keyof typeof palette]
      const upperColor = palette[upper as unknown as keyof typeof palette]
      const ratio = (step - lower) / (upper - lower)

      if (typeof param1 === 'boolean') {
        const mixed = chroma.mix(lowerColor, upperColor, ratio, param2 as MixMode)
        newPalette[step] = param1 ? mixed.hex() : mixed.css('oklch')
      } else {
        const mixed = chroma.mix(lowerColor, upperColor, ratio, param1)
        newPalette[step] = mixed.css(param2 as CssMode)
      }
    }

    result[name as keyof TailwindColor] = newPalette
  }
  return result
}

describe('tailwindColor', () => {
  const twc = extendTailwindCssColors('lch', 'oklch')
  const twc2 = extendTailwindCssColors(true, 'oklch')

  const twcKeys = [...Object.keys(twColors.blue), ...extraSteps.map(String)].sort(
    (a, b) => Number(a) - Number(b),
  )

  it('should color key be same', () => {
    expect(isEqual(Object.keys(twc.blue), twcKeys)).toBe(true)
  })

  it('should be defined', () => {
    expect(twc.blue[150]).not.toBeUndefined()
  })

  it('should have 25 shade with oklch', () => {
    expect(twc.blue['25']).includes('oklch')
  })

  it('should have 25 shade with hex', () => {
    expect(twc2.blue['25']).includes('#')
  })
})
