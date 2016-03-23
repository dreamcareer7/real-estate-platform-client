// Landing.js
import React, { Component } from 'react'
import { Col, Input, Button } from 'react-bootstrap'
import S from 'shorti'
import emojify from 'emojify.js'
emojify.setConfig({
  img_dir: '/images/emoji'
})

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

// Store
import AppStore from '../../stores/AppStore'

export default class Landing extends Component {

  componentWillMount() {
    if (process.env.NODE_ENV === 'development')
      this.getContent()
  }

  componentDidMount() {
    AppStore.data.blinking_cursor = true
    AppStore.data.animation_started = true
    AppStore.data.current_text = 'smarter'
    AppStore.emitChange()
    setTimeout(() => {
      AppDispatcher.dispatch({
        action: 'landing-text-animation'
      })
    }, 3000)
  }

  getContent() {
    AppDispatcher.dispatch({
      action: 'get-content',
      slug: 'landing-page',
      rendered: 'client'
    })
  }

  showIntercom(e) {
    e.preventDefault()
    // Intercom('show')
  }

  render() {
    // Data
    const data = this.props.data
    let blinking_cursor = AppStore.data.blinking_cursor
    let video_src = AppStore.data.video_src
    if (!video_src)
      video_src = 'young_agent'
    let current_text = data.initial_text
    if (AppStore.data.animation_started)
      current_text = AppStore.data.current_text
    // Blinking cursor
    if (typeof blinking_cursor === 'undefined')
      blinking_cursor = true
    if (blinking_cursor)
      blinking_cursor = 'blinking-cursor'
    else
      blinking_cursor = ''

    // Content from data props
    // Subheadline
    let subheadline
    if (data.content)
      subheadline = data.content.subheadline

    // Call to action
    let call_to_action
    if (data.content)
      call_to_action = data.content.call_to_action

    // Placeholder text
    let placeholder_text
    if (data.content)
      placeholder_text = data.content.placeholder_text

    // Styles
    const page_style = {
      position: 'relative',
      height: '100%',
      background: '#000',
      color: '#ffffff'
    }
    const navbar_style = {
      border: 'none',
      background: 'none'
    }
    // const signin_btn_style = S('color-fff w-130 p-10 pt-7 pb-7')
    // const collapse_style = {
    //   ...S('mt-20'),
    //   border: 'none',
    //   boxShadow: 'none'
    // }
    const headline_style = S('mb-35')
    const tag_style = S('font-22 mb-40')
    const form_wrap_style = {
      ...S('br-4 p-30 pb-20'),
      'backgroundColor': 'rgba(0, 0, 0, 0.5)'
    }
    const footer_style = {
      ...S('absolute b-0 w-100p mb-20 pt-20 color-ededed font-13  z-2'),
      borderTop: '1px solid rgba(168,168,168, 0.3)'
    }
    const current_text_style = {
      fontStyle: 'italic'
    }

    // Get video and text from random number
    const headline_text = (
      <div>
        From search to close be<br/><span style={ current_text_style }>{ current_text }</span><span className={ blinking_cursor }>|</span>
      </div>
    )

    const video = (
      <video style={ S('z-0 absolute') } autoPlay="true" loop="true" className="fullscreen-bg__video">
        <source src={'/videos/landing/' + video_src + '.webm'} type="video/webm"/>
        <source src={'/videos/landing/' + video_src + '.mp4'} type="video/mp4"/>
        <source src={'/videos/landing/' + video_src + '.ogv'} type="video/ogg"/>
      </video>
    )

    let call_to_action_text
    if (call_to_action) {
      call_to_action_text = (
        <p style={ S('pt-0 p-10 font-17') } dangerouslySetInnerHTML={ { __html: emojify.replace(call_to_action) } } >
        </p>
      )
    }

    return (
      <div className="page-landing page-bg-video" style={ page_style }>
        <div className="overlay"></div>
        { video }
        <header style={ S('absolute w-100p z-3') }>
          <nav className="navbar navbar-default" style={ navbar_style }>
            <div className="container-fluid">
              <div className="navbar-header">
                {
                  /*
                  <button style={ S('mt-15') } type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-link" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  */
                }
                <div className="pull-left" style={ S('mt-20 ml-0') }><img style={ S('w-24') } src="images/landing/logo@2x.png" /></div>
                <div className="tk-calluna-sans pull-left" style={ S('font-28 ml-10 mt-12 color-fff') }>Rechat</div>
              </div>
              {
                /*
                <div style={ collapse_style } className="collapse navbar-collapse text-center" id="main-link">
                  <ul className="nav navbar-nav navbar-right">
                    <li className="contact-us-btn" style={ S('mr-20') }>
                      <a onClick={ this.showIntercom } href="#" style={ S('color-fff relative t-6n') }>Contact Us</a>
                    </li>
                    <li>
                      <a className="btn btn-default center-block sign-in__button" href="/signin" style={ signin_btn_style }>Sign in</a>
                    </li>
                  </ul>
                </div>
              */
              }
            </div>
          </nav>
        </header>
        <main className="container" style={ S('h-100p z-2 relative') }>
          <div className="landing-main text-center" style={ S('h-100p') }>
            <div className="center-block" style={ S('maxw-750 mt-50n') }>
              <h1 className="tempo headline" style={ headline_style }>
                { headline_text }
              </h1>
              <p style={ tag_style }>
                { subheadline }
              </p>
              <div className="form-wrap center-block" style={ form_wrap_style }>
                { call_to_action_text }
                <form onSubmit={ this.showThankYou } action="//rechat.us11.list-manage.com/subscribe/post?u=c21e4aeea43aececadaf53146&amp;id=7f1ad19560" method="post" name="mc-embedded-subscribe-form" target="_blank">
                  <Col className="form-input--email" sm={8} style={ S('pl-0') }>
                    <Input style={ S('w-100p') } bsSize="large" type="email" name="EMAIL" placeholder={ placeholder_text }/>
                    <div style={ S('l-5000n absolute') } aria-hidden="true">
                      <input type="text" name="b_c21e4aeea43aececadaf53146_7f1ad19560" tabIndex="-1" value="" />
                    </div>
                  </Col>
                  <Col sm={4} style={ S('pl-0 pr-0') }>
                    <Button style={ S('w-100p') } bsStyle="primary" bsSize="large" type="submit">Notify Me!</Button>
                  </Col>
                </form>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer" style={ footer_style }>
          <div className="container">
            <Col className="footer-text footer-text--left" sm={6}>
              Made with <img src="/images/landing/heart.png" /> by Rechat | <a onClick={ this.showIntercom } href="/">Contact Us</a>
            </Col>
            <Col className="footer-text footer-text--right" sm={6}>
              Rechat Inc. &copy; { new Date().getFullYear() }. All Rights Reserved. <a href="/terms">Terms of Service</a> | <a href="/terms/mls">MLS Terms</a> | <a href="/privacy">Privacy Policy</a>
            </Col>
          </div>
        </footer>
      </div>
    )
  }
}

// PropTypes
Landing.propTypes = {
  data: React.PropTypes.object
}