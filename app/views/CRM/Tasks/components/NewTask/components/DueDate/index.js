import React from 'react'

import { getTime } from '../../../../../../../utils/get-time'
import { getTimes } from '../../../../../../../utils/get-times'
import { todayDate } from '../../../../../../../utils/today-date'

import { DateTimeField } from '../../../../../../components/final-form-fields/DateTimeField'

const today = todayDate()

const tomorrow = today + 24 * 60 * 60 * 1000

function getDateOptions(customDateValue = tomorrow) {
  return [
    {
      title: 'Today',
      value: today
    },
    {
      title: 'Tomorrow',
      value: tomorrow
    },
    {
      title: 'Custom Date',
      value: customDateValue,
      needsDatePicker: true
    }
  ]
}

export default function DueDate({ selectedDate }) {
  const timeItems = getTimes().filter(
    time =>
      selectedDate.value !== today || time.value > getTime(new Date() || time)
  )

  const dateOptions = getDateOptions(selectedDate.value)

  return (
    <DateTimeField
      name="due"
      isRequired
      id="due-date"
      title="Due Date"
      timeItems={timeItems}
      dateItems={dateOptions}
      selectedDate={selectedDate}
      defaultSelectedDate={dateOptions[1]}
      datePickerModifiers={{
        disabled: {
          before: new Date()
        }
      }}
    />
  )
}
