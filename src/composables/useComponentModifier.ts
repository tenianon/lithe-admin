import type { ModalProps, PopconfirmProps } from 'naive-ui'

export function useComponentModifier() {
  function getModalModifier(props?: ModalProps): ModalProps {
    const negativeButtonProps: ModalProps['negativeButtonProps'] = {
      ghost: false,
      secondary: true,
      type: 'tertiary',
    }

    const positiveButtonProps: ModalProps['positiveButtonProps'] = {
      ghost: false,
      secondary: true,
    }

    const themeOverrides: ModalProps['themeOverrides'] = {
      peers: {
        Dialog: {
          iconSize: '24px',
          titleFontSize: '16px',
        },
      },
    }

    return {
      negativeButtonProps,
      positiveButtonProps,
      themeOverrides,
      ...props,
    }
  }

  function getPopconfirmModifier(props?: PopconfirmProps): PopconfirmProps {
    const negativeButtonProps: PopconfirmProps['negativeButtonProps'] = {
      ghost: false,
      secondary: true,
      size: 'small',
    }

    const positiveButtonProps: PopconfirmProps['positiveButtonProps'] = {
      ghost: false,
      type: 'info',
      size: 'small',
    }

    return {
      negativeButtonProps,
      positiveButtonProps,
      ...props,
    }
  }
  return {
    getModalModifier,
    getPopconfirmModifier,
  }
}
