import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { LISTINGS_BLOCK_CATEGORY } from '../../constants'
import { TemplateRenderData } from '../../utils/get-template-render-data/index'
import registerBlock from '../registerBlock'

import Top from './top.mjml'
import Right from './right.mjml'
import Left from './left.mjml'

export const listingTopBlockName = 'rechat-listing-image-top'
export const listingLeftBlockName = 'rechat-listing-image-left'
export const listingRightBlockName = 'rechat-listing-image-right'

const templates = {}

templates[listingTopBlockName] = Top
templates[listingLeftBlockName] = Left
templates[listingRightBlockName] = Right

export interface Options {
  onDrop: (model: Model) => void
}

interface ListingBlock {
  selectHandler: (selectedListing?: IListing) => void
}

let modelHandle: any
let renderData: TemplateRenderData

const selectHandler = (listing?: IListing) => {
  if (!modelHandle) {
    return
  }

  const template = templates[modelHandle.attributes.attributes['data-block']]

  if (listing) {
    const mjml = nunjucks.renderString(template, {
      ...renderData,
      listing
    })

    modelHandle.parent().append(mjml, { at: modelHandle.opt.at })
  }

  modelHandle.remove()
}

export default function registerBlocks(
  editor: Editor,
  _renderData: TemplateRenderData,
  { onDrop }: Options
): ListingBlock {
  renderData = _renderData
  registerBlock(editor, {
    label: 'Image Top',
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingTopBlockName,
    template: templates[listingTopBlockName]
  })

  registerBlock(editor, {
    label: 'Image Left',
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingLeftBlockName,
    template: templates[listingLeftBlockName]
  })

  registerBlock(editor, {
    label: 'Image Right',
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingRightBlockName,
    template: templates[listingRightBlockName]
  })

  editor.on('block:drag:stop', (model: Model, block) => {
    if (!model) {
      return
    }

    if (templates[block.id]) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}
