import React from 'react'
import {
  Row,
  Col,
  Tabs,
  Tab,
  Button,
} from 'react-bootstrap'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import Avatar from 'react-avatar'
import AppStore from '../../../../../stores/AppStore'
import DealDispatcher from '../../../../../dispatcher/DealDispatcher'
import DealForms from '../Forms'
import DealESigns from '../ESigns'
import Uploads from '../Uploads'
import SubmitReviewModal from './submit-review-modal'

export default class DealDashboard extends React.Component {

  constructor(props) {
    super(props)
    this.reviews = {}
    const { id } = props.params
    this.deal = props.deals.list[id] || null
    if (this.deal.reviews) {
      this.fillreviews()
      if (this.deal.files) this.mapReviewsToFiles()
    }

    this.state = {
      activeTab: props.params.tab || 'forms',
      submissions: null,
      envelopes: null,
      files: this.deal.files || null,
      reviewRequestModalIsFreeze: false,
      reviewRequestModalIsActive: false
    }

    this.reviewRequestModalCloseHandler =
      this.reviewRequestModalCloseHandler.bind(this)
    this.reviewRequestModalShowHandler =
      this.reviewRequestModalShowHandler.bind(this)
    this.reviewRequestModalSubmitHandler =
      this.reviewRequestModalSubmitHandler.bind(this)
  }

  componentDidMount() {
    const { activeTab } = this.state
    if (!this.deal) return

    // load data based on active tab
    this.onTabChange(activeTab)
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.params
    const { deals } = nextProps
    const { submissions, envelopes, files } = this.state

    // load deal
    const deal = deals.list[id]
    if (!deal) return

    if (!files && deal.files)
      this.setState({ files: deal.files })

    if (!envelopes && deal.envelopes) {
      const envelopes = this.mapReviewsToDocuments(deal.envelopes)
      this.setState({ envelopes })
    }

    if (!submissions && deal.submissions)
      this.setState({ submissions: deal.submissions })

    if (deal.files && files && deal.files.length > files.length)
      this.setState({ files: deal.files })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return typeof nextProps.deals !== 'undefined'
  }

  fillreviews() {
    const reviews = this.deal.reviews
    if (reviews) {
      this.deal.reviews.forEach((review) => {
        const id = review.file || review.envelope_document
        this.reviews[id] = {
          ...review
        }
      })
    }
  }

  mapReviewsToFiles() {
    const newFiles = this.deal.files.map((file) => {
      const review = this.reviews[file.id] || null
      return {
        ...file,
        review
      }
    })
    this.deal.files = newFiles
    AppStore.data.deals.list[this.deal.id] = this.deal
  }

  mapReviewsToDocuments(envelopes) {
    return envelopes.map((envelope) => {
      if (!envelope.documents)
        return envelope

      const documents = envelope.documents.map((doc) => {
        const review = (this.reviews && this.reviews[doc.id]) || null
        return {
          ...doc,
          review
        }
      })
      return {
        ...envelope,
        documents
      }
    })
  }

