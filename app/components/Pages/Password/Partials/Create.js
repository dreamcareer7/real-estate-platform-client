// Create.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Input, Button, Alert, Col } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Create extends Component {
  componentWillMount() {
    if (typeof window === 'undefined')
      return
    const first_name = decodeURIComponent(helpers.getParameterByName('first_name'))
    const last_name = decodeURIComponent(helpers.getParameterByName('last_name'))
    const agent = decodeURIComponent(helpers.getParameterByName('agent'))
    if (agent) {
      if (!AppStore.data.signup)
        AppStore.data.signup = {}
      AppStore.data.signup.first_name = first_name
      AppStore.data.signup.last_name = last_name
      AppStore.data.signup.agent = agent
      AppStore.data.signup.type = 'agent'
      AppStore.data.signup.is_agent = true
      AppStore.emitChange()
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const data = this.props.data
    if (!data.signup || !data.signup.type) {
      AppStore.data = {
        submitting: false,
        errors: true,
        show_message: true,
        type_error: true
      }
      AppStore.emitChange()
      return
    }
    AppStore.data.submitting = true
    AppStore.emitChange()
    // Get token
    const password = this.refs.password.getInputDOMNode().value.trim()
    const token = decodeURIComponent(helpers.getParameterByName('token'))
    const email = decodeURIComponent(helpers.getParameterByName('email'))
    let first_name
    let last_name
    if (data.signup && data.signup.first_name)
      first_name = data.signup.first_name
    if (data.signup && data.signup.last_name)
      last_name = data.signup.last_name
    if (this.refs.first_name)
      first_name = this.refs.first_name.refs.input.value.trim()
    if (this.refs.last_name)
      last_name = this.refs.last_name.refs.input.value.trim()
    const type = data.signup.type
    const form_data = {
      password,
      token,
      email,
      first_name,
      last_name,
      type
    }
    // Set agent
    if (data.signup && data.signup.agent)
      form_data.agent = data.signup.agent
    this.props.handleSubmit('create-password', form_data)
  }

  handleTypeClick(type) {
    AppStore.data.signup.type = type
    AppStore.emitChange()
    this.testForDisabled()
  }

  testForDisabled() {
    const data = this.props.data
    if (data.signup)
      delete AppStore.data.signup.can_submit
    const password = this.refs.password.refs.input.value.trim()
    let first_name
    let last_name
    if (data.signup && data.signup.first_name)
      first_name = data.signup.first_name
    if (data.signup && data.signup.last_name)
      last_name = data.signup.last_name
    if (this.refs.first_name)
      first_name = this.refs.first_name.refs.input.value.trim()
    if (this.refs.last_name)
      last_name = this.refs.last_name.refs.input.value.trim()
    if (data.signup && data.signup.type && password && first_name && last_name)
      AppStore.data.signup.can_submit = true
    AppStore.emitChange()
  }

  handleKeyUp() {
    this.testForDisabled()
  }

  handleNameChange(type, e) {
    const value = e.target.value
    if (!AppStore.data.signup)
      AppStore.data.signup = {}
    if (type === 'first')
      AppStore.data.signup.first_name = value
    if (type === 'last')
      AppStore.data.signup.last_name = value
    AppStore.emitChange()
  }

  render() {
    const data = this.props.data
    const errors = data.errors
    let password_style
    let password_error
    let message
    let message_text
    let alert_style
    // Errors
    if (errors) {
      if (data.password_error) {
        password_error = data.password_error
        password_style = 'error'
        alert_style = 'danger'
        if (password_error === 'too-short')
          message_text = 'Your password must be at least 6 characters long.'

        if (password_error === 'no-match')
          message_text = `Your passwords don't match`
      }
    }
    // Show message
    if (data.show_message) {
      // Success
      if (data.status === 'success') {
        alert_style = 'success'
        message_text = `Your password is now changed.  You may now sign in.`
      }

      // Request error
      if (data.request_error) {
        alert_style = 'danger'
        message_text = (
          <div>
            There was an error with this request.  Please <a href="/password/forgot">request a new password</a>.
          </div>
        )
      }

      // Type error
      if (data.type_error) {
        alert_style = 'danger'
        message_text = (
          <div>
            You must select an account type.
          </div>
        )
      }

      message = (
        <Alert bsStyle={ alert_style }>
          { message_text }
        </Alert>
      )
    }

    const submitting = data.submitting
    let submitting_class = ''
    if (submitting)
      submitting_class = 'disabled'
    // Type buttons
    const type_button_style = S('w-100p mr-5 color-9b9b9b font-15 h-46')
    const button_active_style = S('border-1-solid-35b863 color-35b863 bg-fff')
    let agent_button_style = type_button_style
    let agent_button_text = 'I\'m an agent'
    if (data.signup && data.signup.type === 'agent') {
      agent_button_text = (
        <span><i className="fa fa-check-circle" style={ S('color-35b863') }></i>&nbsp;&nbsp;I'm an agent</span>
      )
      agent_button_style = {
        ...agent_button_style,
        ...button_active_style
      }
    }
    let client_button_text = 'I\'m a client'
    let client_button_style = type_button_style
    if (data.signup && data.signup.type === 'client') {
      client_button_text = (
        <span><i className="fa fa-check-circle" style={ S('color-35b863') }></i>&nbsp;&nbsp;I'm a client</span>
      )
      client_button_style = {
        ...client_button_style,
        ...button_active_style
      }
    }
    // Disabled
    let is_disabled = true
    let disabled_class = ' disabled'
    if (data.signup && data.signup.can_submit) {
      disabled_class = ''
      is_disabled = false
    }
    if (submitting)
      is_disabled = true
    const brand_style = {
      ...S('color-cecdcd mb-20 font-26 text-left'),
      letterSpacing: '1.5px'
    }
    let first_name
    if (data.signup && data.signup.first_name)
      first_name = data.signup.first_name
    let last_name
    if (data.signup && data.signup.last_name)
      last_name = data.signup.last_name
    let name_area = (
      <div>
        <Col sm={ 6 } style={ S(data.is_mobile ? 'mb-10 p-0 mr-0 pr-0' : 'p-0 pr-10') }>
          <Input autoComplete={ false } onChange={ this.handleNameChange.bind(this, 'first') } value={ first_name } style={ S('font-15') } bsSize="large" onKeyUp={ this.handleKeyUp.bind(this) } placeholder="First Name" type="text" ref="first_name"/>
        </Col>
        <Col sm={ 6 } style={ S('p-0') }>
          <Input autoComplete={ false } onChange={ this.handleNameChange.bind(this, 'last') } value={ last_name } style={ S('font-15') } bsSize="large" onKeyUp={ this.handleKeyUp.bind(this) } placeholder="Last Name" type="text" ref="last_name"/>
        </Col>
      </div>
    )
    let type_area = (
      <div style={ S('w-100p mb-10') }>
        <Col style={ S(data.is_mobile ? 'mb-10 p-0 mr-0 pr-0' : 'p-0 pr-10') } sm={ 6 }>
          <Button bsSize="large" onClick={ this.handleTypeClick.bind(this, 'agent') } style={ agent_button_style } type="button" className="btn btn-default">
            { agent_button_text }
          </Button>
        </Col>
        <Col style={ S('p-0') } sm={ 6 }>
          <Button bsSize="large" onClick={ this.handleTypeClick.bind(this, 'client') } style={ client_button_style } type="button" className="btn btn-default">
            { client_button_text }
          </Button>
        </Col>
        <div className="clearfix"></div>
      </div>
    )
    if (first_name && last_name) {
      name_area = <div/>
      type_area = <div/>
    }
    let main_content = (
      <div>
        <Col sm={ 5 } className={ data.is_mobile ? 'hidden' : '' }>
          <img style={ S('w-100p') } src="/images/signup/house.png" />
        </Col>
        <Col sm={ 7 }>
          <div className="tk-calluna-sans" style={ brand_style }>Rechat</div>
          <div style={ S('color-000 mb-0 text-left font-36') }>Thanks{ data.signup && data.signup.is_agent && first_name ? ' ' + first_name : ''}!  You're almost there...</div>
          <div style={ S('color-9b9b9b mb-20 text-left font-15') }>Please fill out the details below to set up your profile.</div>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            { name_area }
            <Input autoComplete={ false } style={ S('font-15') } bsSize="large" onKeyUp={ this.handleKeyUp.bind(this) } bsStyle={ password_style } placeholder="New Password" type="password" ref="password"/>
            { type_area }
            { message }
            <Button bsSize="large" type="submit" ref="submit" className={ disabled_class + submitting_class + 'btn btn-primary' } disabled={ is_disabled ? 'true' : '' } style={ S('w-100p') }>
              { submitting ? 'Submitting...' : 'Continue' }
            </Button>
          </form>
        </Col>
      </div>
    )
    if (data.status === 'success') {
      main_content = (
        <div>
          { message }
          <Link style={ S('w-100p') } className="btn btn-primary" to="/signin">Sign in</Link>
        </div>
      )
    }
    let module_style = S('w-100p maxw-950')
    if (data.is_mobile)
      module_style = S('w-100p')
    return (
      <div style={ module_style }>
        { main_content }
      </div>
    )
  }
}

// PropTypes
Create.propTypes = {
  data: React.PropTypes.object,
  handleSubmit: React.PropTypes.func.isRequired
}