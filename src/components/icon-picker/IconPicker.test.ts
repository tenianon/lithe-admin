import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { IconPicker } from '../index'

describe('IconPicker', () => {
  const icons = ['list', 'table', 'article']
  const prefix = 'ph'

  it('renders icon list', () => {
    const wrapper = mount(IconPicker, {
      props: { icons, prefix }
    })
    // Should render all icons
    expect(wrapper.findAll('button').length).toBe(icons.length)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[ph--list]'))).toBe(true)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[ph--table]'))).toBe(true)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[ph--article]'))).toBe(true)
  })

  it('filters icons by search', async () => {
    const wrapper = mount(IconPicker, {
      props: { icons, prefix }
    })
    await wrapper.find('input').setValue('tab')
    expect(wrapper.findAll('button').length).toBe(1)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[ph--table]'))).toBe(true)
  })

  it('emits selected icon in correct format', async () => {
    const wrapper = mount(IconPicker, {
      props: { icons, prefix }
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(1)
    await buttons[1]?.trigger('click')
    const emitted = wrapper.emitted()['update:modelValue']
    expect(emitted).toBeTruthy()
    expect((emitted as any)[0][0]).toBe('iconify-[ph--table]')
  })
})

