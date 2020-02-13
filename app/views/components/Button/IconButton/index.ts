import styled, { css } from 'styled-components'

import { green } from '../../../utils/colors'

import Button, { ActionButtonProps } from '../ActionButton'
import { getIconSize, getIconStatesStyle } from '../helpers'

interface IconButtonProps extends ActionButtonProps {
  /**
   * When true, the button size will be same as icon size.
   */
  isFit?: boolean
  inverse?: boolean

  /**
   * The size of the button. {small, medium, large, XLarge}
   */
  iconSize?: ActionButtonProps['size']
}

const defaultProps: IconButtonProps = {
  ...Button.defaultProps,
  appearance: 'icon',
  isFit: false,
  iconSize: Button.defaultProps!.size
}

const getColor = props => {
  if (props.appearance === 'primary') {
    return '#fff'
  }

  if (
    props.appearance === 'outline' ||
    (props.appearance === 'icon' && props.inverse)
  ) {
    return '#000'
  }

  return green.primary
}

const checkFit = props => {
  if (props.isFit) {
    const size = getIconSize(props.iconSize)

    return css`
      padding: 0;
      width: ${size};
      height: ${size};
      line-height: ${size};
    `
  }
}

const IconButton = styled(Button)<IconButtonProps>`
  ${props => checkFit(props)};

  ${props =>
    props.appearance === 'icon' && props.inverse ? 'border: none;' : ''};

  > svg {
    width: ${props => getIconSize(props.iconSize)};
    height: ${props => getIconSize(props.iconSize)};
    fill: ${props => getColor(props)};
  }

  ${props => getIconStatesStyle(props)};
`

IconButton.defaultProps = defaultProps

export default IconButton
