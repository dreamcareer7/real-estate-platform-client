// Settings.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

export default class Settings extends Component {

  render(){
    
    // Data
    const data = this.props.data
    
    return (
      <div id="main-content" className="container">
        <div className="text-center col-sm-12">
          <h1>Settings</h1>
        </div>
      </div>
    )
  }
}