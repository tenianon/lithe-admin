import chroma from 'chroma-js'

import twc from '@/utils/tailwindColor'

import type { GlobalThemeOverrides } from 'naive-ui'

export function cc(primaryColor: string, color1: string, color2: string) {
  return chroma.contrast(primaryColor, '#fff') > 4.4 ? color1 : color2
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

export function commonThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      actionColor: '',

      borderRadius: '4px',

      primaryColor,
      primaryColorHover: cdh(primaryColor, 0.1),
      primaryColorPressed: cdh(primaryColor, 0.2),
      primaryColorSuppl: primaryColor,

      scrollbarBorderRadius: '0',
    },
    Button: {
      textColorPrimary: cc(primaryColor, twc.neutral[150], twc.neutral[950]),
      textColorHoverPrimary: cdh(cc(primaryColor, twc.neutral[150], twc.neutral[950]), 0.1),
      textColorPressedPrimary: cdh(cc(primaryColor, twc.neutral[150], twc.neutral[950]), 0.2),
      textColorSupplPrimary: cc(primaryColor, twc.neutral[150], twc.neutral[950]),
      textColorFocusPrimary: cc(primaryColor, twc.neutral[150], twc.neutral[950]),
    },
    Checkbox: {
      checkMarkColor: cc(primaryColor, twc.neutral[150], twc.neutral[800]),
    },
    Dialog: {
      iconSize: '24px',
      iconMargin: '0 8px 0 0',
    },
    Drawer: {
      borderRadius: 0,
    },
    Message: {
      iconMargin: '0 6px 0 0',
      padding: '10px 18px',
    },
    Popconfirm: {
      iconSize: '20px',
    },
    Scrollbar: {
      railInsetHorizontalBottom: 'auto 0px 0px 0px',
      railInsetVerticalRight: '0px 0px 0px auto',
    },
  }
}
