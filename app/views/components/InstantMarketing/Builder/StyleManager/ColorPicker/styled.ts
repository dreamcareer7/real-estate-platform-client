import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

import { ItemContainer } from '../styled'

export const ColorPickerContainer = styled(ItemContainer)`
  div > span > div > span > div {
    border: 1px solid ${borderColor};
  }
`
