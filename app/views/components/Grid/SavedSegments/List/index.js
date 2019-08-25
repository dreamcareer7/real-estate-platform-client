import React from 'react'
import { connect } from 'react-redux'

import {
  // eslint-disable-next-line import/named
  changeActiveFilterSegment,
  deleteFilterSegment,
  getSavedSegments
} from 'actions/filter-segments'

import {
  getDefaultList,
  getSegments,
  isListFetched,
  selectActiveSavedSegment
} from 'reducers/filter-segments'

import { ShowMoreLess } from 'components/ShowMoreLess'
import LoadingIcon from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Item from './Item'
import { ListTitle, ListItem } from './styled'

class SegmentsList extends React.Component {
  state = {
    deletingItems: []
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const { props } = this

    if (!props.isListFetched) {
      props.getSavedSegments(props.name, { associations: props.associations })
    }
  }

  selectItem = async item => {
    const { props } = this

    await props.changeActiveFilterSegment(props.name, item.id)

    if (props.onChange) {
      props.onChange(item)
    }
  }

  deleteItem = async item => {
    const { name, activeItem } = this.props

    try {
      this.setState(state => ({
        deletingItems: [...state.deletingItems, item.id]
      }))

      await this.props.deleteFilterSegment(name, item)

      this.setState(state => ({
        deletingItems: state.deletingItems.filter(id => id !== item.id)
      }))

      if (activeItem == null || activeItem.id === item.id) {
        this.selectItem(getDefaultList(name))
      }
    } catch (error) {
      // todo
      console.error(error)
    }
  }

  isSelected = id => this.props.activeItem && this.props.activeItem.id === id

  render() {
    const { props } = this

    return (
      <div data-test="lists-list" style={{ marginBottom: '2rem' }}>
        <ListTitle>Lists</ListTitle>

        <ShowMoreLess moreText="More lists" lessText="Less lists">
          {props.list.map(item => {
            const { id } = item

            return (
              <Item
                key={id}
                isDeleting={this.state.deletingItems.includes(id)}
                item={item}
                deleteHandler={this.deleteItem}
                selectHandler={this.selectItem}
                selected={this.isSelected(id)}
              />
            )
          })}
        </ShowMoreLess>

        {props.isFetching && (
          <ListItem>
            <LoadingIcon />
          </ListItem>
        )}
      </div>
    )
  }
}

function mapStateToProps(state, { name, getPredefinedLists }) {
  const { filterSegments } = state[name]

  const predefinedLists = getPredefinedLists(name, state)

  return {
    isListFetched: isListFetched(filterSegments),
    isFetching: filterSegments.isFetching,
    list: getSegments(filterSegments, name, predefinedLists),
    activeItem: selectActiveSavedSegment(filterSegments, name, predefinedLists)
  }
}

const ConnectedSegmentsList = connect(
  mapStateToProps,
  {
    changeActiveFilterSegment,
    deleteFilterSegment,
    getSavedSegments
  }
)(SegmentsList)

ConnectedSegmentsList.defaultProps = {
  getPredefinedLists: name => ({ default: getDefaultList(name) })
}

export default ConnectedSegmentsList
