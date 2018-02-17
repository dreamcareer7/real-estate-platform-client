import { combineReducers } from 'redux'
import list from './list'
import tags from './tags'
import spinner from './spinner'
import importOutlook from './importOutlook'

export default combineReducers({
  list,
  tags,
  spinner,
  importOutlook
})
