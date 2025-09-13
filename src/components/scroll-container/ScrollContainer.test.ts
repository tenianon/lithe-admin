import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import { ScrollContainer } from '../index'
;(window as any).matchMedia ||= (q: string) => ({
  matches: false,
  media: q,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false
  },
})

describe('ScrollContainer Component', () => {
  it('render component', () => {
    const wrapper = mount(ScrollContainer, {
      slots: {
        default: '<div class="context">context</div>',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.n-scrollbar').exists()).toBe(true)
  })
})
