import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

import { CollapseTransition, CollapseTransitionTrigger } from '../index'

describe('CollapseTransition Component', () => {
  it('toggle by v-if when display=false', async () => {
    const wrapper = mount(CollapseTransition, {
      props: {
        display: true,
        direction: 'vertical',
        duration: 300,
      },
      slots: { default: '<div class="context">context</div>' },
    })

    expect(wrapper.find('.context').exists()).toBe(true)

    await wrapper.setProps({ display: false })
    await nextTick()
    expect(wrapper.find('.context').exists()).toBe(false)
  })

  it('trigger component', async () => {
    const wrapper = mount(CollapseTransitionTrigger, {
      props: {
        displayDirective: 'if',
      },
      slots: {
        trigger: '<div class="trigger">trigger</div>',
        default: '<div class="context">context</div>',
      },
    })

    expect(wrapper.find('.trigger').exists()).toBe(true)
    expect(wrapper.find('.context').exists()).toBe(false)

    await wrapper.find('.trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.context').exists()).toBe(true)

    await wrapper.find('.trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.context').exists()).toBe(false)
  })
})
