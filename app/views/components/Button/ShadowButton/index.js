import styled from 'styled-components'
import PropTypes from 'prop-types'

const propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

const ShadowButton = styled.button`
  padding: 0;
  font-size: 1em;
  font-weight: 500;
  color: ${props => props.color};
  border-width: 0;
  background: transparent;
`

ShadowButton.propTypes = propTypes

export default ShadowButton