import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { goTo } from '../../../../utils/go-to'

import Button from '../IconButton'
import Icon from '../../SvgIcons/Close/CloseIcon'

export class CloseButton extends React.Component {
  static propTypes = {
    ...Button.propTypes,
    backUrl: PropTypes.string,
    defaultBackUrl: PropTypes.string
  }

  static defaultProps = {
    ...Button.defaultProps,
    backUrl: '',
    defaultBackUrl: ''
  }

  handleOnClick = () => {
    // Force redirect
    if (this.props.backUrl) {
      return goTo(this.props.backUrl)
    }

    // Redirect using the histroy
    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      browserHistory.goBack()
    }

    // Default
    return goTo(this.props.defaultBackUrl)
  }

  render() {
    return (
      <Button isFit iconSize="large" inverse onClick={this.handleOnClick}>
        <Icon />
      </Button>
    )
  }
}

// todo - refactor its name to PageCloseButton
