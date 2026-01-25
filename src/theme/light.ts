import { twColor, colorAlpha } from '@/utils/colors'

import type { GlobalThemeOverrides } from 'naive-ui'

const LIGHT = {
  textColorBase: twColor('neutral', 800),
  textColor1: twColor('neutral', 750),
  textColor2: twColor('neutral', 700),
  textColor3: twColor('neutral', 500),
  borderColor: twColor('neutral', 150),
  input: {
    color: twColor('neutral', 25),
    border: `1px solid ${twColor('neutral', 200)}`,
  },
}

export function baseLightThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      textColorBase: LIGHT.textColorBase,
      textColor1: LIGHT.textColor1,
      textColor2: LIGHT.textColor2,
      textColor3: LIGHT.textColor3,

      bodyColor: twColor('neutral', 25),

      borderColor: LIGHT.borderColor,

      cardColor: twColor('neutral', 25),

      hoverColor: twColor('neutral', 150),

      modalColor: twColor('neutral', 100),

      popoverColor: twColor('neutral', 25),

      closeIconColor: twColor('neutral', 500),
      closeColorHover: twColor('neutral', 200),
      closeIconColorPressed: twColor('neutral', 575),
      closeColorPressed: twColor('neutral', 250),

      scrollbarColor: twColor('neutral', 150),
      scrollbarColorHover: twColor('neutral', 200),

      infoColor: twColor('sky', 500),
      infoColorHover: twColor('sky', 525),
      infoColorPressed: twColor('sky', 500),
      infoColorSuppl: twColor('sky', 500),

      successColor: twColor('lime', 500),
      successColorHover: twColor('lime', 525),
      successColorPressed: twColor('lime', 500),
      successColorSuppl: twColor('lime', 500),

      warningColor: twColor('amber', 500),
      warningColorHover: twColor('amber', 525),
      warningColorPressed: twColor('amber', 500),
      warningColorSuppl: twColor('amber', 500),

      errorColor: twColor('rose', 500),
      errorColorHover: twColor('rose', 525),
      errorColorPressed: twColor('rose', 500),
      errorColorSuppl: twColor('rose', 500),
    },
    Alert: {
      titleTextColorSuccess: twColor('lime', 500),
      titleTextColorInfo: twColor('sky', 500),
      titleTextColorWarning: twColor('amber', 500),
      titleTextColorError: twColor('rose', 500),
      titleTextColor: twColor('neutral', 750),

      color: '#fff',
      contentTextColor: twColor('neutral', 650),

      ...closeIconColor(primaryColor),
    },
    Button: {
      textColorSuccess: twColor('lime', 25),
      textColorInfo: twColor('sky', 25),
      textColorWarning: twColor('amber', 25),
      textColorError: twColor('rose', 25),
    },
    Card: {
      borderColor: LIGHT.borderColor,
    },
    Checkbox: {
      common: {
        borderColor: twColor('neutral', 250),
      },
      colorDisabled: twColor('neutral', 100),
    },
    DataTable: {
      borderColor: LIGHT.borderColor,
      tdColor: twColor('neutral', 25),
      tdColorHover: twColor('neutral', 100),
      thColor: twColor('neutral', 75),
    },
    Divider: {
      color: twColor('neutral', 150),
    },
    Drawer: {
      footerBorderTop: `1px solid ${LIGHT.borderColor}`,
      headerBorderBottom: `1px solid ${LIGHT.borderColor}`,
      peers: {
        Scrollbar: {
          color: twColor('neutral', 300),
          colorHover: twColor('neutral', 350),
        },
      },
    },
    Input: {
      ...LIGHT.input,
    },
    Message: {
      textColorSuccess: twColor('lime', 500),
      textColorInfo: twColor('sky', 500),
      textColorWarning: twColor('amber', 500),
      textColorError: twColor('rose', 500),
      textColorLoading: primaryColor,

      colorSuccess: '#fff',
      colorInfo: '#fff',
      colorWarning: '#fff',
      colorError: '#fff',
      colorLoading: '#fff',

      ...closeIconColor(primaryColor),
    },
    Modal: {
      peers: {
        Scrollbar: {
          color: twColor('neutral', 350),
          colorHover: twColor('neutral', 300),
        },
      },
    },
    Notification: {
      peers: {
        Scrollbar: {
          color: twColor('neutral', 350),
          colorHover: twColor('neutral', 400),
        },
      },
    },
    Popover: {
      color: twColor('neutral', 25),
      textColor: LIGHT.textColor2,
    },
    Radio: {
      common: {
        borderColor: twColor('neutral', 250),
      },
    },
    Select: {
      peers: {
        InternalSelection: {
          ...LIGHT.input,
        },
        InternalSelectMenu: {
          actionDividerColor: twColor('neutral', 200),
          peers: {
            Scrollbar: {
              color: twColor('neutral', 150),
              colorHover: twColor('neutral', 200),
            },
          },
        },
      },
    },
    Slider: {
      indicatorColor: twColor('neutral', 25),
      indicatorTextColor: LIGHT.textColor2,
    },
    Upload: {
      draggerColor: twColor('neutral', 50),
    },
  }
}

function closeIconColor(primaryColor: string): GlobalThemeOverrides['Message'] {
  return {
    closeIconColorInfo: twColor('sky', 500),
    closeIconColorHoverInfo: twColor('sky', 525),
    closeIconColorPressedInfo: twColor('sky', 550),
    closeColorHoverInfo: colorAlpha(twColor('sky', 500), 0.16),
    closeColorPressedInfo: colorAlpha(twColor('sky', 500), 0.2),

    closeIconColorSuccess: twColor('lime', 500),
    closeIconColorHoverSuccess: twColor('lime', 525),
    closeIconColorPressedSuccess: twColor('lime', 550),
    closeColorHoverSuccess: colorAlpha(twColor('lime', 500), 0.16),
    closeColorPressedSuccess: colorAlpha(twColor('lime', 500), 0.2),

    closeIconColorWarning: twColor('amber', 500),
    closeIconColorHoverWarning: twColor('amber', 525),
    closeIconColorPressedWarning: twColor('amber', 550),
    closeColorHoverWarning: colorAlpha(twColor('amber', 500), 0.16),
    closeColorPressedWarning: colorAlpha(twColor('amber', 500), 0.2),

    closeIconColorError: twColor('rose', 500),
    closeIconColorHoverError: twColor('rose', 525),
    closeIconColorPressedError: twColor('rose', 550),
    closeColorHoverError: colorAlpha(twColor('rose', 500), 0.16),
    closeColorPressedError: colorAlpha(twColor('rose', 500), 0.2),

    closeIconColorLoading: primaryColor,
    closeIconColorHoverLoading: primaryColor,
    closeIconColorPressedLoading: primaryColor,
    closeColorHoverLoading: colorAlpha(primaryColor, 0.16),
    closeColorPressedLoading: colorAlpha(primaryColor, 0.2),
  }
}
