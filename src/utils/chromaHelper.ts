import chroma from 'chroma-js'

import twc from '@/utils/tailwindColor'

export function ccAPCA(
  backgroundColor: string,
  color1 = '#ffffff',
  color2 = '#000000',
  bodyColor?: string,
  isDark?: boolean,
) {
  if (!bodyColor) {
    bodyColor = isDark ? twc.neutral[950] : twc.neutral[25]
  }

  const cBackgroundColor = chroma(backgroundColor)
  const cBodyColor = chroma(bodyColor)

  const actualDisplayColor = chroma.mix(
    cBackgroundColor.alpha(1),
    cBodyColor,
    1 - cBackgroundColor.alpha(),
    'rgb',
  )

  const contrastWithLight = Math.abs(chroma.contrastAPCA(color1, actualDisplayColor))
  const contrastWithDark = Math.abs(chroma.contrastAPCA(color2, actualDisplayColor))

  return contrastWithLight > contrastWithDark ? color1 : color2
}

export function cah(color: string, value: number) {
  return chroma(color).alpha(value).hex()
}

export function cbh(color: string, value: number) {
  return chroma(color).brighten(value).hex()
}

export function cdh(color: string, value: number) {
  return chroma(color).darken(value).hex()
}

export function cmh(color1: string, color2: string, ratio: number) {
  return chroma.mix(color1, color2, ratio).hex()
}
