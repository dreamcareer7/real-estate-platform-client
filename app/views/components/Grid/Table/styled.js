import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  margin-top: 16px;
`

export const Header = styled.div``
export const Body = styled.div``

const Row = styled.div`
  display: flex;
`

export const HeaderRow = Row.extend``

export const BodyRow = Row.extend`
  display: flex;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid #dce5eb;
`

const Cell = styled.div`
  text-align: left;

  ${props =>
    props.width &&
    `
    width: ${props.width}
  `};
`

export const HeaderCell = Cell.extend`
  font-size: 14px;
  font-weight: 500;
  color: #5a7390;
`

export const BodyCell = Cell.extend`
  font-size: 14px;
  font-weight: 400;
  color: #1d364b;
`
