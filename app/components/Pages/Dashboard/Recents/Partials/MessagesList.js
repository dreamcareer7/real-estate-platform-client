// MessagesList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../../Partials/Loading'
import { Carousel, CarouselItem, Tooltip, OverlayTrigger, Modal, Button, Alert } from 'react-bootstrap'
import config from '../../../../../../config/public'
import helpers from '../../../../../utils/helpers'
import listing_util from '../../../../../utils/listing'
import Switch from 'react-ios-switch'
// AppDispatcher
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'


// Partials
import MessageItem from './MessageItem'
import ProfileImage from '../../Partials/ProfileImage'

// Modules
import AddContactsModule from '../../Modules/AddContacts'

export default class MessagesList extends Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      const clipboard = require('clipboard')
      new clipboard('.copy-link')
    }
    this.scrollBottom()
  }

  componentDidUpdate() {
    const data = this.props.data
    if (data.scroll_bottom) {
      this.scrollBottom()
      this.props.removeScrollBottom()
    }
    this.acknowledgeNotifications()
  }

  acknowledgeNotifications() {
    const room = this.props.data.current_room
    if (!room)
      return

    if (!this.roomHasNotifications(room.id))
      return
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'acknowledge-room-notifications',
      user,
      room: room.id
    })
  }

  roomHasNotifications(room_id) {
    let result = false
    const data = this.props.data
    if (!data.notifications)
      return false
    const summaries = data.notifications.summary.room_notification_summaries
    if (!summaries)
      return false
    summaries.forEach(summary => {
      if (summary.room_id === room_id)
        result = true
    })
    return result
  }

  scrollBottom() {
    const messages_scroll_area = this.refs.messages_scroll_area
    if (messages_scroll_area)
      messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight
  }

  getMessagePositions() {
    const data = this.props.data
    const current_room = data.current_room
    if (!current_room)
      return false
    const messages = current_room.messages
    if (!messages)
      return false
    const heading_objects = []
    messages.forEach((message, i) => {
      if (!message || !message.created_at)
        return
      const message_element = this.refs['message-' + i]
      if (!message_element)
        return
      const message_created = message.created_at.toString().split('.')
      const rect = message_element.getBoundingClientRect()
      const heading_object = {
        top: rect.top,
        date: message_created[0]
      }
      heading_objects.push(heading_object)
    })
    return heading_objects
  }

  getLockedHeadingDate() {
    const heading_objects = this.getMessagePositions()
    if (!heading_objects)
      return
    const arr_sorted = heading_objects.sort((a, b) => {
      return a.top - b.top
    })
    const sorted_under_zero = arr_sorted.filter(message => {
      return message.top < 60
    })
    if (!sorted_under_zero || !sorted_under_zero[sorted_under_zero.length - 1])
      return
    const locked_heading_date = sorted_under_zero[sorted_under_zero.length - 1].date
    // Testing
    // const time_created = helpers.friendlyDate(locked_heading_date)
    // const fixed_heading_date = `${ time_created.month } ${ time_created.date }, ${ time_created.year }`
    this.props.setHeadingDate(locked_heading_date)
  }

  handleInviteLinkClick(e) {
    e.target.select()
  }

  resetScrollAfterLoad() {
    const messages_scroll_area = this.refs.messages_scroll_area
    const current_room = this.props.data.current_room
    const scroll_height = current_room.scroll_height
    if (scroll_height && messages_scroll_area)
      messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight - scroll_height
  }

  handleScroll() {
    // this.getLockedHeadingDate()
    if (this.props.data.current_room.showing_all)
      return false
    const messages_scroll_area = this.refs.messages_scroll_area
    if (messages_scroll_area.scrollTop === 0)
      this.props.getPreviousMessages(messages_scroll_area.scrollHeight)
  }

  handleAlertListingSelect(index) {
    this.props.setAlertGalleryActiveIndex(index)
  }

  render() {
    // Data
    const data = this.props.data
    const current_room = data.current_room
    if (data.rooms && !data.rooms.length)
      return <div style={ S('ml-20') }>No messages yet.</div>

    const loading_style = {
      ...S('absolute ml-20 w-100p h-100p bg-url(/images/loading-states/messages.svg)'),
      backgroundRepeat: 'repeat-y'
    }
    // Messages
    let messages
    if (current_room)
      messages = current_room.messages
    if (!current_room || !messages) {
      return (
        <div style={ loading_style }>
        </div>
      )
    }
    let listing_switch_checked
    listing_switch_checked = current_room.notification_settings[data.user.id].system_generated

    let message_date
    const todays_date = helpers.getYMD()
    let prev_message_date
    const heading_style = {
      ...S('relative text-center p-5 pl-0 h-26 font-12 br-3 mb-10 mr-3'),
      textTransform: 'uppercase'
    }
    let prev_recommendation
    let messages_list_items = (
      <div style={ loading_style }></div>
    )
    if (messages) {
      messages_list_items = messages.map((message, i) => {
        // Hide if no message or is the automatted message after a comment
        if (!message) {
          return (
            <li key={ 'message-' + i }></li>
          )
        }
        const recommendation = message.recommendation
        if (prev_recommendation && recommendation && recommendation.id === prev_recommendation.id && !message.author) {
          return (
            <li key={ 'message-' + i }></li>
          )
        }
        let heading
        let heading_date_area
        let new_date = false
        const created_at = message.created_at.toString().split('.')
        const message_date_obj = helpers.friendlyDate(created_at[0])
        message_date = helpers.getYMD(created_at[0] * 1000)
        if (!prev_message_date || prev_message_date && prev_message_date !== message_date) {
          heading_date_area = (
            <span>{ `${message_date_obj.day}, ${message_date_obj.month} ${message_date_obj.date}, ${message_date_obj.year}` }</span>
          )
          if (todays_date === message_date) {
            heading_date_area = (
              <span>{ 'Today' }</span>
            )
          }

          heading = (
            <div className="message-heading" style={ heading_style }>
              <div style={ S('absolute w-100p h-2 bg-e8e8e8 t-12 z-0') }></div>
              <span style={ S('pl-10 pr-10 bg-fff z-1 relative') }>{ heading_date_area }</span>
            </div>
          )
          new_date = true
        }
        prev_message_date = message_date
        prev_recommendation = message.recommendation
        return (
          <li ref={ 'message-' + i} key={ 'message-' + message.id + '-' + i }>
            { heading }
            <MessageItem
              i={ i }
              data={ data }
              message={ message }
              showFileViewer={ this.props.showFileViewer }
              new_date={ new_date }
              showListingViewer={ this.props.showListingViewer }
              showAlertModal={ this.props.showAlertModal }
            />
          </li>
        )
      })
    }

    const invite_link = config.app.url + '/invite/?room_id=' + data.current_room.id + '&invite_token=' + data.user.access_token

    const tooltip = (
      <Tooltip id="copied-tooltip">
        Copied
      </Tooltip>
    )

    let messages_overflow = 'scroll'
    let messages_opacity = 1
    // Load previous messages
    let loading_previous
    if (data.current_room.loading_previous) {
      messages_overflow = 'hidden'
      messages_opacity = '.7'
      loading_previous = (
        <div className="text-center" style={ S('relative h-80 pt-40') }>
          Loading previous messages...
        </div>
      )
    }

    // Styles
    const messages_scroll_area = {
      ...S('pl-20 pr-20 mt-20 relative'),
      overflowY: messages_overflow,
      height: window.innerHeight - 115,
      opacity: messages_opacity
    }
    // let fixed_heading_date_area
    // if (data.heading_date) {
    //   const fixed_date_obj = helpers.friendlyDate(data.heading_date)
    //   const fixed_heading_date = `${fixed_date_obj.day}, ${fixed_date_obj.month} ${fixed_date_obj.date}, ${fixed_date_obj.year}`
    //   let heading_top = 't-60'
    //   if (data.is_mobile)
    //     heading_top = 't-55'
    //   fixed_heading_date_area = (
    //     <div className="heading-fixed" style={ S('absolute z-3 pl-20 pr-5 pb-0 mb-0 h-20 bg-fff ' + heading_top + ' w-' + (data.is_mobile ? window.innerWidth : window.innerWidth - 400)) }>
    //       <div className="message-heading" style={ { ...heading_style, ...S('mr-0') } }>
    //         <div style={ S('absolute h-2 bg-e8e8e8 t-12 z-0 w-' + (data.is_mobile ? window.innerWidth - 43 : window.innerWidth - 434)) }></div>
    //         <span style={ S('pl-10 l-5n pr-10 pb-5 br-3 bg-fff z-1 relative') }>{ fixed_heading_date }</span>
    //       </div>
    //     </div>
    //   )
    // }
    const btn_invite_style = S('w-40 h-40 pointer absolute p-0 t-10 r-20 br-100 bc-ddd bw-1 solid')
    const btn_settings_style = S('w-40 h-40 pointer absolute p-0 t-10 r-70 br-100 bc-ddd bw-1 solid color-929292')
    let alert_modal_area = (
      <Loading />
    )
    const prev_icon = '<'
    const next_icon = '>'
    if (data.listing_alerts) {
      const img_cache = data.listing_alerts.map(listing_alert => {
        const listing = listing_alert.listing
        return <img key={ `img-cache-${listing.id}`} src={ listing.cover_image_url } style={ S('absolute w-0 h-0 l-1000n r-1000n') }/>
      })
      alert_modal_area = (
        <div>
          { img_cache }
          <Carousel onSelect={ this.handleAlertListingSelect.bind(this) } className="listing-viewer__carousel carousel--alert" interval={0} indicators={false} prevIcon={ prev_icon } nextIcon={ next_icon }>
            {
              data.listing_alerts.map(listing_alert => {
                const listing = listing_alert.listing
                // Listing status
                const status_color = listing_util.getStatusColor(listing.status)
                let sold_date
                if (listing.close_date) {
                  const sold_date_obj = helpers.friendlyDate(listing.close_date)
                  sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
                }
                const underlay_style = {
                  opacity: '.6',
                  ...S('bg-000 relative t-11 br-100 ml-5 pt-11 h-25 pl-36 pr-10 mr-15')
                }
                const listing_status_indicator = (
                  <div style={ S('relative z-1 t-10n') }>
                    <div className="pull-left" style={ underlay_style }>
                      <div style={ { opacity: '0' } }>
                        <span style={ S('mr-5 font-46 l-10 t-10 absolute color-' + status_color) }>&#8226;</span>
                        <span style={ S('font-14 relative t-5n color-fff') }>
                          <b>{ listing.status } { sold_date }</b>
                        </span>
                      </div>
                    </div>
                    <div className="pull-left" style={ S('absolute t-8 br-100 ml-5 pt-11 h-25 pl-36 mr-15') }>
                      <span style={ S('font-35 l-8 t-10n absolute color-' + status_color) }>&#8226;</span>
                      <span style={ S('font-14 relative t-11n l-5n color-fff') }>
                        <b>{ listing.status } { sold_date }</b>
                      </span>
                    </div>
                  </div>
                )
                return (
                  <CarouselItem key={ 'gallery-image-' + listing.id }>
                    <div onClick={ this.props.showListingViewer.bind(this, listing) } style={ S('pointer w-100p h-300 text-center bg-efefef bg-cover bg-center bg-url(' + listing.cover_image_url + ')') }/>
                    <div style={ S('pointer mb-10') } onClick={ this.props.showListingViewer.bind(this, listing) }>
                      <div style={ S('font-20 fw-700 mt-10') }>
                        <div className="pull-left" style={ S('mr-5') }>${ helpers.numberWithCommas(listing.price) }</div>
                        <div className="pull-left">{ listing_status_indicator }</div>
                        <div className="clearfix"></div>
                      </div>
                      <div style={ S('font-16 fw-700') }>{ listing_util.addressTitle(listing.property.address) }</div>
                      <div style={ S('font-14 color-929292') }>
                        { listing.property.bedroom_count } Beds&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                        { listing.property.bathroom_count } Bath&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                        { helpers.numberWithCommas(listing_util.metersToFeet(listing.property.square_meters)) } Sqft
                      </div>
                    </div>
                  </CarouselItem>
                )
              })
            }
          </Carousel>
        </div>
      )
    }
    const delete_area = (
      <Modal.Footer>
        <Button bsStyle="link" onClick={ this.props.hideModal }>Cancel</Button>
        <Button bsStyle="danger" onClick={ this.props.showDeleteRoomModal.bind(this) }>Leave room</Button>
      </Modal.Footer>
    )
    let messages_mb = 'mb-40'
    let heading_pt = 'pt-0'
    if (data.is_mobile) {
      messages_mb = 'mb-80'
      heading_pt = 'pt-15'
    }
    let message
    if (data.add_contacts_error) {
      message = (
        <div style={ S('mt-10 text-left') }>
          <Alert bsStyle="danger">There was an error with this request.</Alert>
        </div>
      )
    }
    return (
      <div>
        <button onClick={ this.props.showModal.bind(this, 'invite-user') } type="button" className="btn btn-default" style={ btn_invite_style } >
          <img style={ S('ml-1n mt-1n') } src="/images/dashboard/icons/invite-user.svg"/>
        </button>
        <button onClick={ this.props.showModal.bind(this, 'settings') } type="button" className="btn btn-default" style={ btn_settings_style } >
          <i style={ S('font-16 relative t-1') } className="fa fa-cog"></i>
        </button>
        <h3 style={ S('mt-6 ml-20 mr-50 ' + heading_pt) }>{ current_room.title }</h3>
        { /* fixed_heading_date_area */ }
        <div className="touch-scroll" ref="messages_scroll_area" style={ messages_scroll_area } onScroll={ this.handleScroll.bind(this) }>
          { loading_previous }
          <ul style={ S('pl-0 ' + messages_mb) }>{ messages_list_items }</ul>
        </div>
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_contacts_modal } onHide={ this.props.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Invite contacts <span style={ S('color-929292 fw-400') }>(use any email or any phone number)</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={ S('mb-15') }>
              <div style={ S('font-14 fw-500 mb-5') }>Share link</div>
              <div style={ S('r-10 t-16 w-100p mr-15') }>
                <div className="input-group">
                  <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={ tooltip }>
                    <input data-clipboard-text={ invite_link } readOnly onClick={ this.handleInviteLinkClick.bind(this) } className="copy-link form-control pull-right" ref="clipboard_target" id="invite-link" type="text" value={ invite_link } style={ S('h-37 w-100p') } />
                  </OverlayTrigger>
                  <span className="input-group-btn">
                    <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={ tooltip }>
                      <button className="copy-link btn btn-default" type="button" data-clipboard-target="#invite-link" style={ S('h-37') }>
                        <img src="/images/dashboard/icons/clippy.svg" width="13" alt="Copy to clipboard" />
                      </button>
                    </OverlayTrigger>
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <div style={ S('mt-10n pt-5') }>
              <div style={ S('font-14 fw-500') }>Add contacts</div>
              <AddContactsModule
                data={ data }
                module_type="room"
              />
            </div>
            <div className="text-center">
              <img style={ S('w-200 h-103') } src="/images/dashboard/add-contacts/people.png" />
            </div>
          </Modal.Body>
          <Modal.Footer style={ { border: 'none' } }>
            <Button bsStyle="link" onClick={ this.props.hideModal }>Cancel</Button>
            <Button onClick={ this.props.addContactsToRoom.bind(this) } style={ S('pl-30 pr-30') } className={ data.adding_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
              { data.adding_contacts ? 'Saving...' : 'Save' }
            </Button>
            { message }
          </Modal.Footer>
        </Modal>
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_settings_modal } onHide={ this.props.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Room settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={ S('mb-20') }>
              <label>Listing notifications</label>
              <div className="clearfix"></div>
              <div className="pull-left">
                <Switch checked={ listing_switch_checked } onChange={ this.props.changeListingNotification.bind(this, listing_switch_checked) } />
              </div>
              <div className="clearfix"></div>
            </div>
            <label>Team</label>
            <div style={ { ...S('maxh-200 pt-10'), overflow: 'scroll' } }>
            {
              current_room.users.map(contact => {
                return (
                  <div style={ S('h-50 relative br-100 p-3 pl-0 pr-10 mb-10 mr-10 w-100p') } className="pull-left" key={ 'added-contact-' + contact.id }>
                    <div style={ S('l-0 t-0 absolute') }>
                      <ProfileImage data={ data } top={11} size={40} user={ contact }/>
                    </div>
                    <div style={ S('ml-50') }>
                      <div>{ contact.first_name } { contact.last_name }</div>
                      <div>{ contact.email }</div>
                    </div>
                  </div>
                )
              })
            }
            </div>
          </Modal.Body>
          { delete_area }
        </Modal>
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_alert_modal } onHide={ this.props.hideAlertModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title>Alert { data.listing_alerts ? `(${ data.alert_modal && data.alert_modal.active_index ? data.alert_modal.active_index + 1 : '1' } of ${data.listing_alerts.length} Homes)` : '' } </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { alert_modal_area }
            <div className="clearfix"></div>
          </Modal.Body>
        </Modal>
        <Modal show={ data.show_delete_room_modal } onHide={ this.props.hideDeleteRoomModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title>Delete Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this room?  This can not be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="link" onClick={ this.props.hideDeleteRoomModal }>Cancel</Button>
            <Button bsStyle="danger" onClick={ this.props.confirmDeleteRoom } className={ data.deleting_room ? 'disabled' : '' }>
              { data.deleting_room ? 'Deleting...' : 'Yes, delete' }
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

// PropTypes
MessagesList.propTypes = {
  data: React.PropTypes.object,
  getPreviousMessages: React.PropTypes.func.isRequired,
  showModal: React.PropTypes.func.isRequired,
  addContactsToRoom: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  showFileViewer: React.PropTypes.func,
  setHeadingDate: React.PropTypes.func,
  removeScrollBottom: React.PropTypes.func,
  showListingViewer: React.PropTypes.func,
  changeListingNotification: React.PropTypes.func,
  showAlertModal: React.PropTypes.func,
  hideAlertModal: React.PropTypes.func,
  showDeleteRoomModal: React.PropTypes.func,
  hideDeleteRoomModal: React.PropTypes.func,
  confirmDeleteRoom: React.PropTypes.func,
  setAlertGalleryActiveIndex: React.PropTypes.func
}