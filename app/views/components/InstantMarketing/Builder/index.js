import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import juice from 'juice'

import { Portal } from 'components/Portal'
import IconButton from 'components/Button/IconButton'
import DropButton from 'components/Button/DropButton'
import ActionButton from 'components/Button/ActionButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import { TeamContactSelect } from 'components/TeamContact/TeamContactSelect'

import { getActiveTeam } from 'utils/user-teams'

import nunjucks from '../helpers/nunjucks'
import {
  getAsset as getBrandAsset,
  getListingUrl
} from '../helpers/nunjucks-functions'

import { loadGrapesjs } from './utils/load-grapes'
import { createGrapesInstance } from './utils/create-grapes-instance'

import Templates from '../Templates'
import { VideoToolbar } from './VideoToolbar'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originalTemplate: null,
      selectedTemplate: props.defaultTemplate,
      owner: props.templateData.user,
      isLoading: true
    }

    this.keyframe = 0

    this.traits = {
      link: [
        {
          type: 'text',
          label: 'Link',
          name: 'href'
        }
      ]
    }
  }

  async componentDidMount() {
    const { Grapesjs } = await loadGrapesjs()

    const { load: loadAssetManagerPlugin } = await import('./AssetManager')
    const { load: loadStyleManagerPlugin } = await import('./StyleManager')

    await Promise.all([loadAssetManagerPlugin(), loadStyleManagerPlugin()])

    this.setState({
      isLoading: false
    })

    this.editor = createGrapesInstance(Grapesjs, {
      assets: [...this.props.assets, ...this.UserAssets]
    })

    this.editor.on('load', this.setupGrapesJs)
  }

  setupGrapesJs = () => {
    this.lockIn()
    this.disableResize()
    this.singleClickTextEditing()
    this.disableAssetManager()
    this.makeTemplateCentered()

    if (this.IsVideoTemplate) {
      this.grapes.appendChild(this.videoToolbar)
    }

    this.props.onBuilderLoad({
      regenerateTemplate: this.regenerateTemplate
    })
  }

  disableAssetManager = () => {
    this.editor.on('run:open-assets', () => this.editor.Modal.close())
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      const isImageAsset = selected.get('type') === 'image'

      if (!selected.view.onActive || isImageAsset) {
        return
      }

      selected.view.onActive(selected.view.el)
    })
  }

  makeTemplateCentered = () => {
    const iframe = this.editor.Canvas.getFrameEl()

    const style = document.createElement('style')
    const css =
      'body { margin: 0 auto !important; background-color: #ffffff !important }'

    style.type = 'text/css'

    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    if (!iframe.contentDocument) {
      console.warn('iframe contentDocument is null')

      return false
    }

    iframe.contentDocument.head.appendChild(style)
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
    const updateAll = (model, selectImage = false) => {
      const editable =
        model && model.view && model.view.$el.attr('rechat-editable')

      const isRechatAsset =
        model && model.view && model.view.$el.attr('rechat-assets')

      if (!editable) {
        model.set({
          editable: false,
          selectable: isRechatAsset,
          hoverable: isRechatAsset
        })
      }

      model.set({
        draggable: false,
        droppable: false,
        traits: this.traits[model.get('type')] || []
      })

      let shouldSelectImage = selectImage

      if (
        shouldSelectImage &&
        model.view.$el.attr('rechat-assets') === 'listing-image'
      ) {
        this.editor.select(model)
        shouldSelectImage = false
      }

      model.get('components').each(model => updateAll(model, shouldSelectImage))
    }

    updateAll(this.editor.DomComponents.getWrapper(), true)
  }

  getSavedTemplate() {
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

    return {
      ...this.state.selectedTemplate,
      result
    }
  }

  handleSave = () =>
    this.props.onSave(this.getSavedTemplate(), this.state.owner)

  handleSocialSharing = socialNetworkName =>
    this.props.onSocialSharing(this.getSavedTemplate(), socialNetworkName)

  generateBrandedTemplate = (template, data) => {
    const { brand } = getActiveTeam(this.props.user)

    return nunjucks.renderString(template, {
      ...data,
      getAsset: getBrandAsset.bind(null, brand),
      getListingUrl: getListingUrl.bind(null, brand)
    })
  }

  setEditorTemplateId = id => {
    this.editor.StorageManager.store({
      templateId: id
    })
  }

  refreshEditor = selectedTemplate => {
    const components = this.editor.DomComponents

    components.clear()
    this.editor.setStyle('')
    this.setEditorTemplateId(selectedTemplate.id)
    this.editor.setComponents(selectedTemplate.template)
    this.lockIn()
  }

  handleSelectTemplate = templateItem => {
    this.setState(
      {
        originalTemplate: templateItem,
        selectedTemplate: templateItem
      },
      () => {
        this.regenerateTemplate({
          user: this.state.owner
        })
      }
    )
  }

  handleOwnerChange = ({ value: owner }) => {
    this.setState({
      owner
    })

    this.regenerateTemplate({
      user: owner
    })
  }

  get IsVideoTemplate() {
    return this.state.selectedTemplate && this.state.selectedTemplate.video
  }

  get IsTemplateLoaded() {
    return this.state.selectedTemplate && this.state.selectedTemplate.template
  }

  get ShowEditListingsButton() {
    return (
      this.state.originalTemplate &&
      this.props.templateTypes.includes('Listings') &&
      this.props.templateData.listings
    )
  }

  get IsSocialMedium() {
    if (this.props.templateTypes.includes('CrmOpenHouse')) {
      return false
    }

    if (this.state.selectedTemplate) {
      return this.state.selectedTemplate.medium !== 'Email'
    }

    if (this.props.mediums) {
      return this.props.mediums !== 'Email'
    }

    return false
  }

  get UserAssets() {
    return ['profile_image_url', 'cover_image_url']
      .filter(attr => this.props.user[attr])
      .map(attr => ({
        image: this.props.user[attr],
        avatar: true
      }))
  }

  renderAgentPickerButton = buttonProps => (
    <DropButton
      {...buttonProps}
      iconSize="large"
      text={`Sends as: ${buttonProps.selectedItem.label}`}
    />
  )

  regenerateTemplate = newData => {
    console.log('[ + ] Regenerate template')

    this.setState(
      state => ({
        selectedTemplate: {
          ...state.selectedTemplate,
          template: this.generateBrandedTemplate(
            state.originalTemplate.template,
            {
              ...this.props.templateData,
              ...newData
            }
          )
        }
      }),
      () => {
        this.refreshEditor(this.state.selectedTemplate)
      }
    )
  }

  render() {
    const { isLoading } = this.state

    if (isLoading) {
      return null
    }

    const isSocialMedium = this.IsSocialMedium

    return (
      <Portal root="marketing-center">
        <Container className="template-builder">
          <Header>
            <h1>{this.props.headerTitle}</h1>

            <Actions>
              {this.state.selectedTemplate && (
                <TeamContactSelect
                  fullHeight
                  pullTo="right"
                  user={this.props.templateData.user}
                  owner={this.state.owner}
                  onSelect={this.handleOwnerChange}
                  buttonRenderer={this.renderAgentPickerButton}
                  style={{
                    marginRight: '0.5rem'
                  }}
                />
              )}

              {this.ShowEditListingsButton && (
                <ActionButton
                  style={{ marginLeft: '0.5rem' }}
                  appearance="outline"
                  onClick={this.props.onShowEditListings}
                >
                  Edit Listings ({this.props.templateData.listings.length})
                </ActionButton>
              )}

              {this.state.selectedTemplate && isSocialMedium && (
                <Fragment>
                  <ActionButton
                    onClick={() => this.handleSocialSharing('Instagram')}
                  >
                    <i
                      className="fa fa-instagram"
                      style={{
                        fontSize: '1.5rem',
                        marginRight: '0.5rem'
                      }}
                    />
                    Post to Instagram
                  </ActionButton>

                  <ActionButton
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => this.handleSocialSharing('Facebook')}
                  >
                    <i
                      className="fa fa-facebook-square"
                      style={{
                        fontSize: '1.5rem',
                        marginRight: '0.5rem'
                      }}
                    />
                    Post to Facebook
                  </ActionButton>
                </Fragment>
              )}

              {this.state.selectedTemplate && !isSocialMedium && (
                <ActionButton
                  style={{ marginLeft: '0.5rem' }}
                  onClick={this.handleSave}
                >
                  Next
                </ActionButton>
              )}

              <Divider />
              <IconButton
                isFit
                iconSize="large"
                inverse
                onClick={this.props.onClose}
              >
                <CloseIcon />
              </IconButton>
            </Actions>
          </Header>

          <BuilderContainer>
            <TemplatesContainer
              isInvisible={this.props.showTemplatesColumn === false}
            >
              <Templates
                defaultTemplate={this.props.defaultTemplate}
                medium={this.props.mediums}
                onTemplateSelect={this.handleSelectTemplate}
                templateTypes={this.props.templateTypes}
              />
            </TemplatesContainer>

            <div
              id="grapesjs-canvas"
              ref={ref => (this.grapes = ref)}
              style={{ position: 'relative' }}
            >
              {this.IsVideoTemplate && this.IsTemplateLoaded && (
                <VideoToolbar
                  onRef={ref => (this.videoToolbar = ref)}
                  editor={this.editor}
                />
              )}
            </div>
          </BuilderContainer>
        </Container>
      </Portal>
    )
  }
}

Builder.propTypes = {
  onBuilderLoad: PropTypes.func
}

Builder.defaultProps = {
  onBuilderLoad: () => null
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(mapStateToProps)(Builder)
