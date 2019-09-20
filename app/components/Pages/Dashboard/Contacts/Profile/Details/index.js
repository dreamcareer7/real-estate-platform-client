import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'title',
  'first_name',
  'middle_name',
  'last_name',
  'nickname',
  'job_title',
  'company',
  'marketing_name'
]

export function Details(props) {
  return (
    <SectionWithFields
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      section="Details"
      submitCallback={props.submitCallback}
    />
  )
}
