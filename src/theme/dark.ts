import { cbh, cdh, cah, cmh } from '@/utils/chromaHelper'
import twc from '@/utils/tailwindColor'

import type { GlobalThemeOverrides } from 'naive-ui'

const DARK = {
  baseColor: twc.neutral[250],
  textColorBase: twc.neutral[250],
  textColor1: twc.neutral[350],
  textColor2: twc.neutral[350],
  textColor3: twc.neutral[450],
  borderColor: twc.neutral[800],
  input: {
    color: twc.neutral[800],
    border: `1px solid ${twc.neutral[750]}`,
  },
}

const closeIconColor = (primaryColor: string) => {
  return {
    closeIconColorSuccess: twc.lime[600],
    closeIconColorInfo: twc.sky[600],
    closeIconColorWarning: twc.amber[600],
    closeIconColorError: twc.pink[600],
    closeIconColorLoading: primaryColor,

    closeColorHoverSuccess: cah(twc.lime[500], 0.1),
    closeIconColorHoverSuccess: cdh(twc.lime[500], 0.2),
    closeColorPressedSuccess: cah(twc.lime[500], 0.16),
    closeIconColorPressedSuccess: cdh(twc.lime[500], 0.6),

    closeColorHoverInfo: cah(twc.sky[500], 0.1),
    closeIconColorHoverInfo: cdh(twc.sky[500], 0.2),
    closeColorPressedInfo: cah(twc.sky[500], 0.16),
    closeIconColorPressedInfo: cdh(twc.sky[500], 0.6),

    closeColorHoverWarning: cah(twc.amber[500], 0.1),
    closeIconColorHoverWarning: cdh(twc.amber[500], 0.2),
    closeColorPressedWarning: cah(twc.amber[500], 0.16),
    closeIconColorPressedWarning: cdh(twc.amber[500], 0.6),

    closeColorHoverError: cah(twc.pink[500], 0.14),
    closeIconColorHoverError: cdh(twc.pink[500], 0.2),
    closeColorPressedError: cah(twc.pink[500], 0.16),
    closeIconColorPressedError: cdh(twc.pink[500], 0.6),

    closeColorHoverLoading: cah(primaryColor, 0.14),
    closeIconColorHoverLoading: cdh(primaryColor, 0.2),
    closeColorPressedLoading: cah(primaryColor, 0.2),
    closeIconColorPressedLoading: cdh(primaryColor, 0.6),
  }
}

export function baseDarkThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      baseColor: DARK.baseColor,

      textColorBase: DARK.textColorBase,

      textColor1: DARK.textColor1,

      textColor2: DARK.textColor2,

      textColor3: DARK.textColor3,

      bodyColor: twc.neutral[950],

      borderColor: DARK.borderColor,

      cardColor: twc.neutral[900],

      hoverColor: twc.neutral[650],

      modalColor: twc.neutral[800],

      popoverColor: twc.neutral[750],

      scrollbarColor: twc.neutral[800],
      scrollbarColorHover: twc.neutral[750],

      closeIconColor: cbh(twc.neutral[400], 0.2),
      closeColorHover: cah(twc.neutral[400], 0.1),
      closeIconColorPressed: twc.neutral[400],
      closeColorPressed: cah(twc.neutral[400], 0.14),

      infoColor: twc.sky[650],
      infoColorHover: cdh(twc.sky[650], 0.1),
      infoColorPressed: cdh(twc.sky[650], 0.2),
      infoColorSuppl: twc.sky[650],

      successColor: twc.lime[650],
      successColorHover: cdh(twc.lime[650], 0.1),
      successColorPressed: cdh(twc.lime[650], 0.2),
      successColorSuppl: twc.lime[650],

      warningColor: twc.amber[650],
      warningColorHover: cdh(twc.amber[650], 0.1),
      warningColorPressed: cdh(twc.amber[650], 0.2),
      warningColorSuppl: twc.amber[650],

      errorColor: twc.pink[650],
      errorColorHover: cdh(twc.pink[650], 0.1),
      errorColorPressed: cdh(twc.pink[650], 0.2),
      errorColorSuppl: twc.pink[650],
    },
    Alert: {
      ...closeIconColor(primaryColor),
    },
    Button: {
      textColorSuccess: twc.lime[50],

      textColorInfo: twc.sky[50],

      textColorWarning: twc.amber[50],

      textColorError: twc.pink[50],
    },
    Card: {
      borderColor: DARK.borderColor,
    },
    Checkbox: {
      common: {
        borderColor: twc.neutral[700],
      },
    },
    DataTable: {
      borderColor: DARK.borderColor,
      tdColor: twc.neutral[900],
      tdColorHover: cbh(twc.neutral[850], 0.06),
      thColor: twc.neutral[850],
    },
    DatePicker: {
      peers: {
        Button: {
          border: `1px solid ${twc.neutral[650]}`,
        },
        TimePicker: {
          panelColor: twc.neutral[700],
          peers: {
            Button: {
              border: `1px solid ${twc.neutral[550]}`,
            },
            Input: {
              color: twc.neutral[700],
              border: `1px solid ${twc.neutral[650]}`,
            },
            Scrollbar: {
              color: twc.neutral[600],
              colorHover: twc.neutral[550],
            },
          },
        },
      },
    },
    Divider: {
      color: cdh(twc.neutral[750], 0.24),
    },
    Drawer: {
      footerBorderTop: `1px solid ${twc.neutral[750]}`,
      headerBorderBottom: `1px solid ${twc.neutral[750]}`,
      peers: {
        Scrollbar: {
          color: twc.neutral[750],
          colorHover: twc.neutral[700],
        },
      },
    },
    Menu: {
      itemColorHover: twc.neutral[800],
    },
    Input: {
      ...DARK.input,
    },
    Message: {
      textColorSuccess: twc.lime[500],
      textColorInfo: twc.sky[500],
      textColorWarning: twc.amber[500],
      textColorError: twc.pink[500],
      textColorLoading: primaryColor,

      colorSuccess: cmh(twc.neutral[750], twc.lime[950], 0.06),
      colorInfo: cmh(twc.neutral[750], twc.sky[950], 0.06),
      colorWarning: cmh(twc.neutral[750], twc.amber[950], 0.06),
      colorError: cmh(twc.neutral[750], twc.pink[950], 0.06),
      colorLoading: cmh(twc.neutral[750], primaryColor, 0.01),

      ...closeIconColor(primaryColor),
    },
    Modal: {
      peers: {
        Scrollbar: {
          color: twc.neutral[800],
          colorHover: twc.neutral[750],
        },
      },
    },
    Notification: {
      peers: {
        Scrollbar: {
          color: twc.neutral[750],
          colorHover: twc.neutral[700],
        },
      },
    },
    Radio: {
      common: {
        borderColor: twc.neutral[700],
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
              color: twc.neutral[700],
              colorHover: twc.neutral[650],
            },
          },
        },
      },
    },
    Upload: {
      draggerColor: twc.neutral[850],
    },
  }
}
