import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import validator from 'validator'
import { PhoneNumberUtil } from 'google-libphonenumber'
import _ from 'underscore'
import cn from 'classnames'
import Fetch from '../../../services/fetch'
import Contact from '../../../models/Contact'
import Recipients from './recipients'
import Suggestions from './suggestions'

class Compose extends React.Component {
  constructor(props) {
    super(props)

    // search criteria
    this.criteria = ''

    this.state = {
      searching: false,
      viewList: {},
      recipients: {}
    }
  }

  /**
   * search recipients
   */
  async onSearch(text) {
    const { searchInRooms } = this.props

    if (text === this.criteria)
      return false

    // set this variable to detect non characters like shift, ctrl, ...
    this.criteria = text
    this.setState({ viewList: {} })

    // dont search when there is no criteria
    if (this.criteria.length === 0)
      return false

    // show searching loader
    this.setState({ searching: true })

    let rooms = []
    if (searchInRooms) {
      rooms = await this.searchInRooms(this.criteria)
      this.createListView(rooms)
    }

    const users = await this.searchInUsers(this.criteria)
    this.createListView(users, rooms)

    const contacts = await this.searchInContacts(this.criteria)
    this.createListView(users, rooms, contacts)

    // hide loader
    this.setState({ searching: false })
  }

  /**
   * create list view
   */
  createListView(...sources) {
    // flatten sources
    const entries = [].concat.apply([], sources)

    // remove duplicates
    let viewList = _.chain(entries)
      .sortBy(entry => ['user', 'email', 'phone_number'].indexOf(entry.type))
      .uniq(entry => entry.email || entry.phone_number || entry.id)
      .value()

    if (_.size(viewList) === 0)
      viewList = this.createNewEntry()

    this.setState({ viewList })
  }

  /**
   * create new entry to display in viewlist
   */
  createNewEntry() {
    const id = this.criteria

    if (validator.isEmail(id)) {
      return {
        [id]: this.createListItem('email', { id, email: id })
      }
    }

    const phoneUtil = PhoneNumberUtil.getInstance()
    if (phoneUtil.isPossibleNumberString(id)) {
      return {
        [id]: this.createListItem('phone_number', { id, phone_number: id })
      }
    }

    return null
  }

  /**
   * search recipients in rooms
   */
  async searchInRooms(q) {
    const rooms = await this.askServer(`/rooms/search?q[]=${q}&room_types[]=Direct&room_types[]=Group`)

    return rooms
      // .filter(room => room.users.length > 2)
      .map(room => {
        return this.createListItem('room', {
          ...room,
          ...{
            users: _.pluck(room.users, 'id'),
            display_name: `${room.proposed_title}(room)`
          }
        })
      })
  }

  /**
   * search recipients in contacts
   */
  async searchInContacts(q) {
    let contacts = []

    _.each(this.props.contacts, contact => {
      // search in contact's users
      const users_list = contact.users || []
      const users = users_list
        .filter(user => user.display_name.includes(q))
        .map(user => this.createListItem('user', user))

      // search in contact's emails
      const emails_list = Contact.get.emails(contact) || []
      const emails = emails_list
        .filter(item => item.email.includes(q))
        .map(email => this.createListItem('email', email))

      // search in contact's phone
      const phone_list = Contact.get.phones(contact) || []
      const phones = phone_list
        .filter(item => item.phone_number.includes(q))
        .map(phone => this.createListItem('phone_number', phone))

      contacts = contacts.concat(users, emails, phones)
    })

    return contacts
  }

  /**
   * search in users
   */
  async searchInUsers(q) {
    const users = await this.askServer(`/users/search?q[]=${q}`)
    return users.map(user => this.createListItem('user', user))
  }

  /**
   * create list item
   */
  createListItem(type, item) {
    return {
      type,
      id: item.id,
      display_name: item.display_name || item[type] || '-',
      image: item.profile_image_url,
      email: item.email,
      phone_number: item.phone_number,
      users: item.users
    }
  }

  /**
   * api call
   */
  async askServer(url) {
    try {
      const response = await new Fetch().get(url)
      return response.body.data
    } catch(e) {
      return null
    }
  }

  /**
   * on add new recipient
   */
  onAdd(recipient) {
    const recipients = {
      ...this.state.recipients,
      ...{[recipient.id]: recipient}
    }

    this.setState({ recipients }, this.onChangeRecipients)

    // reset search input text
    this.searchInput.value = ''

    // set focus on search
    this.searchInput.focus()
  }

  /**
   * on remove recipient
   */
  onRemove(recipient) {
    // remove selected recipient
    const recipients = _.omit(this.state.recipients, (item, id) => id === recipient.id)

    this.setState({ recipients }, this.onChangeRecipients)

    // set focus on search
    this.searchInput.focus()
  }

  /**
   * on change recipients
   */
  onChangeRecipients() {
    const recipients = {
      users: [],
      emails: [],
      phone_numbers: []
    }

    _.each(this.state.recipients, recp => {
      switch(recp.type) {
        case 'user':
          recipients.users.push(recp.id)
          break
        case 'room':
          recipients.users = recipients.users.concat(recp.users)
          break
        case 'email':
          recipients.emails.push(recp.email)
          break
        case 'phone_number':
          recipients.phone_numbers.push(recp.phone_number)
          break
      }
    })

    this.props.onChangeRecipients(recipients)
  }

  /**
   * triggers when dropdown lose focus
   */
  onBlurDropDownBox() {
    const { dropDownBox } = this.props

    if (dropDownBox === true)
      this.setState({ viewList: {}})
  }

  render() {
    const { searching, viewList, recipients } = this.state

    return (
      <div className="compose">

        <Recipients
          recipients={recipients}
          onSearch={text => this.onSearch(text)}
          onRemove={recipient => this.onRemove(recipient)}
          inputRef={el => this.searchInput = el}
        />

        <Suggestions
          dropDownBox={this.props.dropDownBox}
          searching={searching}
          viewList={viewList}
          onAdd={recipient => this.onAdd(recipient)}
          onBlurDropDownBox={() => this.onBlurDropDownBox()}
        />
      </div>
    )
  }
}

Compose.propTypes = {
  searchInRooms: PropTypes.bool,
  dropDownBox: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onChangeRecipients: PropTypes.func.isRequired
}

export default connect(({ contact }) => ({
  contacts: contact.list
}))(Compose)
