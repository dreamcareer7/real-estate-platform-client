import React from 'react'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
// import mapPropsOnChange from 'recompose/mapPropsOnChange'
import { Motion } from 'react-motion'
import { clusterMarkerHOC } from './ClusterMarker.js'

export const simpleMarker = ({
  defaultMotionStyle, motionStyle
}) => (
  <Motion
    defaultStyle={defaultMotionStyle}
    style={motionStyle}
  >
    {
        ({ scale }) => (
          <div
            className="simple-marker"
            style={{
              transform: `translate3D(0,0,0) scale(${scale}, ${scale})`
            }}
          />
        )
    }
  </Motion>
)

export const simpleMarkerHOC = compose(
  defaultProps({
    initialScale: 0.3,
    defaultScale: 0.6,
    hoveredScale: 0.7
  }),
  // resuse HOC
  clusterMarkerHOC
)

export default simpleMarkerHOC(simpleMarker)
