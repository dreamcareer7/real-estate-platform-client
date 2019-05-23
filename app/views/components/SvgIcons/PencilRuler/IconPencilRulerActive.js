import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const sizes = {}

// somehow sizes is ending up in markup, even if it is not a valid svg attribute
// until we have a better solution, just render it empty, instead to '[Object object]'
Object.defineProperty(sizes, 'toString', { value: () => '', enumerable: false })

const getDimensions = (size, sizes) => {
  if (size && typeof size.width === 'number' && typeof size.height === 'number') {
    return size
  }
  return size && sizes[size]
    ? sizes[size]
    : { width, height }
}

const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
  if (noStyles) { return '' }
  const dimensions = getDimensions(size, sizes)
  const fillRule = fillColor && fillColorRule ? `${fillColorRule}{ fill: ${fillColor}; }` : ''
  return css`
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    ${fillRule}
  `
}

const propsToCss = ({
  size,
  sizes,
  fillColor,
  fillColorRule,
  noStyles
}) => getCss(size, sizes, fillColor, fillColorRule, noStyles)

const Image = styled.svg`${propsToCss}`

const children = (
  <Fragment>
    <path
      fill='#003BDF'
      d='M11.904 15.166h3.153a.888.888 0 0 0 .874-.9.888.888 0 0 0-.874-.902h-3.153v-2.703h3.153a.888.888 0 0 0 .874-.9.888.888 0 0 0-.874-.902h-3.153V6.157h3.153a.888.888 0 0 0 .874-.901.888.888 0 0 0-.874-.901h-3.153V2.503c0-1.327.945-2.503 2.33-2.503h5.436C20.957 0 22 1.176 22 2.503v19.02c0 1.327-1.043 2.402-2.33 2.402h-5.436c-1.287 0-2.33-1.075-2.33-2.402v-6.357zM2.25 8.984h5.811a.25.25 0 0 1 .25.25v7.759a.25.25 0 0 1-.25.25H2.25a.25.25 0 0 1-.25-.25V9.234a.25.25 0 0 1 .25-.25zm5.624-2.002H2.437a.241.241 0 0 1-.203-.118c-.044-.073-.048-1.165-.013-1.242L4.72.258A.504.504 0 0 1 5.157 0c.18 0 .346.098.437.258l2.5 5.364c.036.078.03 1.17-.014 1.243a.241.241 0 0 1-.206.117zM2.243 19.245h5.826c.134 0 .242.112.242.25v1.252C8.311 22.543 6.9 24 5.156 24 3.413 24 2 22.543 2 20.747v-1.252c0-.138.109-.25.243-.25zm14.514 1.777c.804 0 1.456-.672 1.456-1.501 0-.83-.652-1.502-1.456-1.502-.805 0-1.457.672-1.457 1.502s.652 1.501 1.457 1.501z'
      key='key-0'
    />
  </Fragment>
)

const defaultProps = {
  children,
  viewBox,
  fillColor: null,
  fillColorRule: '&&& path, &&& use, &&& g',
  sizes,
  size: null
}

const propTypes = {
  fillColor: PropTypes.string,
  fillColorRule: PropTypes.string,
  viewBox: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired
    })
  ]),
  sizes: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  })
}

export default Object.assign(Image, {
  getDimensions,
  getCss,
  defaultProps,
  propTypes,
  displayName: 'IconPencilRulerActive'
})
