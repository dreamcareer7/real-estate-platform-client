import styled from 'styled-components'

import { grey, primary } from '../../../../../views/utils/colors'
import ALink from '../../../../../views/components/ALink'

export const GridContainer = styled.div`
  height: calc(100vh - 161px);
  padding: 2.5em;
  overflow: auto;
`

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  background-color: ${grey.A100};
  padding: 0 16px;
  margin: 15px 0;
  color: ${primary};
  font-size: 17px;
  font-weight: 600;
  position: sticky;
  top: 10px;
  font-weight: ${props => (props.isSelectedDay ? 600 : 400)};
  background-color: ${props => (props.isSelectedDay ? '#eef0f5' : grey.A100)};
  color: ${props => (props.isSelectedDay ? primary : '#000')};
`

export const Title = ALink.extend`
  font-size: 1.25rem;
  font-weight: 500;
`
export const Label = styled.span`
  color: ${grey.A900};
`

export const Indicator = styled.div`
  color: ${grey.A300};
  margin: 0 0.5rem 0 0.5rem;
`
