import LZString from 'lz-string'
import nunjucks from 'nunjucks'

import {
  currencyFilter,
  areaMeterFilter,
  phoneNumberFilter,
  formatDate
} from '../nunjucks-filters'

import Loader from './Loader'

const env = new nunjucks.Environment(new Loader())

env.addFilter('currency', currencyFilter)
env.addFilter('area', areaMeterFilter)
env.addFilter('phone', phoneNumberFilter)
env.addFilter('formatdate', formatDate)
env.addFilter('encode', LZString.compressToEncodedURIComponent)

export default env
