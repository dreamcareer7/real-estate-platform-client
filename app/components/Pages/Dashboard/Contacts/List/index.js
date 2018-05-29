import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { confirmation } from '../../../../../store_actions/confirmation'

import {
  selectContacts,
  selectContactsInfo,
  selectContactsPage,
  selectContactsPages,
  isFetchingContactsList,
  selectContactsCurrentPage
} from '../../../../../reducers/contacts/list'
import {
  getContacts,
  searchContacts,
  deleteContacts,
  removeContactPage,
  setContactCurrentPage,
  clearContactSearchResult
} from '../../../../../store_actions/contacts'

import { Header } from './Header'
import { Filters } from './Filters'
import { Toolbar } from './Toolbar'

import Table from './Table'
import { NoContact } from './NoContact'

const deletedState = { deletingContacts: [], selectedRows: {} }

class ContactsList extends React.Component {
  state = {
    filter: selectContactsInfo(this.props.list).filter || '',
    isSearching: false,
    deletingContacts: [],
    selectedRows: {}
  }

  handleOnDelete = (event, contactIds) => {
    event.stopPropagation()

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: `Delete ${contactIds.length > 1 ? 'contacts' : 'contact'}`,
      onConfirm: () => this.handleDeleteContact({ contactIds }),
      description: `Are you sure you want to delete ${
        contactIds.length > 1 ? 'these contacts' : 'this contact'
      }?`
    })
  }

  handleDeleteContact = async ({ contactIds }) => {
    try {
      const { deleteContacts, currentPage } = this.props

      this.setState({ deletingContacts: contactIds })

      await deleteContacts(contactIds)

      const currentPageContacts = selectContactsPage(
        this.props.list,
        currentPage
      )

      if (
        currentPageContacts &&
        currentPageContacts.ids.length === contactIds.length
      ) {
        const page = currentPage <= 1 ? 1 : currentPage - 1

        this.props.setContactCurrentPage(page)
        this.props.removeContactPage(currentPage)
      }

      this.setState(deletedState)
    } catch (error) {
      console.log(error)
    }
  }

  search = async (filter, page = 1) => {
    if (filter.length === 0) {
      return this.setState(
        { ...deletedState, filter: '', isSearching: false },
        this.props.clearContactSearchResult
      )
    }

    try {
      let nextState = { filter, isSearching: true }

      if (filter !== selectContactsInfo(this.props.list).filter) {
        nextState = { ...nextState, ...deletedState }
      }

      this.setState(nextState)

      await this.props.searchContacts(filter, page)
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ isSearching: false })
    }
  }

  toggleSelectedRow = contact => {
    const { selectedRows } = this.state
    let newSelectedRows = {}

    if (selectedRows[contact.id]) {
      newSelectedRows = _.omit(selectedRows, row => row.id === contact.id)
    } else {
      newSelectedRows = {
        ...selectedRows,
        [contact.id]: contact
      }
    }

    this.setState({ selectedRows: newSelectedRows })
  }

  fetchPage = async page => {
    this.props.getContacts(page)
  }

  onPageChange = page => {
    if (!selectContactsPage(this.props.list, page + 1)) {
      if (selectContactsInfo(this.props.list).type === 'filter') {
        return this.search(this.state.filter, page + 1)
      }

      this.fetchPage(page + 1)
    } else {
      this.props.setContactCurrentPage(page + 1)
    }
  }

  render() {
    const { user, list } = this.props
    const { selectedRows } = this.state
    const contacts = selectContacts(list)
    const listInfo = selectContactsInfo(list)
    const pages = _.size(selectContactsPages(list))
    const isFetching = isFetchingContactsList(list)
    let { total: totalCount } = listInfo

    const noContact =
      !isFetching && contacts.length === 0 && listInfo.type !== 'filter'

    return (
      <Fragment>
        <Header user={user} />
        <div style={{ padding: '2rem' }}>
          <Filters
            disabled={noContact}
            inputValue={this.state.filter}
            isSearching={this.state.isSearching}
            handleOnChange={this.search}
          />
          <Toolbar
            disabled={noContact || isFetching || this.state.isSearching}
            onDelete={this.handleOnDelete}
            selectedRows={selectedRows}
            totalCount={totalCount}
          />
          {noContact ? (
            <NoContact user={user} />
          ) : (
            <Table
              data={contacts}
              deletingContacts={this.state.deletingContacts}
              handleOnDelete={this.handleOnDelete}
              loading={isFetching}
              onPageChange={this.onPageChange}
              page={this.props.currentPage - 1}
              pages={pages}
              selectedRows={selectedRows}
              totalCount={totalCount}
              toggleSelectedRow={this.toggleSelectedRow}
            />
          )}
        </div>
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentPage: selectContactsCurrentPage(state.contacts.list),
    list: state.contacts.list,
    user: state.user
  }
}

export default connect(mapStateToProps, {
  clearContactSearchResult,
  confirmation,
  deleteContacts,
  getContacts,
  removeContactPage,
  searchContacts,
  setContactCurrentPage
})(ContactsList)
