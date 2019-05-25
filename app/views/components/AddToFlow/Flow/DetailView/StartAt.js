import React from 'react'
import fecha from 'fecha'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import DatePicker from 'components/DateTimePicker/next.js'
import Icon from 'components/SvgIcons/Calendar2/IconCalendar'

import { borderColor, grey } from 'views/utils/colors'

import { StartAtButton } from './styled'

StartAt.propTypes = {
  onChange: PropTypes.func.isRequired
}

function StartAt(props) {
  const today = new Date()

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '0.5em',
        borderBottom: `1px solid ${borderColor}`
      }}
    >
      <div
        style={{
          color: grey.A900,
          fontSize: '0.875rem',
          marginBottom: '0.5em'
        }}
      >
        Starting on:
      </div>

      <DatePicker
        hasTime={false}
        hasDone={false}
        hasRemove={false}
        onDone={props.onChange}
        popUpPosition="top-right"
        initialSelectedDate={today}
        disabledDays={{
          before: today
        }}
        popUpButton={buttonProps => (
          <Flex alignCenter>
            <Icon style={{ width: '1em', height: '1em' }} />
            <StartAtButton onClick={buttonProps.toggleOpen}>
              {fecha.format(buttonProps.selectedDate, 'mediumDate')}
            </StartAtButton>
          </Flex>
        )}
      />
    </div>
  )
}

export default StartAt
