import { css } from 'styled-components'
import Chromath from 'chromath'

import { grey, primary, primaryDark } from '../../../utils/colors'

export const buttonBaseStyle = css`
  width: ${props => (props.isBlock ? '100%' : 'auto')};

  cursor: pointer;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;

  border: none;
  outline: none;
  border-radius: 3px;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: ${props => (props.isBlock ? 'center' : 'initial')};
  flex-wrap: nowrap;
  vertical-align: middle;
  margin: 0;

  font-family: Barlow;
  font-weight: normal;
  text-decoration: none;
  white-space: nowrap;

  &::-moz-focus-inner {
    border: 0;
  }

  &[disabled] {
    color: ${grey.A900};
    cursor: not-allowed;
  }
`

const isNotDisableState = '&:not([disabled]):'

export const ButtonAppearances = {
  primary: css`
    ${buttonBaseStyle};
    color: #fff;
    background-color: ${props => props.brandColor || primary};

    &[disabled] {
      background-color: ${grey.A550};
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: #fff;
      text-decoration: none;
      background-color: ${props =>
        props.brandColor
          ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
          : primaryDark};
    }
  `,
  outline: css`
    ${buttonBaseStyle};
    color: #000;
    border: 1px solid #000;
    background-color: ${props => (props.isActive ? grey.A100 : 'transparent')};

    &[disabled] {
      border-color: ${grey.A550};
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props => props.brandColor || primary};
      border-color: ${props => props.brandColor || primary};
      text-decoration: none;
    }
  `,
  link: css`
    ${buttonBaseStyle};
    color: ${props => props.brandColor || primary};
    background-color: transparent;

    &[disabled] {
      text-decoration: none;
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props =>
        props.brandColor
          ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
          : primaryDark};
      text-decoration: none;
    }
  `,
  icon: css`
    ${buttonBaseStyle};
    background-color: transparent;

    svg {
      fill: ${grey.A900};
    }
  `
}
