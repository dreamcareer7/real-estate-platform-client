import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TasksDropDown from '../../components/tasks-dropdown'
import Checkbox from '../../components/radio'
import Deal from '../../../../../../models/Deal'
import {
  resetSplitterSelectedPages,
  resetSplitter,
  setSplitterUsedPages,
  changeNeedsAttention,
  addAttachment
} from '../../../../../../store_actions/deals'

class WorkspaceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      title: '',
      task: null,
      notifyOffice: true
    }
  }

  isFormValidated() {
    const { title, task } = this.state
    const { splitter } = this.props

    if (title.length > 0 && task !== null && _.size(splitter.pages) > 0) {
      return true
    }

    return false
  }

  async save() {
    const { title, task, notifyOffice } = this.state
    const {
      notify, splitter, addAttachment, changeNeedsAttention
    } = this.props
    const { pages } = splitter
    let fileCreated = false

    // set status
    this.setState({ saving: true })

    const files = _.chain(pages)
      .pluck('documentId')
      .uniq()
      .map(id => ({
        object: splitter.files[id].file,
        documentId: id
      }))
      .value()

    try {
      const { file } = await Deal.splitPDF(
        title,
        task.id,
        task.room.id,
        files,
        pages
      )

      // add files to attachments list
      addAttachment(task.deal, task.checklist, task.id, file)

      if (notifyOffice) {
        changeNeedsAttention(task.deal, task.id, true)
      }

      // set create as true
      fileCreated = true

      notify({
        message: `Pdf "${title}" created successfully`,
        status: 'success'
      })

      // set status
      this.setState({
        saving: false,
        title: '',
        notifyOffice: true
      })
    } catch (e) {
      console.log(e)

      notify({
        title: 'Couldn\'t create the splitted pdf file. please try again.',
        message: e.message,
        status: 'error'
      })

      this.setState({
        saving: false
      })
    }

    return fileCreated
  }

  async saveAndQuit() {
    const saved = await this.save()

    if (!saved) {
      return false
    }

    // destruct splitter states
    this.props.resetSplitter()
  }

  async saveAndNew() {
    const { splitter } = this.props
    const { pages } = splitter

    const saved = await this.save()

    if (!saved) {
      return false
    }

    // reset selected pages
    this.props.resetSplitterSelectedPages()
    this.props.setSplitterUsedPages(pages)
  }

  render() {
    const { deal, tasks } = this.props
    const {
      title, task, notifyOffice, saving
    } = this.state

    const formValidated = this.isFormValidated()

    if (saving) {
      return (
        <div className="splitter-saving">
          <div className="inner">
            Saving PDF... (It might take a few moments)
            <ProgressBar now={100} bsStyle="success" active />
          </div>
        </div>
      )
    }

    return (
      <div className="details">
        <input
          className="title"
          placeholder="Document title ..."
          value={title}
          onChange={e => this.setState({ title: e.target.value })}
        />

        <TasksDropDown
          deal={deal}
          onSelectTask={taskId => this.setState({ task: tasks[taskId] })}
          selectedTask={task}
        />

        <Checkbox
          square
          selected={notifyOffice}
          title="Notify Office"
          onClick={() => this.setState({ notifyOffice: !notifyOffice })}
        />

        <div className="buttons">
          <button
            onClick={() => this.saveAndQuit()}
            disabled={!formValidated}
            className={cn('save-quit', { disabled: !formValidated })}
          >
            Save and quit
          </button>

          <button
            className={cn('save-new', { disabled: !formValidated })}
            disabled={!formValidated}
            onClick={() => this.saveAndNew()}
          >
            Save and create another
          </button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    splitter: deals.splitter,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps, {
  notify,
  resetSplitter,
  resetSplitterSelectedPages,
  setSplitterUsedPages,
  changeNeedsAttention,
  addAttachment
})(WorkspaceForm)
