// MessagesItem.js
import React, { Component } from 'react'
import ProfileImage from '../../Partials/ProfileImage'
import S from 'shorti'
import helpers from '../../../../../utils/helpers'
import listing_util from '../../../../../utils/listing'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
emojify.setConfig({
  img_dir: '/images/emoji'
})

export default class MessageItem extends Component {
  render() {
    // Data
    const data = this.props.data
    const messages = data.messages
    const message = this.props.message
    let recommendation
    if (message.recommendation)
      recommendation = message.recommendation
    const i = this.props.i
    let first_name

    // Profile image
    let author
    let profile_image_div
    if (message.author) {
      author = message.author
      profile_image_div = (
        <ProfileImage data={ data } user={ author }/>
      )
    }
    // Rebot
    if (!message.author) {
      profile_image_div = (
        <div style={ S('absolute w-35') }>
          <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
        </div>
      )
    }

    // First name
    if (message.author)
      first_name = message.author.first_name

    // Message time
    const message_created = message.created_at.toString().split('.')
    const time_created = helpers.friendlyDate(message_created[0])

    // Message image
    let message_image
    if (message.attachments.length) {
      const attachments = message.attachments
      const attachment = attachments[0]
      const file_url = attachment.url
      const ext = attachment.info['mime-extension']
      let message_thumb
      // If image
      if (ext.indexOf('png') !== -1 || ext.indexOf('jpg') !== -1 || ext.indexOf('gif') !== -1) {
        message_thumb = (
          <div style={ S('w-400 h-300 br-3 bg-url(' + file_url + ') bg-cover bg-center') }></div>
        )
      } else {
        message_thumb = (
          <div style={ S('w-60 mt-10') }>
            <i style={ S('font-60') } className="text-primary fa fa-file-o"></i>
            <br />
            <div style={ S('w-50 text-center relative t-35n font-12 fw-700 color-e0523e') }>
              { ext }
            </div>
          </div>
        )
      }
      message_image = (
        <div className="box-shadow" onClick={ this.props.showFileViewer.bind(this, attachment) } style={ { ...S('mt-10'), cursor: 'zoom-in' } }>
          { message_thumb }
        </div>
      )
    }

    // Listing
    if (message.recommendation && message.recommendation.listing && message.recommendation.listing.cover_image_url) {
      const cover_image_url = message.recommendation.listing.cover_image_url
      message_image = (
        <div className="box-shadow" onClick={ this.props.showListingViewer.bind(this, message.recommendation.listing) } style={ S('pointer w-400 h-300 br-3 bg-url(' + cover_image_url + ') bg-cover bg-center') }></div>
      )
    }

    // Fade in
    let message_class_name
    if (message.fade_in)
      message_class_name = 'fade-in'

    let message_text = message.comment
    if (!message_image && message.comment)
      message_text = emojify.replace(linkifyString(message.comment))

    // Get latest author and group (No profile image)
    if (message.author && !this.props.new_date && !message.recommendation) {
      if (messages[i - 1] && messages[i - 1].author && messages[i - 1].author.id === message.author.id) {
        return (
          <div style={ S('relative mb-5') }>
            <div className="pull-left" style={ S('ml-50') }>
              <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
              { message_image }
            </div>
            <div className="clearfix"></div>
          </div>
        )
      }
    }
    if (recommendation) {
      // Hide recommendation notification message
      if (!message.author) {
        return (
          <div></div>
        )
      }
      const listing = recommendation.listing
      return (
        <div className="message-item" style={ S('relative mb-5') }>
          { profile_image_div }
          <div className="pull-left" style={ S('ml-50') }>
            <b>{ first_name || 'Rebot' }</b>
            <span style={ S('color-ccc ml-20') } >
              { time_created.month } { time_created.date }, { time_created.time_friendly }
            </span>
            <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
            <div style={ S('mt-10 mb-10') }>{ message_image }</div>
            <div style={ S('pointer mb-10') } onClick={ this.props.showListingViewer.bind(this, message.recommendation.listing) }>
              <div style={ S('font-20 fw-700 mt-10') }>${ helpers.numberWithCommas(listing.price) }</div>
              <div style={ S('font-16 fw-700') }>{ listing_util.addressTitle(listing.property.address) }</div>
              <div style={ S('font-14 color-929292') }>
                { listing.property.bedroom_count } Beds&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                { listing.property.bathroom_count } Bath&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                { helpers.numberWithCommas(listing_util.metersToFeet(listing.property.square_meters)) } Sqft
              </div>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
      )
    }
    // Default
    return (
      <div className="message-item" style={ S('relative mb-5') }>
        { profile_image_div }
        <div className="pull-left" style={ S('ml-50') }>
          <b>{ first_name || 'Rebot' }</b>
          <span style={ S('color-ccc ml-20') } >
            { time_created.month } { time_created.date }, { time_created.time_friendly }
          </span>
          <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
          { message_image }
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }
}

// PropTypes
MessageItem.propTypes = {
  data: React.PropTypes.object,
  message: React.PropTypes.object.isRequired,
  i: React.PropTypes.number.isRequired,
  showFileViewer: React.PropTypes.func,
  new_date: React.PropTypes.bool,
  showListingViewer: React.PropTypes.func
}