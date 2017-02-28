// Dashboard/Transactions/New/index.js
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import { Button, Breadcrumb, BreadcrumbItem, Alert, Modal, Navbar, Nav } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'

// AppStore
import AppStore from '../../../../../stores/AppStore'

// ListingDispatcher
import ListingDispatcher from '../../../../../dispatcher/ListingDispatcher'

// TransactionDispatcher
import TransactionDispatcher from '../../../../../dispatcher/TransactionDispatcher'

// Steps
import AddClients from './Steps/AddClients'
import AddContacts from './Steps/AddContacts'
import AddListing from './Steps/AddListing'
import AddFinancials from './Steps/AddFinancials'
import AddDates from './Steps/AddDates'

export default class NewTransaction extends Component {

  componentDidMount() {
    TransactionDispatcher.dispatch({
      action: 'init'
    })
    AppStore.data.active_contact = -1
    AppStore.data.contacts_added = null
    AppStore.emitChange()
    window.onkeyup = (e) => {
      switch (e.which) {
        case 27:
          // If has contact
          if (AppStore.data.new_transaction.contacts_added)
            return
          // If modal already showing
          if (AppStore.data.new_transaction.show_cancel_confirm) {
            delete AppStore.data.new_transaction.show_cancel_confirm
            AppStore.emitChange()
            this.props.history.pushState(null, '/dashboard/transactions')
          } else
            this.showCancelModal()
          break
        case 13:
          if (AppStore.data.new_transaction.show_cancel_confirm)
            this.props.history.pushState(null, '/dashboard/transactions')
          break
        default:
          return
      }
    }
  }

  componentDidUpdate() {
    if (AppStore.data.new_transaction && AppStore.data.new_transaction.redirect_to) {
      const redirect_to = AppStore.data.new_transaction.redirect_to
      browserHistory.push(redirect_to)
    }
  }

