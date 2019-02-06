import React, { Fragment } from 'react'
import _ from 'underscore'

import PopOver from 'components/Popover'

import { CheckBoxButton } from '../../../../Button/CheckboxButton'
import { CheckBoxButtonWithoutState } from '../../../../Button/CheckboxButton/CheckboxWithoutState'

import { SelectEntireText } from './styled'

const SESSION_KEY_PREFIX = 'Rechat--Grid--Selectable--'

export function resetGridSelectedItems(key) {
  console.log('[ Grids -> Selectable ] Reset Selected Items')
  window.gridSelectableStorage[`${SESSION_KEY_PREFIX}${key}`] = ''
}

export class SelectablePlugin {
  constructor({ options, onRequestForceUpdate }) {
    this.options = Object.assign(
      {
        persistent: false,
        allowSelectAll: true,
        unselectableRow: [],
        allowSelectEntireList: true,
        entityName: ''
      },
      options
    )

    this.onRequestForceUpdate = onRequestForceUpdate
    this.data = []

    if (options.persistent && !options.storageKey) {
      throw new Error(
        '[ Grids -> Selectable ] it should provide storage key on persistant mode'
      )
    }

    // create global storage if doesn't exists
    if (!window.gridSelectableStorage) {
      window.gridSelectableStorage = {}
    }

    if (!options.persistent) {
      this.StorageEngine = null
    }

    // callback previous selected rows
    if (options.persistent && this.SelectedRows.length > 0) {
      this.onChange()
    }
  }

  setData(data = []) {
    // set new data
    this.data = data
  }

  setTotalCount(count = 0) {
    this.totalCount = count
  }

  /**
   * reset all selected rows in persistent mode
   */
  resetSelectedItems = () => {
    console.log(
      `[ Grids -> Selectable -> ${this.StorageKey} ] Reset Selected Items`
    )

    window.gridSelectableStorage[this.StorageKey] = ''

    this.onChange()
  }

  /**
   * save object
   * @param {Object} object - data object
   */
  set StorageObject(object) {
    this.StorageEngine = JSON.stringify({
      ...this.StorageObject,
      ...object
    })
  }

  /**
   * returns json object of storage
   */
  get StorageObject() {
    return JSON.parse(this.StorageEngine) || {}
  }

  /**
   * returns whether a row is selected or not
   * @param { UUID } id - the row id
   */
  isRowSelected = id =>
    this.StorageObject.selectedRows && this.StorageObject.selectedRows[id]

  /**
   * returns true when some rows is selected
   */
  someRowsSelected = () =>
    this.StorageObject.selectedRows &&
    Object.keys(this.StorageObject.selectedRows).length > 0

  /**
   * checks whether all rows are selected or not
   */
  isAllRowsSelected = () => this.StorageObject.selectAllRows === true

  /**
   * checks whether all rows are selected or not
   */
  isEntireRowsSelected = () => this.StorageObject.selectEntireRows === true

  /**
   * checks whether all rows of subTable selected or not
   */
  isAllSubTableRowsSelected = data =>
    this.StorageObject.selectedRows &&
    data.every(({ id }) => this.StorageObject.selectedRows[id])

  /**
   * returns true when some rows is selected in subTable
   */
  anySubTableRowsSelected = data =>
    this.StorageObject.selectedRows &&
    data.some(({ id }) => this.StorageObject.selectedRows[id])

  /**
   * returns storage key
   */
  get StorageKey() {
    return `${SESSION_KEY_PREFIX}${this.options.storageKey}`
  }

  /**
   * returns all selected rows
   */
  get SelectedRows() {
    return Object.keys(this.StorageObject.selectedRows || {})
  }

  /**
   * returns storage engine
   */
  get StorageEngine() {
    return window.gridSelectableStorage[this.StorageKey] || null
  }

  /**
   * store object into storage
   */
  set StorageEngine(data) {
    window.gridSelectableStorage[this.StorageKey] = data
  }

