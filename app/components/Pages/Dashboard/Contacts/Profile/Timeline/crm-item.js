import React from 'react'
import timeago from 'timeago.js'

import { icons } from '../../../../../../views/CRM/Tasks/List/Table/columns/Type/icons'

export default ({ task }) => {
  const { task_type } = task
  const Icon = icons[task_type] ? icons[task_type].icon : icons.Todo

  const activity = (
    <div className="event">
      <div className="image">
        <Icon style={{ width: 32, height: 32, fill: '#8da2b5' }} />
      </div>

      <div className="info">
        <div
          className="desc"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '.5em'
          }}
        >
          <span
            style={{
              fontSize: 'small',
              marginRight: '0.5em',
              padding: '0 0.5em',
              borderRadius: 30,
              color: '#fff',
              background: '#8da2b5'
            }}
          >
            {task_type}
          </span>
          <span
            style={{
              lineHeight: 1,
              fontSize: '1.5rem'
            }}
            dangerouslySetInnerHTML={{ __html: task.title }}
          />
        </div>

        <div className="time">
          <img src="/static/images/contacts/alert-fill@3x.png" alt="alert" />
          {timeago().format(task.created_at * 1000)}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <a href={`/crm/tasks/${task.id}`} target="_blank">
        {activity}
      </a>
    </div>
  )
}