import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { confirmation } from 'actions/confirmation'

import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'
import InstantMarketing from 'components/InstantMarketing'
import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { formatDate } from 'components/InstantMarketing/helpers/nunjucks-filters'

import { getTemplates } from 'models/instant-marketing'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'
import {
  getTask,
  updateTask,
  createTask,
  deleteTask,
  deleteTaskAssociation
} from 'models/tasks'
import getListing from 'models/listings/listing/get-listing'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import { isSoloActiveTeam, getActiveTeamId } from 'utils/user-teams'

import Alert from '../../../../components/Pages/Dashboard/Partials/Alert'

import { Divider } from '../../Divider'
import Drawer from '../../OverlayDrawer'
import IconButton from '../../Button/IconButton'
import ActionButton from '../../Button/ActionButton'
import { ItemChangelog } from '../../TeamContact/ItemChangelog'
import IconDelete from '../../SvgIcons/DeleteOutline/IconDeleteOutline'
import { Title } from '../../EventDrawer/components/Title'
import { UpdateReminder } from '../../EventDrawer/components/UpdateReminder'
import { Description } from '../../EventDrawer/components/Description'
import { FormContainer, FieldContainer } from '../../EventDrawer/styled'
import { DateTimeField, AssigneesField } from '../../final-form-fields'
import { AddAssociationButton } from '../../AddAssociationButton'
import { AssociationsList, ReminderField } from '../../final-form-fields'
import Tooltip from '../../tooltip'
import LoadSaveReinitializeForm from '../../../utils/LoadSaveReinitializeForm'
import { Section } from '../../tour/TourDrawer/components/Section'

import { validate } from './helpers/validate'
import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Location } from './Location'
import { Footer } from './styled'

const propTypes = {
  ...Drawer.propTypes,
  deal: PropTypes.shape(),
  openHouse: PropTypes.any,
  openHouseId: PropTypes.any,
  initialValues: PropTypes.shape(),
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired
}

const defaultProps = {
  ...Drawer.defaultProps,
  openHouse: null,
  openHouseId: undefined,
  initialValues: {},
  submitCallback: () => {},
  deleteCallback: () => {}
}

/**
 * Represents a Open House Event in a drawer view.
 *
 * NOTE: Its title and initial states controlling by props.
 * Because of the drawer component nature, we have to
 * unmount it after each time closing. And also mount it
 * after opening until we can reinitialize it.
 *
 */
