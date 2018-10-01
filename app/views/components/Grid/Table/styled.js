import styled from 'styled-components'

const border = '1px solid #d4d4d4'

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 24px;
`

export const ActionsBar = styled.div`
  display: flex;
  flex: 1;
  margin-left: 8px;
`

export const TBody = styled.div`
  ${props => props.css};
`

export const Row = styled.div`
  display: flex;
  justify-items: center;
  ${props =>
    props.multiple &&
    `
    :first-child {
      border-top: none !important;
    }
  `};

  ${props => props.css};
`

export const BodyRow = Row.extend`
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 12px 8px;
  border-top: ${border};

  ${props =>
    props.hoverStyle &&
    `
    :hover {
      ${props.hoverStyle}
    }
  `};
`

export const Cell = styled.div`
  align-self: ${props => props.verticalAlign || 'flex-start'};
  text-align: left;

  ${props =>
    props.width &&
    `
    width: ${props.width}
  `};

  ${props =>
    props.hoverStyle &&
    `
    :hover {
      ${props.hoverStyle}
    }
  `};

  ${props => props.css};
`
