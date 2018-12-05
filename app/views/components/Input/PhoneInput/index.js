import React from 'react'
import Input from 'react-text-mask'
import { PhoneNumberUtil } from 'google-libphonenumber'
import _ from 'underscore'

import InputErrorMessage from '../components/InputErrorMessage'

function validate(props) {
  const phoneUtil = PhoneNumberUtil.getInstance()

  try {
    let phoneNumber = phoneUtil.parse(props.value, 'US')

    return phoneUtil.isValidNumber(phoneNumber)
  } catch (error) {
    return false
  }
}

export default props => {
  const { value, showErrorMessage = true, ErrorMessageHandler } = props
  const isValid = validate(props)
  const filteredValue =
    value && value.startsWith('+') ? value.substr(value.length - 10) : value

  const ErrorMessageComponent = ErrorMessageHandler ? (
    <ErrorMessageHandler {...props} />
  ) : (
    <InputErrorMessage message="The value is not a valid U.S phone number" />
  )

  return (
    <div style={{ position: 'relative', display: 'inline' }}>
      <Input
        placeholderChar=" "
        style={{
          border: isValid || !showErrorMessage ? '' : '1px solid #ec4b35'
        }}
        mask={[
          '+',
          '1',
          '(',
          /[1-9]/,
          /\d/,
          /\d/,
          ')',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          /\d/
        ]}
        placeholder="+1(###)###-####"
        {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
        value={filteredValue}
        onChange={e => {
          const maskedValue = e.target.value
          const originalValue = maskedValue
            ? maskedValue
                .replace(/#/g, '')
                .replace(/\(/g, '')
                .replace(/\)/g, '')
                .replace(/\s/g, '')
                .replace(/\-/gi, '')
            : ''

          const data = {
            value: originalValue,
            isValid: validate({ value: originalValue })
          }

          props.onChange(e, data)
        }}
      />

      {filteredValue && !isValid && showErrorMessage && ErrorMessageComponent}
    </div>
  )
}
