import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Menu from './Menu'
import { PageTitle } from './PageTitle'
import { H1 } from '../Typography/headings'

const Container = styled.div`
  width: calc(100% - 3em);
  display: flex;
  justify-content: space-between;
  padding: 1.5em 0;
  margin: 0 1.5em 2em;
  background-color: ${props => (props.isFlat ? 'transparent' : '#fff')};
  border-bottom: ${props => (props.isFlat ? 'none' : '1px solid #d4d4d4')};
`

const propTypes = {
  backUrl: PropTypes.string,
  showBackButton: PropTypes.bool,
  isFlat: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object
}

const defaultProps = {
  showBackButton: true,
  isFlat: false,
  style: {}
}

function PageHeader(props) {
  let { title, backUrl, location } = props

  if (location.state && location.state.previousPage) {
    backUrl = location.state.previousPage.url
    title = location.state.previousPage.title
  }

  return (
    <Container
      isFlat={props.isFlat}
      style={props.style}
      hasSubtitle={props.subtitle}
    >
      {title && (
        <PageTitle
          showBackButton={props.showBackButton}
          onClickBackButton={props.onClickBackButton}
          onClickCloseButton={props.onClickCloseButton}
          backUrl={backUrl}
          title={title}
          subtitle={props.subtitle}
        />
      )}
      {React.Children.map(props.children, children => children)}
    </Container>
  )
}

PageHeader.propTypes = propTypes
PageHeader.defaultProps = defaultProps

PageHeader.Menu = Menu
PageHeader.Title = PageTitle
PageHeader.Heading = H1

export default withRouter(PageHeader)
