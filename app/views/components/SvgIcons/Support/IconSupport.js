import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({noStyles}) => !noStyles ? getDimensionsCss() : null}
`

const defaultProps = {
  children: [
    <g
      fill='none'
      key='key-0'
    >
      <path
        d='M0 0h24v24H0z'
      />
      <path
        fill='#000'
        d='M12 0C7.749 0 4.286 3.463 4.286 7.714v.429H3c-1.64 0-3 1.36-3 3v6c0 1.64 1.36 3 3 3h2.571c.71 0 1.286-.576 1.286-1.286V7.714A5.104 5.104 0 0 1 12 2.571a5.104 5.104 0 0 1 5.143 5.143V18.04l-4.153 1.93a2.104 2.104 0 0 0-.991-.255A2.143 2.143 0 0 0 12 24c1.031 0 1.898-.73 2.103-1.7l4.62-2.157H21c1.64 0 3-1.36 3-3v-6c0-1.64-1.36-3-3-3h-1.286v-.429C19.714 3.463 16.251 0 12 0zM3 10.714h1.286v6.857H3c-.26 0-.429-.168-.429-.428v-6c0-.26.17-.429.429-.429zm16.714 0H21c.26 0 .429.17.429.429v6c0 .26-.17.428-.429.428h-1.286v-6.857z'
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconSupport'
})
