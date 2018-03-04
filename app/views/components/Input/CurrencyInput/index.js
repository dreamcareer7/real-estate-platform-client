import React from 'react'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import Input from 'react-text-mask'
import _ from 'underscore'

export default props => {
  const opt = Object.assign(
    {
      suffix: '.00',
      allowNegative: false,
      allowLeadingZeroes: false,
      allowDecimal: false
    },
    props.options || {}
  )

  return (
    <Input
      placeholder="$0.00"
      mask={createNumberMask({
        prefix: '$',
        suffix: opt.suffix,
        allowNegative: opt.allowNegative,
        allowLeadingZeroes: opt.allowLeadingZeroes,
        allowDecimal: opt.allowDecimal
      })}
      {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
      onChange={e => {
        const maskedValue = e.target.value
        const originalValue = maskedValue
          ? parseFloat(maskedValue.replace('$', '').replace(/\,/gi, ''))
          : ''

        props.onChange(e, originalValue)
      }}
    />
  )
}