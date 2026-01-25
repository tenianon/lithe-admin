import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import { HintHelp } from '../index'

async function sleep(delay: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

describe('HintHelp Component', () => {
  it('render label and trigger', async () => {
    const wrapper = mount(HintHelp, {
      attachTo: document.body,
      props: {
        label: 'help',
        content: 'this is help content',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('help')
    expect(wrapper.find('.iconify.ph--question').exists()).toBe(true)

    const btn = wrapper.find('.grid.cursor-pointer.place-items-center')

    await btn.trigger('mouseenter')
    await sleep(300)

    const pop = document.body.querySelector('.n-popover') as HTMLElement | null
    expect(pop).not.toBeNull()
    expect(pop?.textContent || '').toContain('this is help content')
  })
})
