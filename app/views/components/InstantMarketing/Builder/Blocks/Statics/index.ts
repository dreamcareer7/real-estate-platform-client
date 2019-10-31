import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'

import { ARTICLES_BLOCK_CATEGORY, BASICS_BLOCK_CATEGORY } from '../../constants'
import { BlockOptions } from '../types'

import ArticleTop from './article-top.mjml'
import ArticleDual from './article-dual.mjml'
import ArticleLeft from './article-left.mjml'
import ArticleRight from './article-right.mjml'
import Image from './image.mjml'
import Button from './button.mjml'
import SocialGroup from './social-group.mjml'
import SocialGroupElement from './social-group-element.mjml'

export const articleTopBlockName = 'rechat-article-image-top'
export const articleDualBlockName = 'rechat-article-image-dual'
export const articleLeftBlockName = 'rechat-article-image-left'
export const articleRightBlockName = 'rechat-article-image-right'
export const imageBlockName = 'mj-image'
export const buttonBlockName = 'mj-button'
export const socialGroupBlockName = 'mj-social-group'
export const socialGroupElementBlockName = 'mj-social-element'

const templates = {}

templates[articleTopBlockName] = ArticleTop
templates[articleDualBlockName] = ArticleDual
templates[articleLeftBlockName] = ArticleLeft
templates[articleRightBlockName] = ArticleRight

templates[imageBlockName] = Image
templates[buttonBlockName] = Button
templates[socialGroupBlockName] = SocialGroup
templates[socialGroupElementBlockName] = SocialGroupElement

function registerStaticBlock(
  editor: Editor,
  { label, category, blockName }: BlockOptions
): void {
  editor.BlockManager.add(blockName, {
    label,
    category,
    content: templates[blockName]
  })
}

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerStaticBlock(editor, {
    label: 'Image Top',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleTopBlockName,
    template: templates[articleTopBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Image Dual',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleDualBlockName,
    template: templates[articleDualBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Image Left',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleLeftBlockName,
    template: templates[articleLeftBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Image Right',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleRightBlockName,
    template: templates[articleRightBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Image',
    category: BASICS_BLOCK_CATEGORY,
    blockName: imageBlockName,
    template: templates[imageBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Button',
    category: BASICS_BLOCK_CATEGORY,
    blockName: buttonBlockName,
    template: templates[buttonBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Social Group',
    category: BASICS_BLOCK_CATEGORY,
    blockName: socialGroupBlockName,
    template: templates[socialGroupBlockName]
  })

  registerStaticBlock(editor, {
    label: 'Social Group Element',
    category: BASICS_BLOCK_CATEGORY,
    blockName: socialGroupElementBlockName,
    template: templates[socialGroupElementBlockName]
  })

  editor.on('block:drag:stop', (model: any, block: any) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const template = templates[model.attributes.attributes['data-block']]

    const mjml = nunjucks.renderString(template, {
      ...renderData
    })

    model.parent().append(mjml, { at: model.opt.at })

    model.remove()
  })
}
