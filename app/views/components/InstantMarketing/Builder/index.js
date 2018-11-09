import React from 'react'

import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import '../../../../styles/components/modules/template-builder.scss'

import './AssetManager'
import config from './config'

import nunjucks from '../helpers/nunjucks'

import {
  Container,
  TemplatesContainer,
  BuilderContainer,
  Header
} from './styled'
import Templates from '../Templates'

import juice from 'juice'
import ActionButton from 'components/Button/ActionButton'

class Builder extends React.Component {
  keyframe = 0

  state = {
    template: null
  }

  componentDidMount() {
    this.editor = grapesjs.init({
      ...config,
      avoidInlineStyle: false,
      keepUnusedStyles: true,
      forceClass: false,
      container: '#grapesjs-canvas',
      components: null,
      assetManager: {
        assets: this.props.assets
      },
      storageManager: {
        autoload: 0
      },
      showDevices: false,
      plugins: ['asset-blocks']
    })

    this.editor.on('load', this.setupGrapesJs.bind(this))
  }

  setupGrapesJs = () => {
    this.lockIn()
    this.disableResize()
    this.singleClickTextEditing()
    this.disableAssetManager()
  }

  get timeline() {
    return this.editor.DomComponents.getWrapper().view.el.ownerDocument.defaultView.Timeline
  }

  disableAssetManager = () => {
    this.editor.on('run:open-assets', () => this.editor.Modal.close())
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      if (!selected.view.enableEditing) {
        return
      }

      selected.view.enableEditing(selected.view.el)
    })
  }

  disableResize = () => {
    const components = this.editor.DomComponents

    const image = components.getType('image')

    const defaults = image.model.prototype.defaults

    const updated = image.model.extend({
      defaults: Object.assign({}, defaults, {
        resizable: false
      })
    })

    components.addType('image', {
      model: updated,
      view: image.view
    })
  }

  lockIn = () => {
    const updateAll = model => {
      const editable =
        model && model.view && model.view.$el.attr('rechat-editable')

      if (!editable) {
        model.set({
          editable: false,
          selectable: false,
          hoverable: false,
        })
      }

      model.set({
        draggable: false,
        droppable: false
      })

      model.get('components').each(model => updateAll(model))
    }

    updateAll(this.editor.DomComponents.getWrapper())
  }

  onSave = () => {
    const css = this.editor.getCss()
    const html = this.editor.getHtml()

    const assembled = `
      <!doctype html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>`

    const result = juice(assembled)

    this.props.onSave({
      ...this.selectedTemplate,
      result
    })

    this.selectedTemplate = null
  }

  handleSelectTemplate = templateItem => {
    this.setState({
      template: templateItem
    })

    const template = {
      ...templateItem,
      template: nunjucks.renderString(templateItem.template, {
        ...this.props.templateData
      })
    }

    this.selectedTemplate = template

    const components = this.editor.DomComponents

    components.clear()
    this.editor.setStyle('')
    this.editor.setComponents(template.template)
    this.lockIn()
  }

  onNext = () => {
    this.keyframe++

    const keyframe = this.timeline.keyframes[this.keyframe]

    if (!keyframe)
      return

    this.timeline.seekTo(keyframe.at)
  }

  onPrevious = () => {
    if (this.keyframe === 0)
      return

    this.keyframe--

    const keyframe = this.timeline.keyframes[this.keyframe]

    this.timeline.seekTo(keyframe.at)
  }

  onRestart = () => {
    this.postMessage('restart')
  }

  render() {
    const { template } = this.state

    return (
      <Container className="template-builder">
        <Header>
          <h1>{this.props.headerTitle}</h1>

          <div>
            <ActionButton appearance="outline" onClick={this.props.onClose}>
              Cancel
            </ActionButton>

            <ActionButton
              style={{ marginLeft: '0.5rem' }}
              onClick={this.onSave}
            >
              {this.props.saveButtonLabel}
            </ActionButton>

            { template && template.video &&
              <ActionButton
                style={{ marginLeft: '0.5rem' }}
                onClick={this.onPrevious}
              >
                Previous
              </ActionButton> }

            { template && template.video &&
              <ActionButton
                onClick={this.onNext.bind(this)}
              >
                Next
              </ActionButton>
            }

          </div>
        </Header>

        <BuilderContainer>
          <TemplatesContainer
            isInvisible={this.props.showTemplatesColumn === false}
          >
            <Templates
              onTemplateSelect={this.handleSelectTemplate}
              templateTypes={this.props.templateTypes}
              mediums={this.props.mediums}
            />
          </TemplatesContainer>

          <div id="grapesjs-canvas" />
        </BuilderContainer>
      </Container>
    )
  }
}

export default Builder
