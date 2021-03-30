import { Editor } from 'grapesjs'

import ButtonIcon from 'assets/images/marketing/editor/blocks/button.png'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import { baseView, isComponent } from '../utils'
import registerBlock from '../../registerBlock'

import Button from './button.njk'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeButton = 'button'
export const buttonBlockName = typeButton

export interface ButtonBlockOptions {
  buttonClassNames?: string
}

export const buttonBlockTraits = {
  [typeButton]: [
    {
      type: 'text',
      label: 'Link',
      name: 'href'
    }
  ]
}

export default function registerButtonBlock(
  editor: Editor,
  templateBlocks: TemplateBlocks,
  { buttonClassNames }: ButtonBlockOptions
) {
  editor.DomComponents.addType(typeButton, {
    isComponent: isComponent(typeButton),
    extend: 'link',
    model: {
      defaults: {
        name: 'Button',
        attributes: {
          href: '',
          target: '_blank'
        }
      }
    },
    view: { ...baseView(buttonClassNames) }
  })

  const buttonBlocks = {
    [buttonBlockName]: templateBlocks[buttonBlockName]?.template || Button
  }

  registerBlock(
    editor,
    {
      label: 'Button',
      icon: ButtonIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: buttonBlockName,
      template: buttonBlocks[buttonBlockName]
    },
    templateBlocks[buttonBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    buttonBlocks,
    templateBlocks
  )

  return allBlocks
}