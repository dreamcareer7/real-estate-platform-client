import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'

export class InlineEditableField extends React.Component {
  static propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    handleAddNew: PropTypes.func,
    isDisabled: PropTypes.bool,
    renderViewMode: PropTypes.func,
    renderEditMode: PropTypes.func.isRequired,
    showAdd: PropTypes.bool,
    showDelete: PropTypes.bool,
    toggleModeCallback: PropTypes.func
  }

  static defaultProps = {
    handleDelete: noop,
    handleAddNew: noop,
    isDisabled: false,
    renderViewMode: noop,
    showAdd: false,
    showDelete: true,
    toggleModeCallback: noop
  }

  state = {
    isEditMode: false
  }

  toggleMode = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.setState(
      state => ({ isEditMode: !state.isEditMode }),
      () => this.props.toggleModeCallback(this.state.isEditMode)
    )
  }

  get editModeProps() {
    const {
      showDelete,
      handleDelete,
      handleSave,
      isDisabled,
      renderEditMode: render
    } = this.props

    return {
      handleDelete,
      handleSave,
      isDisabled,
      showDelete,
      render,
      toggleMode: this.toggleMode
    }
  }

  get viewModeProps() {
    const { showAdd, handleAddNew, renderViewMode: renderBody } = this.props

    return {
      showAdd,
      handleAddNew,
      renderBody,
      toggleMode: this.toggleMode
    }
  }

  render() {
    if (this.state.isEditMode) {
      return <EditMode {...this.editModeProps} />
    }

    return <ViewMode {...this.viewModeProps} />
  }
}