class OpenHouseDrawerInternal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      isDisabled: false,
      isSaving: false,
      isTemplateBuilderOpen: false,
      listing: null,
      template: '',
      rawTemplate: '',
      openHouse: props.openHouse
    }

    this.isNew =
      (!props.openHouse && !props.openHouseId) ||
      Object(this.props.initialValues).length > 0
  }

  get dealAassociation() {
    const { associations } = this.props

    if (associations && associations.deal) {
      return {
        association_type: 'deal',
        deal: associations.deal.id
      }
    }

    return null
  }

  load = async () => {
    try {
      this.setState({ isDisabled: true })

      if (this.isNew) {
        let fullListing = null
        const activeTeamId = getActiveTeamId(this.props.user)
        const list = await getTemplates(activeTeamId, ['CrmOpenHouse'])
        const templateItem = list[0]

        const rawTemplate = await loadTemplateHtml(
          `${templateItem.url}/index.html`
        )

        const { associations } = this.props

        if (associations) {
          let listingId = ''
          const { deal, listing } = associations

          if (listing) {
            listingId = listing.id
          } else if (deal && deal.listing) {
            listingId = deal.listing
          }

          if (listingId) {
            fullListing = await getListing(listingId)
          }
        }

        this.setState(
          { listing: fullListing, rawTemplate, isDisabled: false },
          this.loadRegistrationTemplate
        )

        return null
      }

      if (this.props.openHouse) {
        this.setState({ isDisabled: false })

        const template = this.props.openHouse.metadata
          ? this.props.openHouse.metadata.template
          : null

        this.setState({
          isDisabled: false,
          openHouse: this.props.openHouse,
          template
        })

        return this.props.openHouse
      }

      if (this.props.openHouseId) {
        const openHouse = await getTask(this.props.openHouseId, CRM_TASKS_QUERY)

        // get template if exists
        const template = openHouse.metadata ? openHouse.metadata.template : null

        const newState = { isDisabled: false, openHouse, template }

        // Get listing from OH listing associations if the deal object is not provided
        // It's done to cover some flows like calendar OH event edit flow
        newState.listing = openHouse.associations.find(
          ({ association_type }) => association_type === 'listing'
        ).listing

        this.setState(newState)

        return openHouse
      }
    } catch (error) {
      console.log(error)
      this.setState({ error, isDisabled: false })
    }
  }

  renderTemplate(rawTemplate, openHouse) {
    return nunjucks.renderString(rawTemplate, {
      user: this.props.user,
      listing: this.state.listing,
      crmopenhouse: openHouse
    })
  }

  loadRegistrationTemplate = async () => {
    try {
      const crmopenhouse = {
        title: this.state.listing.property.address.full_address,
        due_date: new Date()
      }

      if (!this.isNew) {
        crmopenhouse.title = this.props.openHouse.title
        crmopenhouse.due_date = new Date(this.props.openHouse.dueDate * 1000)
      }

      this.setState(state => ({
        template: this.renderTemplate(state.rawTemplate, crmopenhouse)
      }))
    } catch (error) {
      console.log(error)
    }
  }

  handleSaveTemplate = data => {
    const { result: template } = data

    this.setState({
      template,
      rawTemplate: '',
      isTemplateBuilderOpen: false
    })
  }

  save = async openHouse => {
    try {
      let newTour
      let action = 'created'

      this.setState({ isDisabled: true, isSaving: true })

      if (this.state.rawTemplate) {
        this.setState(state => {
          const template = this.renderTemplate(state.rawTemplate, {
            ...openHouse,
            due_date: new Date(openHouse.due_date * 1000)
          })

          openHouse.metadata.template = template

          return { template }
        })
      }

      openHouse.metadata.template = openHouse.metadata.template.replace(
        new RegExp(/\<h1\sstyle=\"(.+)\".+\<\/h1\>/),
        `<h1 style="$1">${openHouse.title}</h1>`
      )

      openHouse.metadata.template = openHouse.metadata.template.replace(
        new RegExp(/\<p(.*)class=\"greytext\sgreytext-date\"(.*)\>(.+)\<\/p>/),
        `<p $1 class="greytext greytext-date" $2>${formatDate(
          new Date(openHouse.due_date * 1000)
        )}</p>`
      )

      if (openHouse.id) {
        newTour = await updateTask(openHouse, CRM_TASKS_QUERY)
        action = 'updated'
      } else {
        newTour = await createTask(openHouse, CRM_TASKS_QUERY)
      }

      this.setState({ isDisabled: false, isSaving: false, openHouse: newTour })
      await this.props.submitCallback(newTour, action)
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false, isSaving: false })
      throw error
    }
  }

  delete = async () => {
    try {
      this.setState({ isDisabled: true })
      await deleteTask(this.state.openHouse.id)
      this.setState({ isDisabled: false }, () =>
        this.props.deleteCallback(this.state.openHouse)
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  handleDeleteAssociation = async association => {
    if (association.id) {
      try {
        const response = await deleteTaskAssociation(
          association.crm_task,
          association.id
        )

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    return Promise.resolve()
  }

  handleSubmit = () => {
    document
      .getElementById('open-house-drawer-form')
      .dispatchEvent(new Event('submit', { cancelable: true }))
  }

  handleEditTemplateClick = () => {
    if (this.isNew) {
      return this.toggleTemplateBuilder()
    }

    this.props.dispatch(
      confirmation({
        message:
          'Redesigning registration page will delete your previous design.',
        confirmLabel: 'Okay, Continue',
        onConfirm: this.toggleTemplateBuilder
      })
    )
  }

  toggleTemplateBuilder = () =>
    this.setState(state => ({
      isTemplateBuilderOpen: !state.isTemplateBuilderOpen
    }))

  getTemplateAssets() {
    const assets = []

    if (!this.state.listing) {
      return []
    }

    this.state.listing.gallery_image_urls.forEach(image => {
      assets.push({
        listing: this.state.listing.id,
        image
      })
    })

    return assets
  }

  render() {
    const { user } = this.props
    const { isDisabled, openHouse, error } = this.state

    return (
      <LoadSaveReinitializeForm
        loading={null}
        initialValues={this.props.initialValues}
        load={this.load}
        postLoadFormat={openHouse =>
          postLoadFormat(openHouse, user, this.state.listing)
        }
        preSaveFormat={(values, originalValues) =>
          preSaveFormat(
            values,
            originalValues,
            this.state.template,
            this.dealAassociation
          )
        }
        save={this.save}
        validate={validate}
        render={formProps => {
          const { values } = formProps

          return (
            <>
              <Drawer
                open={this.props.isOpen && !this.state.isTemplateBuilderOpen}
                onClose={this.props.onClose}
              >
                <Drawer.Header
                  title={`${this.isNew ? 'New' : 'Edit'} Open House`}
                />
                <Drawer.Body>
                  {error && error.status === 404 ? (
                    <Alert message={error.response.body.message} type="error" />
                  ) : (
                    <div>
                      <FormContainer
                        id="open-house-drawer-form"
                        onSubmit={formProps.handleSubmit}
                      >
                        <Title
                          fullWidth
                          placeholder="Untitled Open House"
                          style={{ marginBottom: '1.5rem' }}
                        />
                        <Description placeholder="Enter any general notes for your clients" />

                        <UpdateReminder
                          dueDate={values.dueDate}
                          // 1 hour before
                          defaultOption={REMINDER_DROPDOWN_OPTIONS[5]}
                        />

                        <Section label="Event Date">
                          <FieldContainer alignCenter justifyBetween>
                            <DateTimeField
                              name="dueDate"
                              selectedDate={values.dueDate}
                            />
                            {values.status !== 'DONE' && (
                              <ReminderField dueDate={values.dueDate} />
                            )}
                          </FieldContainer>
                        </Section>

                        <Section label="Event Location">
                          <Location
                            location={values.location}
                            handleDelete={this.handleDeleteAssociation}
                          />
                        </Section>

                        {!isSoloActiveTeam(user) && (
                          <Section label="Agents">
                            <AssigneesField
                              buttonText="Assignee"
                              name="assignees"
                              owner={user}
                            />
                          </Section>
                        )}

                        <Section label="Registrants">
                          <AssociationsList
                            name="registrants"
                            associations={values.registrants}
                            handleDelete={this.handleDeleteAssociation}
                          />
                        </Section>

                        <ItemChangelog
                          item={values}
                          style={{ marginTop: '2em' }}
                        />
                      </FormContainer>
                      <Footer justifyBetween>
                        <Flex alignCenter>
                          {!this.isNew && (
                            <React.Fragment>
                              <Tooltip placement="top" caption="Delete">
                                <IconButton
                                  isFit
                                  inverse
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={this.delete}
                                >
                                  <IconDelete />
                                </IconButton>
                              </Tooltip>
                              <Divider
                                margin="0 1rem"
                                width="1px"
                                height="2rem"
                              />
                            </React.Fragment>
                          )}
                          <AddAssociationButton
                            associations={values.registrants}
                            crm_task={openHouse ? openHouse.id : ''}
                            disabled={isDisabled}
                            type="contact"
                            name="registrants"
                            caption="Attach Contact"
                          />
                        </Flex>
                        <Flex alignCenter>
                          <ActionButton
                            type="button"
                            appearance="outline"
                            onClick={this.handleEditTemplateClick}
                          >
                            {this.state.openHouse
                              ? 'Redesign Guest Registration Page'
                              : 'Edit Guest Registration Page'}
                          </ActionButton>

                          {(this.state.template || this.state.rawTemplate) && (
                            <ActionButton
                              type="button"
                              disabled={isDisabled}
                              onClick={this.handleSubmit}
                              style={{ marginLeft: '0.5em' }}
                            >
                              {this.state.isSaving ? 'Saving...' : 'Save'}
                            </ActionButton>
                          )}
                        </Flex>
                      </Footer>
                    </div>
                  )}
                </Drawer.Body>
              </Drawer>

              {this.state.isTemplateBuilderOpen && (
                <InstantMarketing
                  isOpen
                  headerTitle="Edit Guest Registration Page"
                  closeConfirmation={false}
                  showTemplatesColumn={false}
                  saveButtonLabel="Save"
                  onClose={this.toggleTemplateBuilder}
                  handleSave={this.handleSaveTemplate}
                  assets={this.getTemplateAssets()}
                  templateData={{
                    user: this.props.user,
                    listing: this.state.listing,
                    crmopenhouse: {
                      title: values.title,
                      due_date: values.dueDate
                    }
                  }}
                  templateTypes={['CrmOpenHouse']}
                />
              )}
            </>
          )
        }}
      />
    )
  }
}

OpenHouseDrawerInternal.propTypes = propTypes
OpenHouseDrawerInternal.defaultProps = defaultProps

export const OpenHouseDrawer = connect(state => ({ user: state.user }))(
  OpenHouseDrawerInternal
)
