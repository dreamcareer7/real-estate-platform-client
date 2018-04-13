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
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

const defaultProps = {
  children: [
    <g fill="none" fillRule="evenodd" key="key-0">
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M7.455 4h9.09c.252 0 .455.21.455.47v15.06c0 .26-.203.47-.455.47h-9.09A.463.463 0 0 1 7 19.53V4.47c0-.26.203-.47.455-.47zm5.681 12.235a.476.476 0 0 1-.218.403l-3.842 2.42h7.015V4.942h-2.955v11.294zM7.91 18.692l4.318-2.721V4.94H7.91v13.75zm2.727-9.986c0-.26.204-.471.455-.471s.455.211.455.47v.942c0 .26-.204.47-.455.47a.463.463 0 0 1-.455-.47v-.941z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconOpenHouse'
})