  getBreadCrumbs(step) {
    const data = this.props.data
    const contacts_added = data.new_transaction.contacts_added
    let type_active = false
    let contacts_active = false
    let entries_active = false
    let listing_active = false
    let financials_active = false
    let dates_active = false
    if (step === 0)
      type_active = true
    if (step === 1)
      contacts_active = true
    if (step === 2)
      entries_active = true
    if (step === 3)
      listing_active = true
    if (step === 4)
      financials_active = true
    if (step === 5)
      dates_active = true
    const breadcrumb_items = [
      <BreadcrumbItem key={ 'breadcrumb-1' } onClick={ this.handleGoToStep.bind(this, 0) } active={ type_active }>Type</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-2' } onClick={ this.handleGoToStep.bind(this, 1) } active={ contacts_active }>Clients</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-3' } onClick={ this.handleGoToStep.bind(this, 2) } active={ entries_active }>Other contacts</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-4' } onClick={ this.handleGoToStep.bind(this, 3) } active={ listing_active }>Listing</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-5' } onClick={ this.handleGoToStep.bind(this, 4) } active={ financials_active }>Financials</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-6' } onClick={ this.handleGoToStep.bind(this, 5) } active={ dates_active }>Important dates</BreadcrumbItem>
    ]
    return breadcrumb_items.filter((item, i) => {
      if (i <= step)
        return item
      if (contacts_added && contacts_added.client.length)
        return item
    })
  }

  hideModal() {
    delete AppStore.data.new_transaction.show_listing_modal
    delete AppStore.data.new_transaction.show_cancel_confirm
    delete AppStore.data.new_transaction.show_date_picker
    delete AppStore.data.new_transaction.date_type_key
    AppStore.emitChange()
  }

  handleTypeClick(type) {
    TransactionDispatcher.dispatch({
      action: 'set-type',
      type
    })
    this.handleGoToStep(1)
  }

  handlePrevNext(direction) {
    // Data
    const data = this.props.data
    const current_step = data.new_transaction.step
    let step
    if (direction === 'next')
      step = current_step + 1
    if (direction === 'prev')
      step = current_step - 1
    TransactionDispatcher.dispatch({
      action: 'go-to-step',
      step
    })
    AppStore.data.filtered_contacts = null
    AppStore.data.active_contact = null
    AppStore.emitChange()
  }

  handleGoToStep(step) {
    // Data
    TransactionDispatcher.dispatch({
      action: 'go-to-step',
      step
    })
    AppStore.data.filtered_contacts = null
    AppStore.data.active_contact = null
    AppStore.emitChange()
  }

  // Listings
  searchListings(q) {
    delete AppStore.data.new_transaction.listing_added
    AppStore.data.new_transaction.listing_searching = true
    AppStore.emitChange()
    const user = this.props.data.user
    ListingDispatcher.dispatch({
      action: 'search-listing',
      user,
      q
    })
  }

  addListing(listing) {
    AppStore.data.new_transaction.listing_added = listing
    delete AppStore.data.new_transaction.listings_found
    delete AppStore.data.new_transaction.listing_searching
    delete AppStore.data.new_transaction.listing_q
    this.showListingModal('edit')
    AppStore.emitChange()
  }

  calculateFinancials(price, contract_price, agent_commission, co_agent_commission) {
    const data = this.props.data
    const new_transaction = data.new_transaction
    let listing_added = new_transaction.listing_added
    if (!listing_added)
      listing_added = {}
    listing_added.price = parseInt(price, 10)
    listing_added.contract_price = parseInt(contract_price, 10)
    listing_added.agent_commission = agent_commission
    listing_added.co_agent_commission = co_agent_commission
    AppStore.data.new_transaction.listing_added = listing_added
    AppStore.emitChange()
  }

  createTransaction() {
    AppStore.data.new_transaction.saving = true
    AppStore.emitChange()
    const new_transaction = this.props.data.new_transaction
    const user = this.props.data.user
    // Get dates
    if (new_transaction.selected_day) {
      new_transaction.dates = []
      let date_object
      _.mapKeys(new_transaction.selected_day, (value, key) => {
        date_object = {
          title: key,
          due_date: value.getTime() / 1000
        }
        new_transaction.dates.push(date_object)
      })
    }
    TransactionDispatcher.dispatch({
      action: 'create',
      user,
      new_transaction
    })
  }

  selectDay(date_type, day) {
    if (!AppStore.data.new_transaction.selected_day)
      AppStore.data.new_transaction.selected_day = {}
    AppStore.data.new_transaction.selected_day[date_type] = day
    this.hideModal()
    AppStore.emitChange()
  }

  // Add listing data
  showListingModal(type) {
    AppStore.data.new_transaction.show_listing_modal = true
    if (type === 'new') {
      delete AppStore.data.new_transaction.listing_added
      delete AppStore.data.new_transaction.listings_found
      delete AppStore.data.new_transaction.listing_q
      this.refs.q.refs.input.value = ''
      setTimeout(() => {
        this.refs.address.focus()
      }, 100)
    }
    AppStore.emitChange()
  }

  setListingActive(active_listing) {
    AppStore.data.new_transaction.active_listing = active_listing
    AppStore.emitChange()
  }

  removeAddedListing(e) {
    e.preventDefault()
    delete AppStore.data.new_transaction.listing_added
    delete AppStore.data.new_transaction.listing_data
    AppStore.emitChange()
    setTimeout(() => {
      this.refs.q.refs.input.focus()
    }, 100)
  }

  addCustomListingInfo(e) {
    e.preventDefault()
    // TODO
    const address = this.refs.address.value
    const status = this.refs.status.value
    const city = this.refs.city.value
    const state = this.refs.state.value
    const postal_code = this.refs.postal_code.value
    const year_built = this.refs.year_built.value
    const property_type = this.refs.property_type.value
    const square_feet = this.refs.square_feet.value
    const bedroom_count = this.refs.bedroom_count.value
    const bathroom_count = this.refs.bathroom_count.value

    AppStore.data.new_transaction.listing_data = {
      status,
      property: {
        address: {
          street_full: address,
          city,
          state,
          postal_code
        },
        year_built,
        property_type,
        square_feet,
        bedroom_count,
        bathroom_count
      }
    }
    AppStore.emitChange()
    this.hideModal()
  }

  showCancelModal() {
    const new_transaction = AppStore.data.new_transaction
    if (new_transaction && new_transaction.type && new_transaction.contacts_added && new_transaction.contacts_added.client && new_transaction.contacts_added.client.length) {
      AppStore.data.new_transaction.show_cancel_confirm = true
      AppStore.emitChange()
    } else
      browserHistory.push('/dashboard/transactions')
  }

  handleCancelClick(e) {
    e.preventDefault()
    this.showCancelModal()
  }

  showDatePickerModal(date_type_key) {
    AppStore.data.new_transaction.show_date_picker = true
    AppStore.data.new_transaction.date_type_key = date_type_key
    AppStore.emitChange()
  }

  render() {
    // Data
    const data = this.props.data

    // Set contacts
    data.contacts = AppStore.data.contacts
    data.new_transaction = AppStore.data.new_transaction
    // Set new_transaction
    const new_transaction = data.new_transaction

    let buying_class = 'dashed '
    let selling_class = 'dashed '
    let lease_class = 'dashed '

    if (new_transaction && new_transaction.type === 'Buyer')
      buying_class = 'btn-primary'

    if (new_transaction && new_transaction.type === 'Seller')
      selling_class = 'btn-primary'

    if (new_transaction && new_transaction.type === 'Lease')
      lease_class = 'btn-primary'

    const btn_style_first = S('font-18 w-200')
    const btn_style = S('font-18 ml-10 w-200')

    let main_content = (
      <div>
        <div style={ S('t-100n absolute color-d0d4d9') }>Never leave that till tomorrow which you can do today.</div>
        <div>
          <div style={ S('mb-20') }>
            <h1>Keep'em comin!  So are we...</h1>
          </div>
          <div>
            <Button bsStyle="default" onClick={ this.handleTypeClick.bind(this, 'Buyer') } style={ btn_style_first } className={ buying_class }>Buying</Button>
            <Button bsStyle="default" onClick={ this.handleTypeClick.bind(this, 'Seller') } style={ btn_style } className={ selling_class }>Selling</Button>
            <Button bsStyle="default" onClick={ this.handleTypeClick.bind(this, 'Lease') } style={ btn_style } className={ lease_class }>Leasing</Button>
          </div>
        </div>
      </div>
    )
    // Set vars
    let nav_buttons
    let breadcrumbs
    if (new_transaction) {
      const step = new_transaction.step
      // Main content
      switch (new_transaction.step) {
        case 1:
          main_content = (
            <AddClients
              data={ data }
            />
          )
          break
        case 2:
          main_content = (
            <AddContacts
              data={ data }
            />
          )
          break
        case 3:
          main_content = (
            <AddListing
              data={ data }
              searchListings={ this.searchListings.bind(this) }
              setListingActive={ this.setListingActive }
              addListing={ this.addListing }
              hideModal={ this.hideModal }
              showListingModal={ this.showListingModal }
              addCustomListingInfo={ this.addCustomListingInfo }
              removeAddedListing={ this.removeAddedListing }
              removeAddedProperty={ this.removeAddedProperty }
            />
          )
          break
        case 4:
          main_content = (
            <AddFinancials
              data={ data }
              calculateFinancials={ this.calculateFinancials.bind(this) }
            />
          )
          break
        case 5:
          main_content = (
            <AddDates
              data={ data }
              selectDay={ this.selectDay }
              hideModal={ this.hideModal }
              showDatePickerModal={ this.showDatePickerModal }
            />
          )
          break
        default:
          main_content = main_content
      }

      // Breadcrumbs
      breadcrumbs = (
        <Breadcrumb>
          { this.getBreadCrumbs(step) }
        </Breadcrumb>
      )

      // Buttons
      let previous_button
      let next_button
      let cancel_button

      // Cancel Button
      if (!step && new_transaction.type && new_transaction.contacts_added && new_transaction.contacts_added.client.length) {
        cancel_button = (
          <a href="#" onClick={ this.handleCancelClick.bind(this) } className="btn btn-danger pull-left" style={ S('mr-20') }>Cancel</a>
        )
      }

      // Back Button
      if (step) {
        previous_button = (
          <Button bsStyle="link" style={ S('mr-20') } onClick={ this.handlePrevNext.bind(this, 'prev') }>Back</Button>
        )
      }
      // Next Button
      if (step < new_transaction.total_steps && new_transaction.type && new_transaction.contacts_added && new_transaction.contacts_added.client.length) {
        next_button = (
          <Button onClick={ this.handlePrevNext.bind(this, 'next') }>Next</Button>
        )
      }

      nav_buttons = (
        <div style={ S('absolute r-0 t-500') }>
          { cancel_button }
          { previous_button }
          { next_button }
        </div>
      )
    }

    let message
    if (new_transaction && new_transaction.save_error) {
      message = (
        <Alert style={ S('mt-20') } bsStyle="danger">There was an error with this request.  Make sure that you have at least one contact added.</Alert>
      )
    }

    const cancel_button = (
      <div style={ S('absolute w-40 r-10 t-10n text-center') }>
        <a href="#" onClick={ this.handleCancelClick.bind(this) } style={ { ...S('color-929292'), ...{ 'textDecoration': 'none' } } }>
          <div style={ S('font-30 relative t-10') }>&times;</div>
          <div style={ S('font-12') }>esc</div>
        </a>
      </div>
    )

    const save_button = (
      <Button onClick={ this.createTransaction.bind(this) } style={ S('absolute r-10 t-10') } className={ new_transaction && new_transaction.saving ? ' disabled' : '' } type="button" bsStyle="primary">
        { new_transaction && new_transaction.saving ? 'Saving...' : 'Skip all' }
      </Button>
    )

    let action_button = cancel_button
    if (new_transaction && new_transaction.type && new_transaction.contacts_added && new_transaction.contacts_added.client.length)
      action_button = save_button

    let show_cancel_confirm
    if (new_transaction)
      show_cancel_confirm = new_transaction.show_cancel_confirm

    // Style
    const main_style = S('relative w-960 h-300 pt-20 mt-220')
    const nav_bar_style = { ...S('mb-0 p-0 h-58 pt-3'), borderBottom: '1px solid #e7e4e3' }

    return (
      <div style={ S('minw-1000') }>
        <header>
          <Navbar className="bg-aqua" style={ nav_bar_style } fluid>
            <Nav/>
          </Navbar>
          <div className="center-block" style={ S('relative h-0 l-15n t-48n w-960') }>{ breadcrumbs }</div>
          { action_button }
          <Modal show={ show_cancel_confirm } onHide={ this.hideModal.bind(this) }>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Cancel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to cancel?  Any unsaved changes will be lost.
            </Modal.Body>
            <Modal.Footer>
              <Link to="/dashboard/transactions" className="btn btn-danger">
                Yes, cancel
              </Link>
            </Modal.Footer>
          </Modal>
        </header>
        <main style={ S('w-100p') }>
          <div style={ main_style } className="center-block">
            { message }
            <div style={ S('absolute w-100p') }>
              { main_content }
            </div>
            { nav_buttons }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
NewTransaction.propTypes = {
  data: React.PropTypes.object,
  history: React.PropTypes.object
}
