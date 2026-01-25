import { twColor, colorAlpha } from '@/utils/colors'

import type { GlobalThemeOverrides } from 'naive-ui'

const DARK = {
  baseColor: twColor('neutral', 275),
  textColorBase: twColor('neutral', 275),
  textColor1: twColor('neutral', 375),
  textColor2: twColor('neutral', 375),
  textColor3: twColor('neutral', 450),
  borderColor: twColor('neutral', 800),
  input: {
    color: twColor('neutral', 800),
    border: `1px solid ${twColor('neutral', 750)}`,
  },
}

export function baseDarkThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      baseColor: DARK.baseColor,

      textColorBase: DARK.textColorBase,
      textColor1: DARK.textColor1,
      textColor2: DARK.textColor2,
      textColor3: DARK.textColor3,

      bodyColor: twColor('neutral', 925),

      borderColor: DARK.borderColor,

      cardColor: twColor('neutral', 900),

      hoverColor: twColor('neutral', 650),

      modalColor: twColor('neutral', 800),

      popoverColor: twColor('neutral', 775),

      closeIconColor: twColor('neutral', 450),
      closeColorHover: twColor('neutral', 700),
      closeIconColorPressed: twColor('neutral', 400),
      closeColorPressed: twColor('neutral', 650),

      scrollbarColor: twColor('neutral', 800),
      scrollbarColorHover: twColor('neutral', 750),

      infoColor: twColor('sky', 600),
      infoColorHover: twColor('sky', 625),
      infoColorPressed: twColor('sky', 600),
      infoColorSuppl: twColor('sky', 600),

      successColor: twColor('lime', 600),
      successColorHover: twColor('lime', 625),
      successColorPressed: twColor('lime', 600),
      successColorSuppl: twColor('lime', 600),

      warningColor: twColor('amber', 600),
      warningColorHover: twColor('amber', 625),
      warningColorPressed: twColor('amber', 600),
      warningColorSuppl: twColor('amber', 600),

      errorColor: twColor('rose', 600),
      errorColorHover: twColor('rose', 625),
      errorColorPressed: twColor('rose', 600),
      errorColorSuppl: twColor('rose', 600),
    },
    Alert: {
      titleTextColorSuccess: twColor('lime', 525),
      titleTextColorInfo: twColor('sky', 525),
      titleTextColorWarning: twColor('amber', 525),
      titleTextColorError: twColor('rose', 525),
      titleTextColor: twColor('neutral', 350),

      color: twColor('neutral', 825),

      contentTextColorSuccess: twColor('neutral', 350),
      contentTextColorInfo: twColor('neutral', 350),
      contentTextColorWarning: twColor('neutral', 350),
      contentTextColorError: twColor('neutral', 350),
      contentTextColor: twColor('neutral', 400),

      ...closeIconColor(primaryColor),
    },
    Button: {
      textColorSuccess: twColor('lime', 100),
      textColorInfo: twColor('sky', 100),
      textColorWarning: twColor('amber', 100),
      textColorError: twColor('rose', 100),
    },
    Card: {
      borderColor: DARK.borderColor,
    },
    Checkbox: {
      common: {
        borderColor: twColor('neutral', 700),
      },
    },
    DataTable: {
      borderColor: DARK.borderColor,
      tdColor: twColor('neutral', 900),
      tdColorHover: twColor('neutral', 825),
      thColor: twColor('neutral', 850),
    },
    DatePicker: {
      peers: {
        Button: {
          border: `1px solid ${twColor('neutral', 650)}`,
        },
        TimePicker: {
          panelColor: twColor('neutral', 700),
          peers: {
            Button: {
              border: `1px solid ${twColor('neutral', 550)}`,
            },
            Input: {
              color: twColor('neutral', 700),
              border: `1px solid ${twColor('neutral', 650)}`,
            },
            Scrollbar: {
              color: twColor('neutral', 600),
              colorHover: twColor('neutral', 550),
            },
          },
        },
      },
    },
    Dialog: {
      closeIconColor: twColor('neutral', 450),
      closeColorHover: twColor('neutral', 725),
      closeIconColorPressed: twColor('neutral', 400),
      closeColorPressed: twColor('neutral', 700),
    },
    Divider: {
      color: twColor('neutral', 750),
    },
    Drawer: {
      footerBorderTop: `1px solid ${twColor('neutral', 750)}`,
      headerBorderBottom: `1px solid ${twColor('neutral', 750)}`,
      peers: {
        Scrollbar: {
          color: twColor('neutral', 750),
          colorHover: twColor('neutral', 700),
        },
      },
    },
    Input: {
      ...DARK.input,
    },
    Menu: {
      itemColorHover: twColor('neutral', 800),
    },
    Message: {
      textColorSuccess: twColor('lime', 525),
      textColorInfo: twColor('sky', 525),
      textColorWarning: twColor('amber', 525),
      textColorError: twColor('rose', 525),
      textColorLoading: primaryColor,

      colorSuccess: twColor('neutral', 750),
      colorInfo: twColor('neutral', 750),
      colorWarning: twColor('neutral', 750),
      colorError: twColor('neutral', 750),
      colorLoading: twColor('neutral', 750),

      ...closeIconColor(primaryColor),
    },
    Modal: {
      peers: {
        Scrollbar: {
          color: twColor('neutral', 800),
          colorHover: twColor('neutral', 750),
        },
      },
    },
    Notification: {
      peers: {
        Scrollbar: {
          color: twColor('neutral', 750),
          colorHover: twColor('neutral', 700),
        },
      },
    },
    Radio: {
      common: {
        borderColor: twColor('neutral', 700),
      },
    },
    Select: {
      peers: {
        InternalSelection: {
          ...DARK.input,
        },
        InternalSelectMenu: {
          peers: {
            Scrollbar: {
              color: twColor('neutral', 700),
              colorHover: twColor('neutral', 650),
            },
          },
        },
      },
    },
    Upload: {
      draggerColor: twColor('neutral', 850),
    },
  }
}