  /**
   * toggles selection status of a row
   * @param { UUID } id - the row id
   */
  toggleSelectRow = id => {
    if (!id) {
      console.error(
        '[ Grid -> Selectable ] Unique Id for this row is not provided'
      )

      return false
    }

    const { selectedRows = {} } = this.StorageObject

    if (selectedRows[id]) {
      delete selectedRows[id]

      // deselect select-all checkbox in header if is selected
      this.isAllRowsSelected() && this.toggleSelectAllRows()
    } else {
      selectedRows[id] = true
    }

    this.StorageObject = { selectedRows }

    this.onChange()
    this.onRequestForceUpdate()
  }

  /**
   * toggles selecting all rows
   */
  toggleSelectAllRows = () => {
    const selectedRows = {}
    const { selectAllRows = false } = this.StorageObject

    if (selectAllRows === false) {
      this.data.forEach(row => {
        selectedRows[row.id] = true
      })
    }

    this.StorageObject = {
      selectAllRows: !selectAllRows,
      selectedRows
    }

    this.onChange()
  }

  /**
   * toggles selecting all rows
   */
  toggleSelectAllSubTableRows = subData => {
    const { selectedRows } = this.StorageObject
    let newSelectedRows = { ...selectedRows }
    const allRowsSelected = subData.every(({ id }) => newSelectedRows[id])

    if (!allRowsSelected) {
      subData.forEach(row => {
        newSelectedRows[row.id] = true
      })
    } else {
      newSelectedRows = _.omit(newSelectedRows, (value, key) =>
        subData.some(({ id }) => key === id)
      )
    }

    this.StorageObject = {
      selectedRows: newSelectedRows
    }

    this.onChange()
  }

  onChange = () => {
    if (!this.options.onChange) {
      this.onRequestForceUpdate()

      return
    }

    this.options.onChange(this.SelectedRows)
  }

  renderColumnHeader = () => {
    if (!this.options.allowSelectAll) {
      return null
    }

    if (this.isAllRowsSelected() && this.options.allowSelectEntireList) {
      return (
        <Fragment>
          <PopOver
            show
            popoverStyles={{ textAlign: 'center' }}
            containerStyle={{ display: 'inline-block' }}
            caption={
              <SelectEntireText
                onClick={() =>
                  this.toggleSelectAllRows() && console.log('SELECT ALL TOTAL')
                }
              >
                Select All {this.totalCount} {this.options.entityName}
              </SelectEntireText>
            }
          >
            <CheckBoxButtonWithoutState
              someRowsSelected={false}
              onClick={this.toggleSelectAllRows}
              isSelected={this.isAllRowsSelected() || this.someRowsSelected()}
            />
          </PopOver>
        </Fragment>
      )
    }

    return (
      <CheckBoxButtonWithoutState
        someRowsSelected={!this.isAllRowsSelected() && this.someRowsSelected()}
        onClick={this.toggleSelectAllRows}
        isSelected={this.isAllRowsSelected() || this.someRowsSelected()}
      />
    )
  }

  registerColumn = columns => {
    const column = {
      id: 'plugin--selectable',
      width: '24px',
      sortable: false,
      verticalAlign: 'center',
      header: () => this.renderColumnHeader(),
      subHeader: subData => (
        <CheckBoxButtonWithoutState
          onClick={() => this.toggleSelectAllSubTableRows(subData)}
          someRowsSelected={
            !this.isAllSubTableRowsSelected(subData) &&
            this.anySubTableRowsSelected(subData)
          }
          isSelected={
            this.isAllSubTableRowsSelected(subData) ||
            this.anySubTableRowsSelected(subData)
          }
        />
      ),
      render: ({ rowData: row }) => (
        <Fragment>
          {this.options.unselectableRow.includes(row.id) === false && (
            <CheckBoxButton
              onClick={() => this.toggleSelectRow(row.id)}
              isSelected={this.isRowSelected(row.id)}
            />
          )}
        </Fragment>
      )
    }

    return [column, ...columns]
  }
}
