// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'
import _ from 'lodash'

// Partials
import CheckBox from './CheckBox'

// Helpers
import helpers from '../../../../../utils/helpers'

export default class Tasks extends Component {

  render() {
    const data = this.props.data
    let tasks = data.tasks
    const current_task = data.current_task
    let tasks_list = 'You have no tasks yet'
    let prev_task_date
    let task_date
    if (tasks) {
      tasks = _.sortBy(tasks, task => {
        return task.due_date
      })
      tasks_list = tasks.map((task, i) => {
        const due_date = task.due_date
        let text_style = S('fw-500 mr-15')
        // If Done
        if (task.status === 'Done') {
          text_style = {
            ...text_style,
            textDecoration: 'line-through'
          }
        }
        let delete_class = ''
        let delete_text = 'Delete'
        if (data.deleting_task && data.deleting_task.id === task.id) {
          delete_class = ' disabled'
          delete_text = 'Deleting...'
        }
        let due_date_area
        let heading
        if (due_date) {
          const due_date_obj = helpers.friendlyDate(due_date / 1000)
          due_date_area = (
            <span>{ `${due_date_obj.day}, ${due_date_obj.month} ${due_date_obj.date}, ${due_date_obj.year}` }</span>
          )
          task_date = `${due_date_obj.year}-${due_date_obj.month}-${due_date_obj.date}`
          if (!prev_task_date || prev_task_date && prev_task_date !== task_date) {
            let heading_style = {
              ...S('bg-f9f9f9 p-5 pl-10 h-26 font-12 mb-5 br-3 color-acacac'),
              textTransform: 'uppercase'
            }
            // If not first heading add margin-top
            if (i) {
              heading_style = {
                ...heading_style,
                ...S('mt-15')
              }
            }
            heading = (
              <div style={ heading_style }>{ due_date_area }</div>
            )
          }
          prev_task_date = `${due_date_obj.year}-${due_date_obj.month}-${due_date_obj.date}`
        }
        let row_style = S('p-15 pointer h-50 relative')
        if (current_task && current_task.id === task.id) {
          row_style = {
            ...row_style,
            ...S('bg-f5fafe bw-1 solid bc-e4e4e4')
          }
        }
        return (
          <div key={ 'task-' + task.id }>
            { heading }
            <div onClick={ this.props.handleTaskClick.bind(this, task) } className="task-row" style={ row_style }>
              <Button onClick={ this.props.deleteTask.bind(this, task) } style={ S('absolute r-5 t-5') } bsStyle="danger" className={ 'delete' + delete_class }>
                { delete_text }
              </Button>
              <CheckBox
                task={ task }
                editTaskStatus={ this.props.editTaskStatus }
              />
              <span style={ text_style }>
                { task.title }
              </span>
            </div>
          </div>
        )
      })
    }
    return (
      <div style={ S('pr-15') }>
       { tasks_list }
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  data: React.PropTypes.object,
  editTaskStatus: React.PropTypes.func,
  deleteTask: React.PropTypes.func,
  handleTaskClick: React.PropTypes.func
}