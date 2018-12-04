import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from 'views/utils/colors'

export const SearchInputContainer = styled.div`
  position: relative;

  i {
    position: absolute;
    left: ${props => props.textLength * 8.5}px;
    top: 17px;
    font-size: 10px;
  }
`

export const SearchInput = styled.input`
  width: 250px;
  height: 40px;
  border: none;

  :focus {
    outline: none;
  }
`

export const SearchResults = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  min-width: 300px;
  max-height: 300px;
  overflow: auto;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
`

export const RowContainer = styled(Flex)`
  display: flex;
  padding: 0.5em 1rem;
  background-color: #fff;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`

export const IconContainer = styled(Flex)`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 1rem;
    width: 1rem;
    fill: #ffffff;
  }
`

export const Title = styled.div`
  padding: 0.5em 1rem 0;
  color: ${grey.A900};
  font-weight: 600;
`

export const SectionSeparator = styled.div`
  border-bottom: 1px solid #dce5eb;
  margin: 0 1rem;
`
