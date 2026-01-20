import { colorAPCA, colorAlpha } from '@/utils/colors'
import { twColor } from '@/utils/colors'

import type { GlobalThemeOverrides } from 'naive-ui'

const BASE = {
  fontWeight: '400',
}

export function commonThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      actionColor: '',
      borderRadius: '4px',
      primaryColor,
      primaryColorHover: colorAlpha(primaryColor, 0.9),
      primaryColorPressed: colorAlpha(primaryColor, 0.86),
      primaryColorSuppl: primaryColor,

      scrollbarBorderRadius: '0',
    },
    Alert: {
      titleFontWeight: BASE.fontWeight,
    },
    Button: {
      textColorPrimary: colorAPCA(primaryColor, twColor('neutral', 150), twColor('neutral', 850)),
      textColorHoverPrimary: colorAPCA(
        primaryColor,
        twColor('neutral', 150),
        twColor('neutral', 850),
      ),
      textColorPressedPrimary: colorAPCA(
        primaryColor,
        twColor('neutral', 150),
        twColor('neutral', 850),
      ),

      textColorSupplPrimary: colorAPCA(
        primaryColor,
        twColor('neutral', 150),
        twColor('neutral', 850),
      ),
      textColorFocusPrimary: colorAPCA(
        primaryColor,
        twColor('neutral', 150),
        twColor('neutral', 850),
      ),
    },
    Card: {
      titleFontWeight: BASE.fontWeight,
    },
    Checkbox: {
      checkMarkColor: colorAPCA(primaryColor, twColor('neutral', 150), twColor('neutral', 800)),
    },
    Dialog: {
      iconSize: '24px',
      iconMargin: '0 8px 0 0',
      titleFontWeight: BASE.fontWeight,
    },
    Divider: {
      fontWeight: BASE.fontWeight,
    },
    Drawer: {
      borderRadius: 0,
      titleFontWeight: '400',
    },
    Dropdown: {
      padding: '6px 2px',
    },
    Menu: {
      peers: {
        Dropdown: {
          padding: '6px 2px',
        },
      },
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