  getSubmissions() {
    if (this.state.submissions)
      return

    DealDispatcher.dispatch({
      action: 'get-submissions',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  getEnvelopes() {
    if (this.state.envelopes)
      return

    DealDispatcher.dispatch({
      action: 'get-envelopes',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  reviewRequestModalCloseHandler() {
    this.setState({
      reviewRequestModalIsActive: false
    })
  }
  reviewRequestModalShowHandler() {
    this.setState({
      reviewRequestModalIsActive: true
    })
  }

  async submitReview(review) {
    const { user } = this.props
    const { id, comment, state } = review
    const body = {
      state,
      comment
    }
    const action = {
      id,
      body,
      user,
      type: 'SET_REVIEW'
    }
    this.setState({
      modalIsFreezed: true
    })

    await ConciergeDispatcher.dispatchSync(action)

    this.setState({
      modalIsFreezed: false,
      modalIsActive: false
    })
  }
  reviewRequestModalSubmitHandler() {
    console.log('submit')
  }

  modalCloseHandler() {
    if (!this.state.modalIsFreezed)
      this.setState({ modalIsActive: false })
  }

  preparedEnvelopes(envelopes) {
    let list = []
    envelopes.map((envelope) => {
      if (!envelope.documents)
        return

      envelope.documents.forEach((document, index) => {
        document = {
          ...document,
          index
        }
        list.push(document)
      })
    })
    return list
  }

  render() {
    const deal = this.deal
    let reviewableDocs = []
    const { submissions, envelopes, files, activeTab } = this.state
    if (envelopes && envelopes.length > 0) {
      reviewableDocs = [
        ...this.preparedEnvelopes(envelopes)
      ]
    }
    if (files && files.length > 0) {
      reviewableDocs = [
        ...reviewableDocs,
        ...files
      ]
    }

    if (deal === null)
      return false

    return (
      <div className="dashboard">

        <Row className="header">
          <Col lg={5} md={5} sm={5}>
            <h4>
              <i className="fa fa-angle-left" onClick={() => this.goBack()} />
              { this.getAddress(deal) }
            </h4>
          </Col>

          <Col lg={7} md={7} sm={7}>
            <ul className="menu">
              {
                submissions &&
                <li
                  onClick={this.collectSignatures.bind(this)}
                >
                  <img src="/static/images/deals/pen.svg" />
                </li>
              }
              <li
                onClick={this.reviewRequestModalShowHandler}
              >
                <img src="/static/images/deals/glasses-round.svg" />
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="content">

          <Col lg={3} md={3} sm={3}>

            <div className="sidebar">
              <Row>
                <Col xs={8}>
                  <div className="street">{ this.getAddress(deal) }</div>
                  <div className="address">{ this.getFullAddress(deal) }</div>
                </Col>

                <Col xs={4}>
                  { this.getCoverImage(deal) }
                </Col>
              </Row>

              <div className="hr" />

              <div className="item">
                Status: <span>{ this.getStatus(deal) }</span>
              </div>

              <div className="item">
                Price: <span>{ this.getPrice(deal) }</span>
              </div>

              <div className="hr" />

              {
                deal.roles && deal.roles.map(role => (
                  <Row
                    key={`ROLE_${role.id}`}
                    style={S('mb-15')}
                  >
                    <Col xs={8}>
                      <div>{ role.user.display_name }</div>
                      <div style={{ color: 'gray' }}>{ role.role }</div>
                    </Col>

                    <Col xs={4}>
                      <Avatar
                        round
                        name={role.user.display_name}
                        src={role.user.profile_image_url}
                        size={35}
                      />
                    </Col>
                  </Row>
                  ))
              }

            </div>
          </Col>

          <Col lg={9} md={9} sm={9}>
            <div className="main">
              <Tabs
                defaultActiveKey={activeTab}
                animation={false}
                id="deals-dashboard"
                onSelect={this.onTabChange.bind(this)}
              >
                <Tab eventKey="forms" title="Forms" className="forms">
                  <DealForms
                    submissions={submissions}
                    user={this.props.user}
                    forms={this.props.deals.forms}
                    deal_id={this.props.params.id}
                    activeTab={activeTab}
                  />
                </Tab>

                <Tab eventKey="esigns" title="eSigns" className="eSigns">
                  <DealESigns
                    envelopes={envelopes}
                    user={this.props.user}
                    activeTab={activeTab}
                  />
                </Tab>

                <Tab eventKey="uploads" title="Uploads" className="uploads">
                  <Uploads
                    files={files}
                    user={this.props.user}
                    deal={deal}
                    deal_id={this.props.params.id}
                    activeTab={activeTab}
                  />
                </Tab>
              </Tabs>
            </div>
          </Col>

        </Row>

        <SubmitReviewModal
          documents={reviewableDocs}
          token={this.props.user.access_token}
          isActive={this.state.reviewRequestModalIsActive}
          isFreeze={this.state.reviewRequestModalIsFreeze}
          closeHandler={this.reviewRequestModalCloseHandler}
          submitHandler={this.reviewRequestModalSubmitHandler}
        />
      </div>
    )
  }

  getCoverImage(deal) {
    let src = '/static/images/deals/home.svg'

    if (deal.listing)
      src = deal.listing.cover_image_url

    return <img style={S('mr-10 w-40 br-2')} src={src} />
  }

  getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  onTabChange(id) {
    this.setState({ activeTab: id })

    switch (id) {
      case 'forms':
        this.getSubmissions()
        break

      case 'esigns':
        this.getEnvelopes()
        break

      case 'uploads':
        break
    }
  }

  getAddress(deal) {
    const address = this.getValue(deal, 'street_address')

    if (address.endsWith(','))
      return address.substring(0, address.length - 1)
    return address
  }

  getFullAddress(deal) {
    const city = this.getValue(deal, 'city')
    const state = this.getValue(deal, 'state')
    const postal_code = this.getValue(deal, 'postal_code')
    return `${city}, ${state}, ${postal_code}`.replace(/-,/ig, '')
  }

  getPrice(deal) {
    const price = this.getValue(deal, 'list_price')

    if (price === '-')
      return price

    return `$${this.getNumberWithCommas(price)}`
  }

  getStatus(deal) {
    if (deal.listing)
      return deal.listing.status

    return '-'
  }

  getValue(deal, field) {
    if (deal.context && deal.context[field])
      return deal.context[field]
    else if (deal.proposed_values && deal.proposed_values[field])
      return deal.proposed_values[field]

    return '-'
  }

  goBack() {
    browserHistory.push('/dashboard/deals')
  }

  collectSignatures() {
    if (AppStore.data.deals_signatures) {
      AppStore.data.deals_signatures.documents = {}
      AppStore.emitChange()
    }

    browserHistory.push(`/dashboard/deals/${this.props.params.id}/collect-signatures/documents`)
  }
}
