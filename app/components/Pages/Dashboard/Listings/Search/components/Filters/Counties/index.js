import React from 'react'
import pure from 'recompose/pure'
import Select from 'react-select'

import AsyncMultiSelect from '../components/AsyncMultiSelect'
import api from '../../../../../../../../models/listings/search'

const Counties = () =>
  <AsyncMultiSelect
    name="counties"
    label="Counties"
    placeholder="Counties #..."
    loadOptions={api.getCounties}
  />

export default pure(Counties)