function closeIconColor(primaryColor: string): GlobalThemeOverrides['Message'] {
  return {
    closeIconColorSuccess: twColor('lime', 600),
    closeIconColorHoverSuccess: twColor('lime', 550),
    closeIconColorPressedSuccess: twColor('lime', 525),
    closeColorHoverSuccess: colorAlpha(twColor('lime', 600), 0.2),
    closeColorPressedSuccess: colorAlpha(twColor('lime', 600), 0.3),

    closeIconColorInfo: twColor('sky', 600),
    closeIconColorHoverInfo: twColor('sky', 550),
    closeIconColorPressedInfo: twColor('sky', 525),
    closeColorHoverInfo: colorAlpha(twColor('sky', 600), 0.2),
    closeColorPressedInfo: colorAlpha(twColor('sky', 600), 0.3),

    closeIconColorWarning: twColor('amber', 600),
    closeIconColorHoverWarning: twColor('amber', 550),
    closeIconColorPressedWarning: twColor('amber', 525),
    closeColorHoverWarning: colorAlpha(twColor('amber', 600), 0.2),
    closeColorPressedWarning: colorAlpha(twColor('amber', 600), 0.3),

    closeIconColorError: twColor('rose', 600),
    closeIconColorHoverError: twColor('rose', 550),
    closeIconColorPressedError: twColor('rose', 525),
    closeColorHoverError: colorAlpha(twColor('rose', 600), 0.2),
    closeColorPressedError: colorAlpha(twColor('rose', 600), 0.3),

    closeIconColorLoading: primaryColor,
    closeIconColorHoverLoading: primaryColor,
    closeIconColorPressedLoading: primaryColor,
    closeColorHoverLoading: colorAlpha(primaryColor, 0.2),
    closeColorPressedLoading: colorAlpha(primaryColor, 0.3),
  }
}
